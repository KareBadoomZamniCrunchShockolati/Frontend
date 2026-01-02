import type {
  ActiveFilters,
  SearchChallenge,
  SortKey,
} from "@/types/searchTypes";

const getDateValue = (challenge: SearchChallenge) =>
  challenge.created_at ??
  challenge.createdAt ??
  challenge.start_time ??
  challenge.start_date ??
  "";

const toTimestamp = (value: string) => {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getLikeCount = (challenge: SearchChallenge) =>
  challenge.like_count ??
  challenge.initialLikes ??
  challenge.likes ??
  0;

const getTrendScore = (challenge: SearchChallenge) =>
  challenge.current_participants ??
  challenge.views ??
  challenge.comment_count ??
  0;

const getCategoryName = (challenge: SearchChallenge) => {
  const category = (challenge as { category?: { name?: string } }).category;
  return challenge.category_name ?? category?.name ?? "";
};

const sortChallenges = (list: SearchChallenge[], sortBy: SortKey) => {
  const sorted = [...list];

  switch (sortBy) {
    case "newest":
      return sorted.sort(
        (a, b) => toTimestamp(getDateValue(b)) - toTimestamp(getDateValue(a))
      );
    case "oldest":
      return sorted.sort(
        (a, b) => toTimestamp(getDateValue(a)) - toTimestamp(getDateValue(b))
      );
    case "popular":
      return sorted.sort((a, b) => getLikeCount(b) - getLikeCount(a));
    case "trending":
      return sorted.sort((a, b) => getTrendScore(b) - getTrendScore(a));
    default:
      return sorted;
  }
};

export const applyChallengeFilters = (
  list: SearchChallenge[],
  filters?: ActiveFilters | null
) => {
  if (!filters) return list;

  const { selectedCategory, sortBy } = filters;
  let filtered = list;

  if (selectedCategory) {
    filtered = filtered.filter(
      (challenge) => getCategoryName(challenge) === selectedCategory
    );
  }

  return sortChallenges(filtered, sortBy);
};
