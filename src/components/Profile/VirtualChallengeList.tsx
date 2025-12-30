// src/components/VirtualChallengeList.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import ChallengeCard from "../Custom/ChallangeCard";
import SkeletonChallengeCard from "./SkeletonChallengeCard";
import type { Challenge } from "@/types/challengeTypes";
import { convertToJalali } from "../Custom/ConvertToJalali";
import { useNavigate } from "react-router-dom";
import { baseURL } from "@/services/services";

type VirtualChallengeListProps = {
  challenges: Challenge[];
  loadingMore: boolean;
  columnCount: number;
  onLoadMore: () => void;
  hasMore?: boolean;
  currentUserId?: number | null;
  currentUserAvatar?: string;
};

const GAP = 12;
const LOAD_MORE_OFFSET = 300; // px مانده به انتهای صفحه

const normalizeUrl = (value?: string) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${baseURL}${value}`;
  return `${baseURL}/${value}`;
};

const resolveAvatarUrl = (user: any) =>
  normalizeUrl(
    user?.profile_picture || user?.avatar_url || user?.avatar || user?.image || ""
  );

export const VirtualChallengeList = ({
  challenges = [],
  loadingMore,
  columnCount,
  onLoadMore,
  hasMore = true,
  currentUserId,
  currentUserAvatar,
}: VirtualChallengeListProps) => {
  const navigate = useNavigate();
  const loadTriggeredRef = useRef(false);
  const [uiLoadingMore, setUiLoadingMore] = useState(true);

  const safeChallenges = Array.isArray(challenges) ? challenges : [];

  useEffect(() => {
    if (!hasMore) return;

    const onScroll = () => {
      if (loadingMore || loadTriggeredRef.current) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (documentHeight - (scrollTop + windowHeight) < LOAD_MORE_OFFSET) {
        loadTriggeredRef.current = true;
        setUiLoadingMore(true);

        setTimeout(() => {
          onLoadMore();
        }, 100);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadingMore, hasMore, onLoadMore]);

  useEffect(() => {
    if (!loadingMore) {
      loadTriggeredRef.current = false;
      setUiLoadingMore(false);
    }
  }, [loadingMore]);

  const gridItems = useMemo(() => {
    const items = [];

    safeChallenges.forEach((challenge) => {
      const mutualList =
        challenge.mutualFollowers ??
        challenge.mutual_participants ??
        [];
      const creatorAvatar =
        currentUserId &&
        currentUserAvatar &&
        challenge.creator_id === currentUserId
          ? currentUserAvatar
          : normalizeUrl(
              challenge.creator_profile_picture || challenge.creator_avatar_url || ""
            );

      items.push(
        <div key={challenge.id} className="challenge-card">
          <ChallengeCard
            id={challenge.id}
            onClick={() => navigate(`/challenge/${challenge.id}`)}
            title={challenge.title}
            description={challenge.description}
            startDate={convertToJalali(challenge.start_time)}
            endDate={convertToJalali(challenge.end_time)}
            profiles={
              mutualList?.map((user: any) => ({
                id: user.id,
                name: user.username || user.name || "",
                avatar: resolveAvatarUrl(user),
                image: resolveAvatarUrl(user),
              })) ?? []
            }
            initialLikes={challenge.like_count}
            initialComments={challenge.comment_count}
            coverImage={
              normalizeUrl(challenge.cover_image || "") ||
              normalizeUrl(challenge.image_url) ||
              "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80"
            }
            isPrivate={challenge.visibility === "private"}
            isJoined={challenge?.is_user_participating ?? false}
            creator={{
              name: challenge.creator_username,
              avatar:
                creatorAvatar ||
                "https://images.unsplash.com/photo-1502764613149-7f1d229e230f",
            }}
          />
        </div>
      );
    });

    if ((loadingMore || uiLoadingMore) && hasMore) {
      for (let i = 0; i < Math.min(columnCount * 2, 6); i++) {
        items.push(
          <div key={`skeleton-${i}`}>
            <SkeletonChallengeCard />
          </div>
        );
      }
    }

    return items;
  }, [
    safeChallenges,
    loadingMore,
    hasMore,
    columnCount,
    navigate,
    currentUserId,
    currentUserAvatar,
  ]);

  if (safeChallenges.length === 0 && !loadingMore) {
    return (
      <div className="w-full py-32 flex items-center justify-center">
        <p className="text-gray-500">چالشی یافت نشد</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto px-2.5 py-3"
        style={{ gap: `${GAP}px` }}
      >
        {gridItems}
      </div>

      {loadingMore && (
        <div className="flex justify-center py-6">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full" />
          <span className="mr-2 text-gray-600">در حال بارگذاری...</span>
        </div>
      )}

      {!hasMore && safeChallenges.length > 0 && (
        <div className="text-center py-6 text-gray-500 border-t">
          تمام چالش‌ها نمایش داده شدند
        </div>
      )}
    </>
  );
};
