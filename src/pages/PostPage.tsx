import CustomButton from "@/components/Custom/CustomButton";
import TertiaryCustomButton from "@/components/Custom/TertiaryCustomButton";
import { posts } from "@/components/Profile/ProfilePosts";
import { Card, CardContent } from "@/components/ui/card";
import convertToPersianDigits from "@/utils/convertToPersianDigits";
import formatFollowBarNumber from "@/utils/formatFollowBarNumber";
import { ClipboardCheck, Heart, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const PostPage = () => {
  const { id } = useParams();
  const postId = Number(id);
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    return <div>No post found with this id!</div>;
  }
  const [isLiked, setIsLiked] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const maxChars = 75;
  const text = isExpanded ? post.text : post.text.substring(0, maxChars);
  return (
    <div className="w-full flex justify-center p-4">
      <Card className="w-full max-w-md rounded-[12.5px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black overflow-hidden relative">
        {/* Image */}
        <div className="w-full">
          <img
            src={post.imageUrl}
            alt={post.text}
            className="w-full h-auto object-cover"
          />
        </div>

        <CardContent className="pt-4 pb-4 relative">
          {post.challenge && (
            <div
              className="gap-[4px] flex items-center mb-[16px]"
              dir="rtl"
              onClick={() =>
                console.log("Go to challenge:", post.challenge?.id)
              }
            >
              <ClipboardCheck className="w-5 h-5 text-secondary" />
              <p
                className="font-medium hover:underline cursor-pointer text-right w-full truncate"
                dir="rtl"
              >
                {post.challenge.challengeTitle}
              </p>
            </div>
          )}

          {/* Like + Comment */}
          <div className="flex items-center gap-[16px] mb-[25px]" dir="rtl">
            <div className="gap-[4px] flex items-center" dir="rtl">
              <TertiaryCustomButton
                isGray={isLiked}
                onClick={() => setIsLiked(!isLiked)}
              >
                <span
                  dir="rtl"
                  className={`${isLiked ? "text-neutral-gray" : "text-primary"} transition-all duration-200`}
                >
                  {isLiked ? "پسندیدم" : "پسندیدن"}
                </span>
                <Heart
                  className={`w-5 h-5 ${isLiked ? "text-red-500" : "text-primary"} transition-all duration-200`}
                  fill={isLiked ? "red" : "white"}
                />
              </TertiaryCustomButton>
              <p>{convertToPersianDigits(formatFollowBarNumber(12300))}</p>
            </div>
            <div className="gap-[4px] flex items-center" dir="rtl">
              <TertiaryCustomButton>
                <span dir="rtl" className="text-primary">
                  نظر
                </span>
                <MessageCircle className="w-5 h-5 text-primary" />
              </TertiaryCustomButton>
              <p>{convertToPersianDigits(formatFollowBarNumber(12300))}</p>
            </div>
          </div>
          <div className="w-full h-[0.5px] bg-neutral-gray absolute right-0 left-0 translate-y-[-10px]"></div>
          {/* Caption */}
          {post.text.length > maxChars ? (
            <p dir="rtl" className="whitespace-pre-wrap break-words leading-relaxed">
              {text}{isExpanded ? "" : "..."}
              {' '}<button
                className="text-neutral-gray-bold text-xs font-semibold cursor-pointer hover:underline"
                onClick={() => setExpanded(!isExpanded)}
              >
                {isExpanded ? "کمتر" : "بیشتر"}
              </button>
            </p>
          ) : (
            <p dir="rtl" className="whitespace-pre-wrap break-words leading-relaxed">{post.text}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostPage;
