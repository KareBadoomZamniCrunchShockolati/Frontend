// src/components/ProfileChallenges.tsx یا هر جایی که داشتی
import { useState, useEffect, useCallback, useRef } from "react";
import { Form, Formik } from "formik";
import { Search } from "lucide-react";
import CustomInput from "../Custom/CustomInput";
import CustomDropdown from "../Custom/CustomDropdown";
import { useNavigate } from "react-router-dom";
import {
  getParticipatingChallengesService,
  getMutualFollowersService,
  searchChallengesService,
} from "@/services/userService";
import type { Challenge } from "@/types/challengeTypes";
import { VirtualChallengeList } from "./VirtualChallengeList";
import SkeletonChallengeCard from "./SkeletonChallengeCard";

const PAGE_SIZE = 5;

const ProfileChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const categories = [
    { id: 1, name: "ورزشی" },
    { id: 2, name: "هنری" },
    { id: 3, name: "علمی" },
    { id: 4, name: "تفریحی" },
    { id: 0, name: "چالش‌های من" },
  ];

  const [checkedCategories, setCheckedCategories] = useState<{
    [key: number]: boolean;
  }>({});

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
      console.error("Error fetching mutual followers:", error);
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

        // ⛔ جلوگیری از fetch تکراری
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
    setChallenges([]);
    setPage(1);
    setHasMore(true);
    fetchChallenges(1, false);
  }, [searchQuery, fetchChallenges]);

  // تشخیص تعداد ستون بر اساس عرض صفحه
  const getColumnCount = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const [columnCount, setColumnCount] = useState(getColumnCount());

  useEffect(() => {
    const handleResize = () => setColumnCount(getColumnCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

      {/* لیست مجازی */}
      {loading && challenges.length === 0 ? (
        <SkeletonChallengeCard />
      ) : (
        <VirtualChallengeList
          challenges={challenges}
          loadingMore={loadingMore && !searchQuery.trim()}
          columnCount={columnCount}
          hasMore={hasMore}
          onLoadMore={() => fetchChallenges(page, true)}
        />
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
