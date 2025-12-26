// src/components/VirtualChallengeList.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import ChallengeCard from "../Custom/ChallangeCard";
import SkeletonChallengeCard from "./SkeletonChallengeCard";
import type { Challenge } from "@/types/challengeTypes";
import { convertToJalali } from "../Custom/ConvertToJalali";
import { useNavigate } from "react-router-dom";

type VirtualChallengeListProps = {
  challenges: Challenge[];
  loadingMore: boolean;
  columnCount: number;
  onLoadMore: () => void;
  hasMore?: boolean;
};

const GAP = 12;
const LOAD_MORE_OFFSET = 300; // px مانده به انتهای صفحه

export const VirtualChallengeList = ({
  challenges = [],
  loadingMore,
  columnCount,
  onLoadMore,
  hasMore = true,
}: VirtualChallengeListProps) => {
  const navigate = useNavigate();
  const loadTriggeredRef = useRef(false);
  const [uiLoadingMore, setUiLoadingMore] = useState(true);

  const safeChallenges = Array.isArray(challenges) ? challenges : [];

  // 🔹 اسکرول روی window
  useEffect(() => {
    if (!hasMore) return;

    const onScroll = () => {
      if (loadingMore || loadTriggeredRef.current) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (documentHeight - (scrollTop + windowHeight) < LOAD_MORE_OFFSET) {
        loadTriggeredRef.current = true;
        setUiLoadingMore(true); // ⭐ اسکلتون فوراً ظاهر می‌شه

        setTimeout(() => {
          onLoadMore();
        }, 100);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadingMore, hasMore, onLoadMore]);

  // 🔹 بعد از لود شدن دیتا اجازه‌ی لود بعدی بده
  useEffect(() => {
    if (!loadingMore) {
      loadTriggeredRef.current = false;
      setUiLoadingMore(false); // ⭐ اسکلتون مخفی
    }
  }, [loadingMore]);

  const gridItems = useMemo(() => {
    const items = [];

    safeChallenges.forEach((challenge) => {
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
              challenge.mutualFollowers?.map((user: any) => ({
                id: user.id,
                name: user.username,
                avatar: user.avatar_url,
              })) ?? []
            }
            initialLikes={challenge.like_count}
            initialComments={challenge.comment_count}
            coverImage={
              challenge.image_url ||
              "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
            }
            isPrivate={challenge.visibility === "private"}
            isJoined={challenge?.is_user_participating ?? false}
            creator={{
              name: challenge.creator_username,
              avatar:
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
  }, [safeChallenges, loadingMore, hasMore, columnCount, navigate]);

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
