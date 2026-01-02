import CustomToast from "@/components/Custom/CustomToast";
import { Card, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { mockposts, postSkeleton } from "@/data/mockPosts";
import { getBackendErrorMessage } from "@/services/errorService";
import { getFollowingPostsService } from "@/services/postService";
import type { simplePost } from "@/types/profilePostsTypes";
import convertToPersianDigits from "@/utils/convertToPersianDigits";
import formatFollowBarNumber from "@/utils/formatFollowBarNumber";
import { mapBackendPostsToUI } from "@/utils/mapBackendPostsToUI";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FollowingPosts = () => {
  const [posts, setPosts] = useState<simplePost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const backendPosts = await getFollowingPostsService();
        const mappedPosts = mapBackendPostsToUI(backendPosts);
        setPosts(mappedPosts);
      } catch (err) {
        CustomToast(getBackendErrorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-3">
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3">
          {postSkeleton.map((post) => (
            <div key={post.id} className="break-inside-avoid mb-3">
              <Card className="overflow-hidden rounded-[12.5px] shadow-shadow-strong border-2 border-foreground bg-card">
                <div style={{ paddingTop: `${(1 / post.ratio) * 100}%`, position: "relative" }}>
                  <Skeleton className="absolute inset-0 rounded-[12.5px] rounded-b-none" />
                </div>
                <CardFooter className="p-4 py-2 justify-end">
                  <Skeleton className="h-4 w-4/5" />
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="px-[var(--side-page)] pt-[var(--top-page)] pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            className="p-2 border-2 border-foreground rounded-xl hover:bg-muted transition-colors"
            onClick={() => navigate("/main")}
          >
            <ArrowLeft className="w-8 h-8 text-primary" />
          </button>

          <p className="text-center font-bold text-title text-primary truncate" dir="rtl">
            پست‌های افراد دنبال‌شده
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground font-medium mt-10">
            پستی از افراد دنبال‌شده وجود ندارد
          </p>
        ) : (
          <div className="columns-2 sm:columns-3 md:columns-4 gap-3">
            {posts.map((post) => (
              <div key={post.id} className="break-inside-avoid mb-3">
                <Card
                  className="overflow-hidden rounded-xl shadow-shadow-strong border-2 border-foreground hover:shadow-2xl hover:opacity-90 transition cursor-pointer bg-card"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  {post.imageUrl && post.imageUrl.length > 0 && (
                    <div className="relative">
                      <img
                        src={mockposts[post.id - 1]?.imageUrl[0] || post.imageUrl[0]}
                        alt={`Post ${post.id}`}
                        className="object-cover w-full rounded-t-[10px]"
                      />
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm p-2 flex gap-4 items-center"
                        dir="rtl"
                      >
                        <div className="flex gap-[5px] text-white">
                          <Heart size={20} />
                          <span>
                            {convertToPersianDigits(formatFollowBarNumber(post.like_count))}
                          </span>
                        </div>
                        <div className="flex gap-[5px] text-white">
                          <MessageCircle size={20} />
                          <span>
                            {convertToPersianDigits(formatFollowBarNumber(post.comment_count))}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <CardFooter className="p-4 py-2 justify-end">
                    <div className="flex flex-col gap-2 w-full">
                      <p
                        className={
                          post.imageUrl && post.imageUrl.length > 0
                            ? "truncate text-foreground"
                            : "leading-relaxed line-clamp-5 text-foreground"
                        }
                        dir="rtl"
                      >
                        {post.text}
                      </p>
                      {post.imageUrl && post.imageUrl.length === 0 && (
                        <div className="flex gap-4" dir="rtl">
                          <div className="flex gap-[5px]">
                            <Heart size={20} />
                            <span className="text-foreground">
                              {convertToPersianDigits(formatFollowBarNumber(post.like_count))}
                            </span>
                          </div>
                          <div className="flex gap-[5px]">
                            <MessageCircle size={20} />
                            <span className="text-foreground">
                              {convertToPersianDigits(formatFollowBarNumber(post.comment_count))}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowingPosts;