import { Formik } from "formik";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChallengeCard from "@/components/Custom/ChallangeCard";
import CustomInput from "@/components/Custom/CustomInput";
import {
  getPublicChallengesService,
  searchChallengesService,
} from "@/services/userService";
import { convertToJalali } from "@/components/Custom/ConvertToJalali";
import type {
  ActiveFilters,
  SearchChallenge,
  SearchModalProps,
} from "@/types/searchTypes";
import { applyChallengeFilters } from "@/utils/searchFilters";
import {
  EmptyState,
  FilterChip,
  LoadingSpinner,
  SearchTopBar,
} from "./SearchParts";

const SEARCH_PAGE_SIZE = 5;
const DEFAULT_PAGE_SIZE = 5;

const getChallengeDates = (challenge: SearchChallenge) => ({
  start:
    challenge.start_time ??
    challenge.start_date ??
    challenge.startDate ??
    "",
  end:
    challenge.end_time ??
    challenge.end_date ??
    challenge.endDate ??
    "",
});

const getLabelBySortKey = (sortBy?: ActiveFilters["sortBy"]) => {
  switch (sortBy) {
    case "popular":
      return "مرتب‌سازی: محبوب‌ترین";
    case "trending":
      return "مرتب‌سازی: پرطرفدار";
    case "oldest":
      return "مرتب‌سازی: قدیمی‌ترین";
    default:
      return "مرتب‌سازی: جدیدترین";
  }
};

export function SearchModal({
  isOpen,
  onClose,
  challenges,
  onFilterClick,
  activeFilters,
  onClearFilter,
  categoryTitleById,
  onChallengeSelect,
}: SearchModalProps) {
  const [searchResults, setSearchResults] = useState<SearchChallenge[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [defaultResults, setDefaultResults] = useState<SearchChallenge[]>([]);
  const [isDefaultLoading, setIsDefaultLoading] = useState(false);
  const [isDefaultLoadingMore, setIsDefaultLoadingMore] = useState(false);
  const [defaultPage, setDefaultPage] = useState(1);
  const [hasMoreDefault, setHasMoreDefault] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const lastFetchedPageRef = useRef<number | null>(null);
  const lastDefaultPageRef = useRef<number | null>(null);
  const activeQueryRef = useRef("");
  const navigate = useNavigate();

  const fetchSearchPage = useCallback(
    async (query: string, pageNum: number, isLoadMore: boolean = false) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setSearchResults([]);
        setHasMore(false);
        return;
      }

      if (isLoadMore && lastFetchedPageRef.current === pageNum) return;
      lastFetchedPageRef.current = pageNum;
      activeQueryRef.current = trimmedQuery;

      if (!isLoadMore) setIsSearching(true);
      else setIsLoadingMore(true);

      try {
        const response = await searchChallengesService(
          trimmedQuery,
          pageNum,
          SEARCH_PAGE_SIZE
        );
        if (activeQueryRef.current !== trimmedQuery) return;

        const nextResults = response.data || [];
        setSearchResults((prev) =>
          isLoadMore ? [...prev, ...nextResults] : nextResults
        );

        if (nextResults.length < SEARCH_PAGE_SIZE) {
          setHasMore(false);
        } else {
          setHasMore(true);
          setSearchPage(pageNum + 1);
        }
      } catch (error) {
        console.error("Error searching challenges:", error);
        if (!isLoadMore) {
          setSearchResults([]);
        }
        setHasMore(false);
      } finally {
        setIsSearching(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  const fetchDefaultPage = useCallback(
    async (pageNum: number, isLoadMore: boolean = false) => {
      if (isLoadMore && lastDefaultPageRef.current === pageNum) return;
      lastDefaultPageRef.current = pageNum;

      if (!isLoadMore) setIsDefaultLoading(true);
      else setIsDefaultLoadingMore(true);

      try {
        const response = await getPublicChallengesService(
          pageNum,
          DEFAULT_PAGE_SIZE
        );
        const nextItems = response || [];

        setDefaultResults((prev) =>
          isLoadMore ? [...prev, ...nextItems] : nextItems
        );

        if (nextItems.length < DEFAULT_PAGE_SIZE) {
          setHasMoreDefault(false);
        } else {
          setHasMoreDefault(true);
          setDefaultPage(pageNum + 1);
        }
      } catch (error) {
        console.error("Error fetching public challenges:", error);
        if (!isLoadMore) {
          setDefaultResults([]);
        }
        setHasMoreDefault(false);
      } finally {
        setIsDefaultLoading(false);
        setIsDefaultLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setSearchPage(1);
      setHasMore(false);
      setDefaultResults([]);
      setDefaultPage(1);
      setHasMoreDefault(false);
      lastFetchedPageRef.current = null;
      lastDefaultPageRef.current = null;
      activeQueryRef.current = "";
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchQuery.trim()) {
        lastFetchedPageRef.current = null;
        setSearchPage(1);
        fetchSearchPage(searchQuery, 1, false);
      } else {
        setSearchResults([]);
        setHasMore(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, isOpen, fetchSearchPage]);

  useEffect(() => {
    const hasSearchQuery = !!searchQuery.trim();
    const hasCategoryFilter = !!activeFilters?.selectedCategory;
    const hasSortFilter =
      !!activeFilters?.sortBy && activeFilters.sortBy !== "newest";
    const shouldUseDefaultList =
      !hasSearchQuery && !hasCategoryFilter && !hasSortFilter;

    if (!isOpen || !shouldUseDefaultList) return;

    setDefaultResults([]);
    setDefaultPage(1);
    setHasMoreDefault(false);
    lastDefaultPageRef.current = null;
    fetchDefaultPage(1, false);
  }, [isOpen, searchQuery, activeFilters, fetchDefaultPage]);

  const hasCategory = !!activeFilters?.selectedCategory;
  const hasSort = activeFilters?.sortBy && activeFilters.sortBy !== "newest";
  const hasAnyVisibleFilter = hasCategory || !!hasSort;
  const hasSearchQuery = !!searchQuery.trim();
  const useDefaultList = !hasSearchQuery && !hasAnyVisibleFilter;
  const isLoadingResults =
    isSearching || (useDefaultList && isDefaultLoading);

  const categoryLabel = hasCategory
    ? (categoryTitleById?.[String(activeFilters?.selectedCategory)] ??
      `دسته‌بندی: ${activeFilters?.selectedCategory}`)
    : null;

  const sortLabel = hasSort ? getLabelBySortKey(activeFilters?.sortBy) : null;

  const filteredSearchResults = useMemo(
    () =>
      hasAnyVisibleFilter
        ? applyChallengeFilters(searchResults, activeFilters)
        : searchResults,
    [searchResults, activeFilters, hasAnyVisibleFilter]
  );

  const filteredChallenges = useMemo(
    () =>
      hasAnyVisibleFilter
        ? applyChallengeFilters(challenges, activeFilters)
        : challenges,
    [challenges, activeFilters, hasAnyVisibleFilter]
  );

  const displayResults = hasSearchQuery
    ? filteredSearchResults
    : useDefaultList
      ? defaultResults
      : filteredChallenges;

  const handleOpenChallenge = (item: SearchChallenge) => {
    onChallengeSelect?.(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div dir="rtl" className="min-h-screen pb-32">
        <SearchTopBar onBack={onClose} onFilter={onFilterClick} />

        <div className="px-4 pt-4">
          <Formik initialValues={{ q: "" }} onSubmit={() => {}}>
            {({ values, setFieldValue }) => {
              if (values.q !== searchQuery) {
                setSearchQuery(values.q);
              }

              return (
                <>
                  <div className="mb-3">
                    <CustomInput
                      name="q"
                      label="جست و جو"
                      icon={<Search className="h-5 w-5" />}
                      value={values.q}
                      onChange={(e) => setFieldValue("q", e.target.value)}
                      autoFocus
                    />
                  </div>

                  {hasAnyVisibleFilter && (
                    <div className="mt-4 flex flex-wrap gap-2 mb-3">
                      {categoryLabel && (
                        <FilterChip
                          label={categoryLabel}
                          onRemove={() => onClearFilter?.("selectedCategory")}
                        />
                      )}
                      {sortLabel && (
                        <FilterChip
                          label={sortLabel}
                          onRemove={() => onClearFilter?.("sortBy")}
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          onClearFilter?.("selectedCategory");
                          onClearFilter?.("sortBy");
                        }}
                        className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                      >
                        پاک کردن همه
                      </button>
                    </div>
                  )}

                  {isLoadingResults && <LoadingSpinner />}

                  {!isLoadingResults &&
                    hasSearchQuery &&
                    displayResults.length > 0 && (
                      <div className="mb-4 mt-6 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-black">
                          نتایج جستجو
                        </h2>
                        <span className="text-sm text-black/60">
                          {displayResults.length} چالش یافت شد
                        </span>
                      </div>
                    )}

                  {!isLoadingResults && displayResults.length > 0 ? (
                    <div className="space-y-4 pb-8">
                      {displayResults.map((item) => {
                        const { start, end } = getChallengeDates(item);

                        return (
                          <div
                            key={item.id}
                            onClick={() => handleOpenChallenge(item)}
                            className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleOpenChallenge(item);
                              }
                            }}
                          >
                            <ChallengeCard
                              {...item}
                              startDate={convertToJalali(start)}
                              endDate={convertToJalali(end)}
                              onClick={() =>
                                navigate(`/challenge/${item.id}`)
                              }
                            />
                          </div>
                        );
                      })}
                      {hasSearchQuery && hasMore && (
                        <div className="flex justify-center pt-2">
                          <button
                            type="button"
                            onClick={() =>
                              fetchSearchPage(searchQuery, searchPage, true)
                            }
                            className="rounded-xl border border-white px-5 py-2.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                            disabled={isLoadingMore}
                          >
                            {isLoadingMore
                              ? "در حال بارگذاری..."
                              : "نمایش بیشتر"}
                          </button>
                        </div>
                      )}
                      {useDefaultList && hasMoreDefault && (
                        <div className="flex justify-center pt-2">
                          <button
                            type="button"
                            onClick={() =>
                              fetchDefaultPage(defaultPage, true)
                            }
                            className="rounded-xl border border-white px-5 py-2.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                            disabled={isDefaultLoadingMore}
                          >
                            {isDefaultLoadingMore
                              ? "در حال بارگذاری..."
                              : "نمایش بیشتر"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : !isLoadingResults ? (
                    <EmptyState
                      hasFilters={hasAnyVisibleFilter}
                      searchQuery={values.q}
                      onClearSearch={() => setFieldValue("q", "")}
                    />
                  ) : null}
                </>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
