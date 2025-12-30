// src/components/ProfileChallenges.tsx یا هر جایی که داشتی
import { useState, useEffect, useCallback, useRef } from "react";
import { Form, Formik } from "formik";
import { Search } from "lucide-react";
import CustomInput from "../Custom/CustomInput";
import CustomDropdown from "../Custom/CustomDropdown";
import { useNavigate } from "react-router-dom";
import { baseURL } from "@/services/services";
import useUserStore from "@/store/userStore/userStore";

import {
  getParticipatingChallengesService,
  getMutualFollowersService,
  getUserProfileService,
  searchChallengesService,
} from "@/services/userService";
import type { Challenge } from "@/types/challengeTypes";
import { convertToJalali } from "../Custom/ConvertToJalali";
import { getBackendErrorMessage } from "@/services/errorService";
import CustomToast from "../Custom/CustomToast";
import { VirtualChallengeList } from "./VirtualChallengeList";
import SkeletonChallengeCard from "./SkeletonChallengeCard";
import ChallengeCard from "../Custom/ChallangeCard";

const PAGE_SIZE = 5;

const normalizeUrl = (value?: string) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${baseURL}${value}`;
  return `${baseURL}/${value}`;
};

const ProfileChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState("");
  const [checkedCategories, setCheckedCategories] = useState<{
    [key: number]: boolean;
  }>({});
  const [searchQuery, setSearchQuery] = useState("");

  const { userId } = useUserStore();
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: "ورزشی" },
    { id: 2, name: "هنری" },
    { id: 3, name: "علمی" },
    { id: 4, name: "تفریحی" },
    { id: 0, name: "چالش‌های من" },
  ];

  // const [checkedCategories, setCheckedCategories] = useState<{
  //   [key: number]: boolean;
  // }>({});

  const handleCategoryChange = (newChecked: { [key: number]: boolean }) => {
    if (newChecked[0] && !checkedCategories[0]) {
      setCheckedCategories({ 0: true });
    } else if (
      !newChecked[0] &&
      Object.keys(newChecked).some(
        (k) => Number(k) !== 0 && newChecked[Number(k)]
      )
    ) {
      const updated = { ...newChecked };
      delete updated[0];
      setCheckedCategories(updated);
    } else {
      setCheckedCategories(newChecked);
    }
  };

  const fetchMutualFollowers = async (challengeId: number) => {
    try {
      const response = await getMutualFollowersService(challengeId);
      return response.data || response || [];
    } catch (error) {
      CustomToast(getBackendErrorMessage(error), "error");
      return [];
    }
  };

  const hydrateChallenges = async (list: Challenge[]) => {
    return Promise.all(
      list.map(async (ch) => {
        const mutualFollowers = await fetchMutualFollowers(ch.id);
        return { ...ch, mutualFollowers };
      })
    );
  };

  const lastFetchedPage = useRef<number | null>(null);

  const fetchChallenges = useCallback(
    async (pageNum: number, isLoadMore: boolean = false) => {
      try {
        if (!isLoadMore) setLoading(true);
        else setLoadingMore(true);

        setError(null);

        if (isLoadMore && lastFetchedPage.current === pageNum) return;
        lastFetchedPage.current = pageNum;

        let rawList: Challenge[] = [];

        if (searchQuery.trim()) {
          const response = await searchChallengesService(searchQuery);
          rawList = response?.data ?? response ?? [];
          setHasMore(false);
        } else {
          rawList = await getParticipatingChallengesService(pageNum, PAGE_SIZE);
        }

        const hydrated = await hydrateChallenges(rawList);

        setChallenges((prev) =>
          isLoadMore ? [...prev, ...hydrated] : hydrated
        );

        if (!searchQuery.trim()) {
          if (rawList.length < PAGE_SIZE) {
            setHasMore(false); // ✅ این آخرشه
          } else {
            setHasMore(true);
            setPage((prev) => prev + 1);
          }
        }
      } catch (err) {
        setError("خطا در دریافت چالش‌ها");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    const q = searchQuery.trim();
    if (q) fetchSearchedChallenges(q);
    else fetchParticipatingChallenges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const profileRes = await getUserProfileService(userId);
        const profile = profileRes?.data ?? profileRes;
        setCurrentUserAvatar(normalizeUrl(profile?.profile_picture || ""));
      } catch (profileError) {
        console.error("Error fetching profile picture:", profileError);
      }
    };

    fetchProfilePicture();
  }, [userId]);

  // ----- منطق چک‌باکس دسته‌بندی‌ها (مثل کد خودت) -----
  // const handleCategoryChange = (newChecked: { [key: number]: boolean }) => {
  //   if (newChecked[0] && !checkedCategories[0]) {
  //     setCheckedCategories({ 0: true });
  //   } else if (
  //     !newChecked[0] &&
  //     Object.keys(newChecked).some(
  //       (k) => Number(k) !== 0 && newChecked[Number(k)]
  //     )
  //   ) {
  //     const updated = { ...newChecked };
  //     delete updated[0];
  //     setCheckedCategories(updated);
  //   } else setCheckedCategories(newChecked);
  // };

  // ----- فیلتر چالش‌ها بر اساس دسته‌بندی‌های انتخاب شده -----
  const filteredChallenges = challenges;
  const resolveAvatarUrl = (user: any) =>
    normalizeUrl(
      user?.profile_picture ||
        user?.avatar_url ||
        user?.avatar ||
        user?.image ||
        ""
    );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-4">
        <p className="text-error">{error}</p>
        <button
          onClick={() => fetchChallenges(1, false)}
          className="px-4 py-2 bg-secondry text-white rounded"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <>
      {/* جستجو و فیلتر */}
      <div className="flex justify-start items-center w-full sm:w-126 md:w-139 m-2.5 gap-1">
        <div className="w-2/3">
          <Formik
            initialValues={{ challengeSearch: "" }}
            onSubmit={(v) => setSearchQuery(v.challengeSearch?.trim() || "")}
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
              id={challenge.id}
              onClick={() => navigate(`/challenge/${challenge.id}`)}
              title={challenge.title}
              description={challenge.description}
              startDate={convertToJalali(challenge.start_time)}
              endDate={convertToJalali(challenge.end_time)}
              profiles={
                challenge.mutualFollowers?.map((user: any) => ({
                  id: user.id,
                  name: user.username || user.name || "",
                  avatar: resolveAvatarUrl(user),
                  image: resolveAvatarUrl(user),
                })) || []
              }
              initialLikes={challenge.like_count}
              initialComments={challenge.comment_count}
              coverImage={
                normalizeUrl(challenge.cover_image || "") ||
                normalizeUrl(challenge.image_url) ||
                "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80"
              }
              isPrivate={challenge.visibility === "private"}
              isJoined={challenge?.is_user_participating || true}
              creator={{
                name: challenge.creator_username,
                avatar:
                  challenge.creator_id === userId
                    ? currentUserAvatar
                    : normalizeUrl(
                        challenge.creator_profile_picture ||
                          challenge.creator_avatar_url ||
                          ""
                      ),
              }}
            />
))}
        </div>
      )}

      {/* حالت خالی */}
      {!loading && !loadingMore && challenges.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <p className="text-neutral-gray">
            {searchQuery
              ? "چالشی با این عبارت یافت نشد"
              : "شما در هیچ چالشی شرکت نکرده‌اید"}
          </p>
        </div>
      )}
    </>
  );
};

export default ProfileChallenges;
