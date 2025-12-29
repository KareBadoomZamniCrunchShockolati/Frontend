// src/pages/ChallengeEdit.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "@/components/Custom/CustomButton";
import SearchBar from "@/components/ChallengeManagement/public/SearchBar";
import UserCardList from "@/components/ChallengeManagement/public/UserCardsList";
import BackButton from "@/components/ChallengeManagement/edit/BackButton";
import ImageAndBadgeContainerEdit from "@/components/ChallengeManagement/edit/ImageAndBadgeContainerEdit";
import TitleAndDescriptionInput from "@/components/ChallengeManagement/edit/TitleAndDescriptionInput";
import DateAndLocationInput from "@/components/ChallengeManagement/edit/DateAndLocationInput";
import CategorySelectEdit from "@/components/ChallengeManagement/edit/categorySelectEdit";
import CustomToast from "@/components/Custom/CustomToast";
import LoadingPage from "@/components/Custom/LoadingPage";
import useUserStore from "@/store/userStore/userStore";
import type { UserProfile } from "@/types/userTypes";

import {
  fetchChallengeById,
  updateChallenge,
  removeParticipantFromChallenge,
  fetchChallengeCategories,
} from "@/services/challengeService";

import type { ChallengeCategoryType } from "@/types/challengeCreateTypes";
import type { ChallengeData } from "@/types/challengeCreateTypes";

import { DEFAULT_IMG } from "@/data/mockImages";

// Use the correct fixed map component
import LocationMapPicker from "@/components/Custom/LocationMap";

const ChallengeEdit: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { token, userId } = useUserStore();

  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);

  const [image, setImage] = useState<string>(DEFAULT_IMG);
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartDateTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [challengeLocation, setChallengeLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [categories, setCategories] = useState<ChallengeCategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");

  const [participants, setParticipants] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadChallenge = async () => {
      if (!challengeId || !token || !userId) {
        CustomToast("لطفاً وارد حساب کاربری شوید", "error");
        navigate(-1);
        return;
      }

      try {
        const data: ChallengeData = await fetchChallengeById(challengeId);

        if (data.creator_id !== Number(userId)) {
          CustomToast("شما اجازه ویرایش این چالش را ندارید", "error");
          navigate(`/challenge/${challengeId}`);
          return;
        }

        setIsCreator(true);
        setChallenge(data);

        setChallengeTitle(data.title);
        setChallengeDescription(data.description || "");
        setImage(data.image_url || DEFAULT_IMG);
        setChallengeLocation(data.address || ""); 
        setLatitude(data.latitude ?? null);
        setLongitude(data.longitude ?? null);

        setStartDate(data.start_time.split("T")[0]);
        setStartDateTime(data.start_time.split("T")[1]?.slice(0, 5) || "09:00");
        setEndDate(data.end_time.split("T")[0]);
        setEndTime(data.end_time.split("T")[1]?.slice(0, 5) || "18:00");

        if (data.category_name) {
          setSelectedCategoryName(data.category_name);
        }

        const others = data.participants.filter(
          (p) => p.user_id !== Number(userId)
        );
        setParticipants(others);
      } catch (err) {
        CustomToast("خطا در بارگذاری چالش", "error");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadChallenge();
  }, [challengeId, token, userId, navigate]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchChallengeCategories();
        setCategories(cats);
      } catch (err) {
        CustomToast("خطا در بارگذاری دسته‌بندی‌ها", "error");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteParticipant = async (participantId: string | number) => {
    if (!challengeId) return;

    try {
      await removeParticipantFromChallenge(challengeId, participantId);
      setParticipants((prev) =>
        prev.filter((u) => u.user_id !== Number(participantId))
      );
      CustomToast("کاربر با موفقیت حذف شد", "success");
    } catch (err: any) {
      CustomToast(err.message || "حذف ناموفق بود", "error");
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSave = async () => {
    if (!challengeTitle.trim()) {
      CustomToast("عنوان چالش نمی‌تواند خالی باشد", "error");
      return;
    }
    if (!startDate || !startTime || !endDate || !endTime) {
      CustomToast("تاریخ و ساعت شروع و پایان الزامی است", "error");
      return;
    }
    if (!selectedCategoryName) {
      CustomToast("لطفاً دسته‌بندی چالش را انتخاب کنید", "error");
      return;
    }

    setIsSaving(true);

    const selectedCat = categories.find((c) => c.name === selectedCategoryName);
    const category_id = selectedCat?.id || null;

    const payload = {
      title: challengeTitle.trim(),
      description: challengeDescription.trim() || null,
      image_url: image !== DEFAULT_IMG ? image : null,
      address: challengeLocation.trim() || null, // ← Use address field
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      start_time: `${startDate}T${startTime}:00Z`,
      end_time: `${endDate}T${endTime}:59Z`,
      timezone: "UTC",
      category_id,
    };

    try {
      await updateChallenge(challengeId!, payload);
      CustomToast("چالش با موفقیت بروزرسانی شد!", "success");
      navigate(`/challenge/${challengeId}`, { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.details?.details ||
        err.message ||
        "ذخیره تغییرات ناموفق بود";
      CustomToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredParticipants = participants.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingPage />;
  }

  if (!challenge || !isCreator) return null;

  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="flex-1 flex flex-col justify-start items-center w-full">
        <div className="flex justify-between w-full items-center max-w-xl mb-6">
          <BackButton onClick={() => navigate(-1)} />
          <h1 className="text-2xl font-bold text-primary">ویرایش چالش</h1>
        </div>

        <ImageAndBadgeContainerEdit
          onImageChange={handleImageChange}
          imageUrl={image}
        />

        <div className="w-full max-w-xl space-y-10 mt-6">
          <TitleAndDescriptionInput
            title={challengeTitle}
            onTitleChange={setChallengeTitle}
            description={challengeDescription}
            onDescriptionChange={setChallengeDescription}
          />

          <DateAndLocationInput
            startDate={startDate}
            startTime={startTime}
            endDate={endDate}
            endTime={endTime}
            location={challengeLocation}
            onStartDateChange={setStartDate}
            onStartTimeChange={setStartDateTime}
            onEndDateChange={setEndDate}
            onEndTimeChange={setEndTime}
            onLocationChange={setChallengeLocation}
          />

          <div className="space-y-3">
            <LocationMapPicker
              onLocationSelect={handleLocationSelect}
              initialPosition={
                latitude && longitude ? [latitude, longitude] : null
              }
            />
          </div>

          <CategorySelectEdit
            categories={categories}
            loading={loadingCategories}
            selectedCategory={selectedCategoryName}
            onCategoryChange={setSelectedCategoryName}
          />

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-right">
              شرکت‌کنندگان ({participants.length} نفر)
            </h2>
            {participants.length > 0 ? (
              <>
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchTermChange={setSearchTerm}
                />
                <UserCardList
                  users={filteredParticipants}
                  onDelete={handleDeleteParticipant}
                  isOwner={true}
                />
              </>
            ) : (
              <p className="text-center text-primary py-8 bg-white rounded-primary-radius">
                هنوز کسی عضو چالش نشده است
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full mt-10 pb-6">
        <CustomButton
          disabled={isSaving}
          onClick={handleSave}
          className="w-full max-w-xl bg-primary text-white rounded-primary-radius p-5 text-lg font-medium disabled:opacity-70"
        >
          {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </CustomButton>
      </div>
    </div>
  );
};

export default ChallengeEdit;