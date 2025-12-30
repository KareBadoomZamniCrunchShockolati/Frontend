import type { Challenge } from "@/types/challengeTypes";

export type SortKey = "newest" | "popular" | "trending" | "oldest";

export type ActiveFilters = {
  selectedCategory: string | null;
  sortBy: SortKey;
};

export type SearchChallenge = Challenge & {
  startDate?: string;
  endDate?: string;
  start_date?: string;
  end_date?: string;
  createdAt?: string;
  likes?: number;
  views?: number;
};

export type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  challenges: SearchChallenge[];
  onFilterClick: () => void;
  activeFilters?: ActiveFilters | null;
  onClearFilter?: (key: keyof ActiveFilters) => void;
  categoryTitleById?: Record<string, string>;
  onChallengeSelect?: (challenge: SearchChallenge) => void;
};
