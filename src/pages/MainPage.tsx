import { useMemo, useState, useEffect } from "react";
import { Formik } from "formik";
import { Search } from "lucide-react";

import ChallengeCard from "@/components/Custom/ChallangeCard";
import CustomInput from "@/components/Custom/CustomInput";
import { Banner } from "@/components/Custom/Banner";
import { SectionHeader } from "@/components/Custom/SectionHeader";
import { SearchModal } from "@/components/Custom/SearchScreen";
import { FilterModal } from "@/components/Custom/FilterModal";
import {
  getPublicChallengesService,
  getParticipatingChallengesService,
  getPopularChallengesService,
  getTopCreatorsListService,
} from "@/services/userService";
import type { ActiveFilters } from "@/types/searchTypes";
import { useNavigate } from "react-router-dom";
import { convertToJalali } from "@/components/Custom/ConvertToJalali";
import { HorizontalScroller } from "@/components/Custom/HorizontalScroller";

import HealthIcon from "@/assets/Icon/Health.svg";
import StudyIcon from "@/assets/Icon/Study.svg";
import FinanceIcon from "@/assets/Icon/Finance.svg";
import MindfulnessIcon from "@/assets/Icon/Mindfulness.svg";
import LifestyleIcon from "@/assets/Icon/Lifestyle.svg";
import HobbyIcon from "@/assets/Icon/Hobby.svg";
import FitnessIcon from "@/assets/Icon/Fitness.svg";
import SocialIcon from "@/assets/Icon/Social.svg";

import { CreatorCard } from "@/components/Custom/CreatorCard";
import BottomNav from "@/components/Custom/BottomNav";
import { OverlappingCards } from "@/components/Custom/OverlappingCards";
import { getBackendErrorMessage } from "@/services/errorService";
import CustomToast from "@/components/Custom/CustomToast";

function CategoryGrid({
  categories,
}: {
  categories: Array<{ id: string; title: string; icon: string }>;
}) {
  const navigate = useNavigate();

  const isDark = document.documentElement.classList.contains("dark");

  return (
    <div className="px-4 pt-4">
      <div className="mb-3 mt-5 text-base font-bold text-foreground">
        دسته‌بندی‌ها
      </div>

      <div className="grid grid-cols-4 gap-3">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => navigate(`/category/${c.id}`)}
            className="flex flex-col cursor-pointer items-center gap-2 rounded-2xl border-2 border-foreground bg-card py-3 shadow-shadow-light active:scale-[0.98]"
          >
            {isDark && (
              <div>
                <img
                  src={c.icon}
                  alt={c.title}
                  className="h-6 w-6 dark:invert"
                  loading="lazy"
                />
              </div>
            )}

            {!isDark && (
              <div>
                <img
                  src={c.icon}
                  alt={c.title}
                  className="h-6 w-6"
                  loading="lazy"
                />
              </div>
            )}

            <span className="text-xs font-medium text-foreground">
              {c.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HomeScreen() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [popularChallenges, setPopularChallenges] = useState<any[]>([]);
  const [nearbyChallenges, setNearbyChallenges] = useState<any[]>([]);
  const [followingChallenges, setFollowingChallenges] = useState<any[]>([]);
  const [topCreators, setTopCreators] = useState<any[]>([]);

  const [allChallenges, setAllChallenges] = useState<any[]>([]);
  const [visibleChallenges, setVisibleChallenges] = useState<any[]>([]);

  const [loadingStates, setLoadingStates] = useState({
    popular: true,
    nearby: true,
    following: true,
    all: true,
    topCreators: true,
  });

  const [activeFilters, setActiveFilters] = useState<ActiveFilters | null>(
    null
  );

  const navigate = useNavigate();

  const categories = useMemo(
    () => [
      { id: "health", title: "سلامت", icon: HealthIcon },
      { id: "fitness", title: "تناسب اندام", icon: FitnessIcon },
      { id: "study", title: "مطالعه", icon: StudyIcon },
      { id: "finance", title: "مالی", icon: FinanceIcon },
      { id: "mindfulness", title: "آگاهی ذهنی", icon: MindfulnessIcon },
      { id: "lifestyle", title: "سبک زندگی", icon: LifestyleIcon },
      { id: "hobby", title: "سرگرمی", icon: HobbyIcon },
      { id: "social", title: "اجتماعی", icon: SocialIcon },
    ],
    []
  );

  const fetchTopCreators = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, topCreators: true }));
      const response = await getTopCreatorsListService();
      const formattedCreators =
        response.map((creator: any, index: number) => ({
          id: creator.id,
          username: creator.username,
          avatar: "",
          rank: index + 1,
          stats: {
            challengeCount: creator.challenge_count,
            totalLikes: creator.total_likes,
            totalParticipants: creator.total_participants,
          },
        })) || [];

      setTopCreators(formattedCreators);
    } catch (error) {
      console.error("Error fetching top creators:", error);
      // داده‌های نمونه در صورت خطا
      setTopCreators([
        { id: 1, username: "mahditd", avatar: "/images/mahditd.jpg", rank: 1 },
        { id: 2, username: "emadme", avatar: "/images/emadme.jpg", rank: 2 },
        { id: 3, username: "samankh", avatar: "/images/samankh.jpg", rank: 3 },
      ]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, topCreators: false }));
    }
  };

  const fetchPopularChallenges = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, popular: true }));
      const response = await getPopularChallengesService();
      setPopularChallenges(response || []);
    } catch (error) {
      console.error("Error fetching popular challenges:", error);
      setPopularChallenges(getSampleData("popular"));
      CustomToast(getBackendErrorMessage(error), "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, popular: false }));
    }
  };

  const fetchNearbyChallenges = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, nearby: true }));
      const response = await getPublicChallengesService();
      setNearbyChallenges(response || []);
    } catch (error) {
      console.error("Error fetching nearby challenges:", error);
      setNearbyChallenges(getSampleData("near"));
      CustomToast(getBackendErrorMessage(error), "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, nearby: false }));
    }
  };

  const fetchFollowingChallenges = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, following: true }));
      const response = await getParticipatingChallengesService();
      setFollowingChallenges(response || []);
    } catch (error) {
      console.error("Error fetching following challenges:", error);
      setFollowingChallenges(getSampleData("following"));
      CustomToast(getBackendErrorMessage(error), "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, following: false }));
    }
  };

  const fetchAllChallenges = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, all: true }));
      const response = await getPublicChallengesService();
      const normalized = response || [];
      setAllChallenges(normalized);
      setVisibleChallenges(normalized);
    } catch (error) {
      console.error("Error fetching all challenges:", error);
      const sampleData = getSampleData("all");
      setAllChallenges(sampleData);
      setVisibleChallenges(sampleData);
      CustomToast(getBackendErrorMessage(error), "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, all: false }));
    }
  };

  const getSampleData = (type: string) => {
    const typeTitles = {
      popular: "محبوب",
      near: "نزدیک",
      following: "دنبال‌شونده",
      all: "همه",
    };

    return Array.from({ length: 10 }).map((_, i) => ({
      id: `${type}_${i + 1}`,
      title: `چالش ${typeTitles[type as keyof typeof typeTitles]} ${i + 1}`,
      description: `این یک چالش ${typeTitles[type as keyof typeof typeTitles]} است.`,
      startDate: "1403/09/01",
      endDate: "1403/09/30",
      profiles: [],
      initialLikes: 10 + i,
      initialComments: 2 + i,
      coverImage: "/images/sample-cover.jpg",
      isJoined: i % 2 === 0,
      isPrivate: i % 3 === 0,
      creator: { name: "کاربر ناشناس" },
      type: type,
    }));
  };

  useEffect(() => {
    fetchPopularChallenges();
    fetchNearbyChallenges();
    fetchFollowingChallenges();
    fetchAllChallenges();
    fetchTopCreators();
  }, []);

  const handleSearchFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterApply = (filters: ActiveFilters) => {
    setActiveFilters(filters);

    if (!filters?.selectedCategory) {
      setVisibleChallenges(allChallenges);
    }
  };

  const handleFilteredChallenges = (filteredList: any[]) => {
    setVisibleChallenges(filteredList || []);
    setIsFilterModalOpen(false);
    setIsSearchModalOpen(true);
  };

  const categoryTitleById = useMemo(
    () =>
      categories.reduce(
        (acc, c) => {
          acc[c.id] = c.title;
          return acc;
        },
        {} as Record<string, string>
      ),
    [categories]
  );

  const handleClearFilter = (key: "selectedCategory" | "sortBy") => {
    if (key === "selectedCategory") {
      setActiveFilters((prev) =>
        prev ? { ...prev, selectedCategory: null } : null
      );
      setVisibleChallenges(allChallenges);
    }

    if (key === "sortBy") {
      setActiveFilters((prev) => (prev ? { ...prev, sortBy: "newest" } : null));
    }
  };

  return (
    <>
      <div
        dir="rtl"
        className="min-h-screen pb-20 bg-background text-foreground transition-colors duration-300"
      >
        <div className="mx-auto pb-6">
          <Formik initialValues={{ q: "" }} onSubmit={() => {}}>
            {({ values, setFieldValue }) => {
              const q = String(values.q ?? "").toLowerCase();

              const baseListForHome = allChallenges;
              const filtered = q
                ? baseListForHome.filter((c) =>
                    String(c.title ?? "")
                      .toLowerCase()
                      .includes(q)
                  )
                : baseListForHome;

              return (
                <>
                  <div className="px-4 pt-4 mb-5">
                    <div onClick={() => setIsSearchModalOpen(true)}>
                      <CustomInput
                        name="q"
                        label="جست و جو"
                        icon={<Search className="h-5 w-5" />}
                        value={values.q}
                        onChange={(e) => setFieldValue("q", e.target.value)}
                        readOnly
                      />
                    </div>
                  </div>

                  <Banner />
                  <CategoryGrid categories={categories} />

                  <SectionHeader
                    title="محبوب‌ترین چالش‌ها"
                    onMore={() => navigate("/section/popular")}
                    className="mb-3 mt-5"
                  />
                  {loadingStates.popular ? (
                    <div className="p-4 text-center">
                      در حال بارگذاری محبوب‌ترین‌ها...
                    </div>
                  ) : (
                    <HorizontalScroller>
                      {popularChallenges.map((item) => (
                        <div key={item.id} className="w-[280px] shrink-0">
                          <ChallengeCard
                            {...item}
                            startDate={convertToJalali(item.start_time)}
                            endDate={convertToJalali(item.end_time)}
                            variant="compact"
                            onClick={() => navigate(`/challenge/${item.id}`)}
                          />
                        </div>
                      ))}
                    </HorizontalScroller>
                  )}

                  <SectionHeader
                    title="چالش های نزدیک"
                    onMore={() => navigate("/section/near")}
                    className="mb-3 mt-5"
                  />
                  {loadingStates.nearby ? (
                    <div className="p-4 text-center">
                      در حال بارگذاری چالش‌های نزدیک...
                    </div>
                  ) : (
                    <HorizontalScroller>
                      {nearbyChallenges.map((item) => (
                        <div key={item.id} className="w-[280px] shrink-0">
                          <ChallengeCard
                            {...item}
                            startDate={convertToJalali(item.start_time)}
                            endDate={convertToJalali(item.end_time)}
                            onClick={() => navigate(`/challenge/${item.id}`)}
                          />
                        </div>
                      ))}
                    </HorizontalScroller>
                  )}

                  <SectionHeader
                    title="برترین سازندگان"
                    onMore={() => navigate("/creators")}
                  />
                  {loadingStates.topCreators ? (
                    <div className="p-4 text-center">
                      در حال بارگذاری سازندگان برتر...
                    </div>
                  ) : (
                    <HorizontalScroller>
                      {topCreators
                        .slice()
                        .sort((a, b) => a.rank - b.rank)
                        .map((c) => (
                          <CreatorCard
                            key={c.id}
                            creator={c}
                            additionalInfo={
                              c.stats
                                ? `چالش‌ها: ${c.stats.challengeCount}`
                                : ""
                            }
                          />
                        ))}
                    </HorizontalScroller>
                  )}

                  <div>
                    <SectionHeader
                      title="چالش های دنبال شوندگان"
                      onMore={() => navigate("/section/followers")}
                      className="mb-3 mt-5"
                    />
                    {loadingStates.following ? (
                      <div className="p-4 text-center">
                        در حال بارگذاری چالش‌های دنبال‌شوندگان...
                      </div>
                    ) : (
                      <HorizontalScroller>
                        {followingChallenges.map((item) => (
                          <div key={item.id} className="w-[280px] shrink-0">
                            <ChallengeCard
                              {...item}
                              startDate={convertToJalali(item.start_time)}
                              endDate={convertToJalali(item.end_time)}
                              onClick={() => navigate(`/challenge/${item.id}`)}
                            />
                          </div>
                        ))}
                      </HorizontalScroller>
                    )}
                  </div>
                </>
              );
            }}
          </Formik>
          <BottomNav />
          <div
            className="w-full mt-[var(--top-page)] p-4"
            onClick={() => {
              setTimeout(() => {
                navigate(`/following/posts`);
              }, 200);
            }}
          >
            <div
              dir="ltr"
              className="
                relative
                flex
                items-center
                justify-between
                rounded-2xl
                border-2
                shadow-shadow-strong
                border-black
                px-10
                py-8
                active:shadow-none
                active:translate-y-[3px]
                active:translate-x-[3px]
                transition-all duration-25
              "
              style={{
                background:
                  "linear-gradient(135deg, var(--secondary), var(--secondary-hover) 80%)",
              }}
            >
              <div className="text-white text-right">
                <h2 className="text-2xl font-bold mb-2">
                  پست‌های افراد دنبال‌شده
                </h2>

                <p className="text-sm opacity-90">
                  دیدن پست‌های افرادی که دنبال می‌کنید
                </p>
              </div>

              <div className="relative">
                <OverlappingCards hasProfiles={true} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        challenges={visibleChallenges}
        onFilterClick={handleSearchFilter}
        activeFilters={activeFilters}
        onClearFilter={handleClearFilter}
        categoryTitleById={categoryTitleById}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleFilterApply}
        onFilteredChallenges={handleFilteredChallenges}
      />
    </>
  );
}
