import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//import { toast } from "react-toastify";
import CustomButton from "@/components/Custom/CustomButton";
import SearchBar from "@/components/ChallengeManagement/public/SearchBar";
import UserCardList from "@/components/ChallengeManagement/public/UserCardsList";
import BackButton from "@/components/ChallengeManagement/edit/BackButton";
import ImageAndBadgeContainerEdit from "@/components/ChallengeManagement/edit/ImageAndBadgeContainerEdit";
import TitleAndDescriptionInput from "@/components/ChallengeManagement/edit/TitleAndDescriptionInput";
import DateAndLocationInput from "@/components/ChallengeManagement/edit/DateAndLocationInput";
import type { UserProfile } from "@/types/userTypes";
import type { ChallengeData } from "@/types/challengeElementsTypes";

const DEFAULT_IMG =
  "https://www.muchbetteradventures.com/magazine/content/images/size/w2000/2024/04/mount-everest-at-sunset.jpg";

const ChallengeEdit: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = (location.state?.challenge as ChallengeData) ?? {};

  // If no challenge passed → redirect or show error
  if (!incoming || Object.keys(incoming).length === 0) {
    return <div className="text-center py-10">چالش یافت نشد!</div>;
  }

  const {
    id, // Important: challenge ID for update
    Img = DEFAULT_IMG,
    title = "عنوان چالش",
    description = "توضیحات چالش...",
    dateRange = "تاریخ چالش",
    location: challengeLocation = "مکان چالش",
    members: participants = [],
    commentsEnabled = false,
    categories = [],
    type = "عمومی",
  } = incoming;

  // Local states
  const [image, setImage] = useState(Img);
  const [users, setUsers] = useState<UserProfile[]>(participants);
  const [searchTerm, setSearchTerm] = useState("");
  const [challengeTitle, setChallengeTitle] = useState(title);
  const [challengeDescription, setChallengeDescription] = useState(description);
  const [challengeDate, setChallengeDate] = useState(dateRange);
  const [challengeLocationState, setChallengeLocation] = useState(challengeLocation);
  const [isSaving, setIsSaving] = useState(false);

  // Helper: Convert Persian date string like "۱۴۰۴/۰۹/۱۰ - ۱۴۰۴/۰۹/۲۰" → ISO dates
  const parsePersianDateRange = (dateStr: string): { start: string; end: string } | null => {
    const parts = dateStr.split(/[\s\-–]+/).map(p => p.trim()).filter(Boolean);
    if (parts.length < 2) return null;

    // Simple conversion (you can use 'jalali-moment' for accuracy)
    const toGregorian = (jalali: string) => {
      const [y, m, d] = jalali.split("/").map(Number);
      // Very rough approximation (replace with jalali-moment if needed)
      const gregorian = new Date(y + 621, m - 1, d);
      return gregorian.toISOString().split("T")[0];
    };

    try {
      const start = toGregorian(parts[0]);
      const end = toGregorian(parts[parts.length - 1]);
      return {
        start: `${start}T00:00:00Z`,
        end: `${end}T23:59:59Z`,
      };
    } catch {
      return null;
    }
  };

  const handleDelete = (id: string, username: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
   // toast.info(`${username} حذف شد`);
  };

  const handleBack = () => navigate(-1);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFinishEditing = async () => {
    if (!challengeTitle.trim()) {
      //toast.error("عنوان چالش الزامی است");
      return;
    }

    setIsSaving(true);

    const dateParsed = parsePersianDateRange(challengeDate);
    const payload = {
      title: challengeTitle.trim(),
      description: challengeDescription.trim(),
      category_id: categories[0]?.id || 1,
      max_participants: 100, // Change if you have a field
      visibility: type === "خصوصی" ? 2 : 1, // 1=public, 2=private
      rule: challengeDescription,
      comments_enabled: commentsEnabled,
      start_time: dateParsed?.start || "2025-12-01T00:00:00Z",
      end_time: dateParsed?.end || "2025-12-31T23:59:59Z",
      timezone: "UTC",
      image_url: image !== DEFAULT_IMG ? image : Img, // base64 or URL
      invited_user_ids: users.map(u => u.id), // or usernames if needed
    };

    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/challenges/${id}` : `/api/challenges`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`, // Uncomment if auth needed
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "خطا در ارتباط با سرور");
      }

      const result = await response.json();

      //toast.success(id ? "چالش با موفقیت بروز شد" : "چالش با موفقیت ایجاد شد");

      // Navigate to challenge detail page
      navigate("/challenge", {
        state: { challenge: result },
        replace: true,
      });
    } catch (error: any) {
      console.error("Save challenge error:", error);
      //toast.error(error.message || "ذخیره چالش ناموفق بود");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="flex-1 flex flex-col justify-start items-center w-full">
        <div className="flex justify-between w-full items-center max-w-xl">
          <BackButton onClick={handleBack} />
        </div>

        <ImageAndBadgeContainerEdit onImageChange={handleImageChange} imageUrl={image} />

        <div className="w-full max-w-xl">
          <TitleAndDescriptionInput
            title={challengeTitle}
            onTitleChange={setChallengeTitle}
            description={challengeDescription}
            onDescriptionChange={setChallengeDescription}
          />
        </div>

        <div className="space-y-4 mb-4 text-right w-full max-w-xl">
          <DateAndLocationInput
            challengeDate={challengeDate}
            challengeLocation={challengeLocationState}
            onDateChange={setChallengeDate}
            onLocationChange={setChallengeLocation}
          />
        </div>

        <div className="text-right mb-1 mt-6 max-w-2xl w-full" dir="rtl">
          <h2 className="text-xl font-semibold text-black mb-4">شرکت کنندگان</h2>
        </div>

        <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />

        <UserCardList users={filteredUsers} onDelete={handleDelete} isOwner={true} />
      </div>

      <div className="flex justify-center w-full mt-10">
        <CustomButton
          disabled={isSaving}
          className="w-full max-w-xl bg-primary rounded-primary-radius p-5 text-lg hover:bg-primary disabled:opacity-70"
          onClick={handleFinishEditing}
        >
          {isSaving ? "در حال ذخیره..." : "اتمام ویرایش"}
        </CustomButton>
      </div>
    </div>
  );
};

export default ChallengeEdit;