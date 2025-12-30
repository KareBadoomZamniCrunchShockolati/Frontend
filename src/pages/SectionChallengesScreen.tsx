import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { VirtualChallengeList } from "@/components/Profile/VirtualChallengeList";
import {
  getChallengesByCategoryService,
  getPopularChallengesService,
  getPublicChallengesService,
} from "@/services/userService";
import { getBackendErrorMessage } from "@/services/errorService";
import CustomToast from "@/components/Custom/CustomToast";
import type { Challenge } from "@/types/challengeTypes";
import type {
  CategoryMetaMap,
  SectionMetaMap,
  SectionRouteParams,
  SectionType,
} from "@/types/sectionChallengesTypes";

const PAGE_SIZE = 5;
const DEFAULT_SECTION: SectionType = "popular";

// نگاشت دسته‌بندی‌ها
const CATEGORY_META: CategoryMetaMap = {
  health: { title: "سلامت" },
  fitness: { title: "تناسب اندام" },
  study: { title: "مطالعه" },
  finance: { title: "مالی" },
  mindfulness: { title: "آگاهی ذهنی" },
  lifestyle: { title: "سبک زندگی" },
  hobby: { title: "سرگرمی" },
  social: { title: "اجتماعی" },
};

const SECTION_META: SectionMetaMap = {
  popular: { title: "محبوب‌ترین چالش‌ها" },
  near: { title: "چالش‌های نزدیک" },
  followers: { title: "چالش‌های دنبال‌شوندگان" },
  category: { title: "چالش‌های دسته‌بندی" },
  moreCreators: { title: "برترین سازندگان" },
};

const SAMPLE_TITLES: Record<string, string> = {
  popular: "محبوب",
  near: "نزدیک",
  followers: "دنبال‌شونده",
  health: "سلامت",
  fitness: "تناسب اندام",
  study: "مطالعه",
  finance: "مالی",
  mindfulness: "ذهن آگاهی",
  lifestyle: "سبک زندگی",
  hobby: "سرگرمی",
  social: "اجتماعی",
  default: "چالش",
};

const getColumnCount = () => {
  if (typeof window === "undefined") return 1;
  if (window.innerWidth >= 1280) return 4;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
};

const resolveSectionType = (
  rawType: string | undefined,
  isCategory: boolean
): SectionType => {
  if (isCategory) return "category";
  if (rawType && rawType in SECTION_META) return rawType as SectionType;
  return DEFAULT_SECTION;
};

const getFetchType = (
  isCategory: boolean,
  categoryId: string | undefined,
  rawType: string | undefined
) =>
  isCategory ? (categoryId ?? DEFAULT_SECTION) : (rawType ?? DEFAULT_SECTION);

// تابع برای دریافت چالش‌ها بر اساس نوع
async function fetchChallenges(
  type: string,
  page: number,
  pageSize: number
): Promise<Challenge[]> {
  try {
    switch (type) {
      case "popular":
        return await getPopularChallengesService(page, pageSize);

      case "near":
        // از نظر زمانی نزدیک
        return await getPublicChallengesService(page, pageSize);

      case "followers":
        // اگر سرویس مخصوص دنبال‌شوندگان دارید
        return await getPublicChallengesService(page, pageSize); // جایگزین با سرویس واقعی

      case "moreCreators":
        // برای سازندگان - فعلاً چالش‌های عمومی نمایش داده می‌شود
        return await getPublicChallengesService(page, pageSize);

      default:
        // اگر type نام دسته‌بندی باشد (مثل health, fitness)
        if (CATEGORY_META[type]) {
          return await getChallengesByCategoryService(type, page, pageSize);
        }

        // به صورت پیش‌فرض چالش‌های عمومی
        return await getPublicChallengesService(page, pageSize);
    }
  } catch (error) {
    CustomToast(getBackendErrorMessage(error), "error");

    // در صورت خطا، داده‌های نمونه برگردانید
    return getSampleData(type, page, pageSize);
  }
}

// تابع برای ایجاد داده‌های نمونه (در صورت خطا)
function getSampleData(
  type: string,
  page: number,
  pageSize: number
): Challenge[] {
  const titlePrefix = SAMPLE_TITLES[type] || SAMPLE_TITLES.default;
  const offset = (page - 1) * pageSize;

  return Array.from({ length: pageSize }).map((_, i) => ({
    id: offset + i + 1,
    title: `${titlePrefix} چالش ${offset + i + 1}`,
    description: `این یک چالش ${titlePrefix} نمونه است.`,
    recurrence_rule: "daily",
    category_name: type,
    creator_username: "کاربر نمونه",
    creator_id: 0,
    visibility: i % 4 === 0 ? "private" : "public",
    image_url: "/images/sample-cover.jpg",
    max_participants: 100,
    current_participants: Math.floor(Math.random() * 80) + 1,
    like_count: Math.floor(Math.random() * 100) + 10,
    comment_count: Math.floor(Math.random() * 20) + 1,
    start_time: "2024-01-15T08:00:00Z",
    end_time: "2024-02-15T23:59:59Z",
    timezone: "Asia/Tehran",
    created_at: "2024-01-01T00:00:00Z",
    is_user_participating: i % 3 === 0,
    is_user_liked: false,
    mutualFollowers: [],
    mutual_participants: [],
  }));
}

export default function SectionChallengesScreen() {
  const navigate = useNavigate();
  const { type, categoryId } = useParams<SectionRouteParams>();

  const isCategory = !!categoryId;
  const sectionType = useMemo(
    () => resolveSectionType(type, isCategory),
    [type, isCategory]
  );
  const fetchType = useMemo(
    () => getFetchType(isCategory, categoryId, type),
    [isCategory, categoryId, type]
  );
  const title = useMemo(() => {
    if (isCategory && categoryId) {
      return CATEGORY_META[categoryId]?.title || "دسته‌بندی";
    }
    return SECTION_META[sectionType]?.title || "چالش‌ها";
  }, [sectionType, categoryId, isCategory]);

  const [items, setItems] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [columnCount, setColumnCount] = useState(1);
  const lastFetchedPage = useRef<number | null>(null);

  const fetchPage = useCallback(
    async (pageNum: number, isLoadMore: boolean = false) => {
      try {
        if (!isLoadMore) setLoading(true);
        else setLoadingMore(true);

        setError(null);

        if (isLoadMore && lastFetchedPage.current === pageNum) return;
        lastFetchedPage.current = pageNum;

        const data = await fetchChallenges(fetchType, pageNum, PAGE_SIZE);
        const nextItems = data || [];

        setItems((prev) => (isLoadMore ? [...prev, ...nextItems] : nextItems));

        if (nextItems.length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          setHasMore(true);
          setPage(pageNum + 1);
        }
      } catch (e) {
        console.error("Error fetching challenges:", e);
        setError("خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.");
        CustomToast(getBackendErrorMessage(e), "error");
        // نمایش داده‌های نمونه در صورت خطا
        const fetchType = isCategory ? categoryId! : type || "popular";
        setItems(getSampleData(fetchType));

        if (!isLoadMore) {
          setError("خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.");
          setItems(getSampleData(fetchType, 1, PAGE_SIZE));
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [fetchType]
  );

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    lastFetchedPage.current = null;
    fetchPage(1, false);
  }, [fetchType, fetchPage]);

  useEffect(() => {
    setColumnCount(getColumnCount());
    const handleResize = () => setColumnCount(getColumnCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-white">
      {/* Header (Back button + Title) */}
      <div className="sticky top-0 z-10 bg-white px-4 pt-4 pb-3 shadow-sm">
        <div className="flex items-center justify-between" dir="ltr">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-12 w-12 place-items-center rounded-xl border-2 border-primary bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            aria-label="بازگشت"
          >
            <ArrowLeft className="h-8 w-8" strokeWidth={2.5} />
          </button>

          {/* Title aligned to the right */}
          <div className="font-bold text-xl text-primary ml-auto text-right pr-2">
            {title}
          </div>
        </div>
      </div>

      {/* Content (Grid of Challenges) */}
      <div className="px-4 pb-8">
        {loading ? (
          <div className="py-10 text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
            <p className="text-slate-600">در حال بارگذاری چالش‌ها...</p>
          </div>
        ) : error ? (
          <div className="py-10 text-center">
            <p className="text-error mb-4">{error}</p>
            <p className="text-slate-500 text-sm">
              چالش‌های نمونه نمایش داده می‌شوند
            </p>
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="mb-4 mt-2">
              <p className="text-slate-500 text-sm">
                {items.length} چالش یافت شد
              </p>
            </div>
            <VirtualChallengeList
              challenges={items}
              loadingMore={loadingMore}
              columnCount={columnCount}
              onLoadMore={() => fetchPage(page, true)}
              hasMore={hasMore}
            />
          </>
        ) : (
          <div className="py-10 text-center">
            <div className="text-slate-400 mb-3">
              <svg
                className="h-16 w-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              چالشی یافت نشد
            </h3>
            <p className="text-slate-500">هیچ چالشی در این بخش وجود ندارد.</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              بازگشت
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
