import CustomButton from "@/components/Custom/CustomButton";
import TertiaryCustomButton from "@/components/Custom/TertiaryCustomButton";
import { posts } from "@/components/Profile/ProfilePosts";
import { Card, CardContent } from "@/components/ui/card";
import useUserStore from "@/store/userStore/userStore";
import convertToPersianDigits from "@/utils/convertToPersianDigits";
import formatFollowBarNumber from "@/utils/formatFollowBarNumber";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ClipboardCheck, Heart, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getUserInitials } from "@/components/Profile/ProfileHeader/ProfileHeader";

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
  //hard code meow
  const { username } = useUserStore.getState();
  const initials = getUserInitials(username);
  const personalColor = "bg-blue-500 text-white";

  const mutualLikers = [
    { id: 1, image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg", fallback: "A" }, // man portrait
    { id: 2, image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e", fallback: "B" }, // woman portrait
    { id: 3, image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg", fallback: "C" }, // smiling woman
    { id: 4, image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e", fallback: "D" }, // man with glasses
  ];
  // const mutualLikers = [];
  const mutualCommenters = [
    { id: 1, image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg", fallback: "A" }, // man portrait
    { id: 2, image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e", fallback: "B" }, // woman portrait
    { id: 3, image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg", fallback: "C" }, // smiling woman
    { id: 4, image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e", fallback: "D" }, // man with glasses
  ];


  return (
    <div className="w-full flex justify-center p-4">
      <div className="w-full max-w-md relative">
        <div className="w-full flex items-center gap-3 mb-3" dir="rtl">
          <Avatar
            className="w-[85px] h-[85px] sm:w-[100px] sm:h-[100px] md:w-[115px] md:h-[115px]
                    rounded-full overflow-hidden mt-[5px]"
          >
            <AvatarImage
              alt={username}
              src="https://samanskh.github.io/assets/images/bio-photo.jpg"
              className="object-cover w-full h-full"
            />
            <AvatarFallback
              className={`text-2xl font-semibold ${personalColor} flex items-center justify-center w-full h-full rounded-full`}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div dir="rtl" className="flex flex-col gap-2 translate-y-[2px]">
            <p className="text-sm sm:text-base font-semibold text-black">
              {username}
            </p>
            <p
              dir="rtl"
              className="text-xs text-neutral-gray-bold font-semibold"
            >
              {convertToPersianDigits("2 ساعت پیش")}
            </p>
          </div>
        </div>
        <Card className="w-full max-w-md rounded-[12.5px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black overflow-hidden">
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
            {/* the gray line */}
            <div className="w-full h-[0.5px] bg-neutral-gray absolute right-0 left-0 translate-y-[-10px]"></div>
            {/* Caption */}
            <div className="flex justify-end mt-3">
              <div className="flex -space-x-2" dir="rtl">
                {mutualLikers && mutualLikers.slice(0, 3).map((profile, index) => (
                  <Avatar
                    key={profile.id}
                    className="relative h-8 w-8 border border-secondry rounded-full overflow-hidden shadow-sm transition-transform hover:scale-110"
                    style={{ zIndex: mutualLikers.length - index }}
                  >
                    <AvatarImage src={profile.image} className="object-cover w-full h-full"/>
                    <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                      {profile.fallback}
                    </AvatarFallback>
                  </Avatar>
                ))}

                {mutualLikers.length > 3 && (
                  <Avatar className="relative h-8 w-8 border border-secondry bg-gray-100 text-black text-xs flex items-center justify-center shadow-sm rounded-full">
                    +{mutualLikers.length - 3}
                  </Avatar>
                )}
              </div>
            </div>
            {post.text.length > maxChars ? (
              <p
                dir="rtl"
                className="whitespace-pre-wrap break-words leading-relaxed"
              >
                {text}
                {isExpanded ? "" : "..."}{" "}
                <button
                  className="text-neutral-gray-bold text-xs font-semibold cursor-pointer hover:underline"
                  onClick={() => setExpanded(!isExpanded)}
                >
                  {isExpanded ? "کمتر" : "بیشتر"}
                </button>
              </p>
            ) : (
              <p
                dir="rtl"
                className="whitespace-pre-wrap break-words leading-relaxed"
              >
                {post.text}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostPage;
