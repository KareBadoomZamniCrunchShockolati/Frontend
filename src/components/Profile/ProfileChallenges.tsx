import React, { useState, useEffect } from "react";
import { Form, Formik } from "formik";
import { Search } from "lucide-react";
import ChallengeCard from "../Custom/ChallangeCard";
import CustomInput from "../Custom/CustomInput";
import CustomDropdown from "../Custom/CustomDropdown";
import { getParticipatingChallengesService, getCreatedChallengesService } from "@/services/userService";
import type { Challenge } from "@/types/challengeTypes";
import { convertToJalali } from "../Custom/ConvertToJalali";

const ProfileChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 1, name: "ورزشی" },
    { id: 2, name: "هنری" },
    { id: 3, name: "علمی" },
    { id: 4, name: "تفریحی" },
    { id: 0, name: "چالش‌های من" }, // گزینه جدید برای چالش‌های ساخته شده توسط کاربر
  ];

  const [checkedCategories, setCheckedCategories] = useState<{
    [key: number]: boolean;
  }>({});
  const [search, setSearch] = useState("");

  const sampleAvatars = [
    {
      name: "علی",
      avatar:
        "https://images.unsplash.com/photo-1502764613149-7f1d229e230f?auto=format&fit=crop&w=50&q=80",
    },
    {
      name: "فاطمه",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=50&q=80",
    },
    {
      name: "محمد",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=50&q=80",
    },
    {
      name: "زهرا",
      avatar:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=50&q=80",
    },
    {
      name: "حسن",
      avatar:
        "https://images.unsplash.com/photo-1544005313-2f8f0f2d8b0f?auto=format&fit=crop&w=50&q=80",
    },
  ];

  // تابع برای گرفتن داده‌ها از API
  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getParticipatingChallengesService();
      console.log("Participating Challenges Response:", response);
      const challengesData = response.data || response;
      setChallenges(challengesData);
      setAllChallenges(challengesData);
    } catch (err) {
      setError("خطا در دریافت چالش‌ها");
      console.error("Error fetching challenges:", err);
    } finally {
      setLoading(false);
    }
  };

  // تابع برای گرفتن چالش‌های ساخته شده توسط کاربر
  const fetchMyChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUserId = 2; // این را از context یا localStorage بگیرید
      const response = await getCreatedChallengesService(currentUserId);
      const myChallengesData = response.data || response;
      setChallenges(myChallengesData);
      setAllChallenges(myChallengesData);
    } catch (err) {
      setError("خطا در دریافت چالش‌های شما");
      console.error("Error fetching my challenges:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  // تابع برای استخراج نام دسته‌بندی از داده‌های API
  const getCategoryId = (categoryName: string): number => {
    const categoryMap: { [key: string]: number } = {
      Fitness: 1,
      Art: 2,
      Science: 3,
      Entertainment: 4,
      ورزشی: 1,
      هنری: 2,
      علمی: 3,
      تفریحی: 4,
    };
    return categoryMap[categoryName] || 1;
  };

  const getRandomAvatars = (challengeId: number) => {
    const seed = challengeId;
    const count = (seed % 3) + 1;
    return sampleAvatars.slice(0, count).map((user, idx) => ({
      id: idx,
      name: user.name,
      avatar: user.avatar,
      image: "",
    }));
  };

  const selectedCategoryIds = Object.keys(checkedCategories)
    .filter((key) => checkedCategories[Number(key)])
    .map(Number);

  // بررسی آیا گزینه "چالش‌های من" انتخاب شده است
  const isMyChallengesSelected = checkedCategories[0];

  // وقتی گزینه "چالش‌های من" تغییر می‌کند
  useEffect(() => {
    if (isMyChallengesSelected) {
      fetchMyChallenges();
    } else {
      // اگر گزینه "چالش‌های من" انتخاب نشده، تمام چالش‌ها را نشان بده
      fetchChallenges();
    }
  }, [isMyChallengesSelected]);

  const handleCategoryChange = (newCheckedCategories: { [key: number]: boolean }) => {
    // اگر گزینه "چالش‌های من" انتخاب شده، سایر گزینه‌ها را غیرفعال کن
    if (newCheckedCategories[0] && !checkedCategories[0]) {
      const onlyMyChallenges = { 0: true };
      setCheckedCategories(onlyMyChallenges);
    } 
    // اگر یکی از دسته‌بندی‌های دیگر انتخاب شده، گزینه "چالش‌های من" را غیرفعال کن
    else if (!newCheckedCategories[0] && Object.keys(newCheckedCategories).some(key => Number(key) !== 0 && newCheckedCategories[Number(key)])) {
      const withoutMyChallenges = { ...newCheckedCategories };
      delete withoutMyChallenges[0];
      setCheckedCategories(withoutMyChallenges);
    } 
    // در غیر این صورت حالت عادی
    else {
      setCheckedCategories(newCheckedCategories);
    }
  };

  // فیلتر کردن چالش‌ها بر اساس جستجو
  const searchedChallenges = search
    ? allChallenges
        .filter((challenge) =>
          challenge.title.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          const s = search.toLowerCase();
          const score = (title: string) => {
            if (title === s) return 3;
            if (title.startsWith(s)) return 2;
            return 1;
          };
          return score(bTitle) - score(aTitle);
        })
    : allChallenges;

  // فیلتر کردن بر اساس دسته‌بندی (به جز گزینه "چالش‌های من")
  const categoryFilteredChallenges =
    selectedCategoryIds.length === 0 || isMyChallengesSelected
      ? searchedChallenges
      : searchedChallenges.filter((challenge) =>
          selectedCategoryIds.includes(getCategoryId(challenge.category_name))
        );

  // نهایی‌ترین فیلتر
  const filteredChallenges = categoryFilteredChallenges;

  if (error) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button
            onClick={isMyChallengesSelected ? fetchMyChallenges : fetchChallenges}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* جستجو و فیلتر دسته‌بندی */}
      <div className="flex justify-start items-center w-full sm:w-126 md:w-139 m-2.5 gap-1">
        <div className="w-2/3">
          <Formik
            initialValues={{ challengeSearch: "" }}
            onSubmit={(values) => setSearch(values.challengeSearch)}
          >
            {({ handleSubmit }) => (
              <Form
                onSubmit={handleSubmit}
                className="relative flex items-center"
              >
                <CustomInput
                  width="w-full"
                  icon={
                    <button
                      type="submit"
                      className="flex items-center cursor-pointer"
                    >
                      <Search className="text-[var(--color-blue-main)]" />
                    </button>
                  }
                  name="challengeSearch"
                  label="جستجو"
                />
              </Form>
            )}
          </Formik>
        </div>
        <div className="w-1/3">
          <CustomDropdown
            items={categories}
            checkedCategories={checkedCategories}
            setCheckedCategories={handleCategoryChange}
          />
        </div>
      </div>

      {/* نمایش چالش‌ها */}
      {!loading && filteredChallenges.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 m-2.5">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              title={challenge.title}
              description={challenge.description}
              startDate={convertToJalali(challenge.start_time)}
              endDate={convertToJalali(challenge.end_time)}
              profiles={getRandomAvatars(challenge.id)}
              initialLikes={challenge.like_count}
              initialComments={challenge.comment_count}
              coverImage={
                challenge.image_url ||
                "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80"
              }
              isPrivate={challenge.visibility === "private"}
              isJoined={challenge.is_user_participating}
              creator={{
                name: challenge.creator_username,
                avatar:
                  "https://images.unsplash.com/photo-1502764613149-7f1d229e230f?auto=format&fit=crop&w=50&q=80",
              }}
            />
          ))}
        </div>
      )}

      {!loading && filteredChallenges.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">
            {search || selectedCategoryIds.length > 0
              ? "چالشی با این فیلترها یافت نشد"
              : isMyChallengesSelected 
                ? "شما هیچ چالشی نساخته‌اید"
                : "شما در هیچ چالشی شرکت نکرده‌اید"}
          </p>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 m-2.5">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse bg-gray-200 rounded-lg h-80"
            >
              <div className="h-40 bg-gray-300 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProfileChallenges;