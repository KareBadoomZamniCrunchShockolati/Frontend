// components/Custom/LikeSaveButtons.tsx
import React from "react";
import { ThumbsUp, Bookmark } from "lucide-react";
import CustomButton from "@/components/Custom/CustomButton";
import type { LikeSaveButtonsProps } from "@/types/challengeElementsTypes";

const LikeAndSaveButtons: React.FC<LikeSaveButtonsProps> = ({
  likeCount,
  // commentCount = 0,
  onLike,
  onSave,
  // isLiked = true,
}) => {
  console.log(likeCount);
  
  const isLiked = true;
  const commentCount = 0;
  
  const colorThumbsup = isLiked ? "text-secondary" : "text-primary";
  const colorBorderThumbsup = isLiked ? "border-neutral-gray" : "border-primary";
  const shadowThumbsup = isLiked ? "shadow-neutral-gray" : "shadow-primary";

  return (
    <div className="flex space-x-4 mt-5 max-w-xl w-full justify-end">
      <div className="flex items-center space-x-2">

        {/* comment */}
        <span className="text-black text-xl mt-6">{commentCount}</span>
        <CustomButton
          className={`w-min sm:w-min md:w-min bg-white ${colorBorderThumbsup} ${shadowThumbsup} hover:bg-white rounded-primary-radius p-3 flex items-center space-x-2`}
          onClick={onLike}
        >
          <ThumbsUp className={`${colorThumbsup} w-5 h-5`} />
        </CustomButton>

        {/* like */}
        <span className="text-black text-xl mt-6">{likeCount}</span>
        <CustomButton
          className={`w-min sm:w-min md:w-min bg-white ${colorBorderThumbsup} ${shadowThumbsup} hover:bg-white rounded-primary-radius p-3 flex items-center space-x-2`}
          onClick={onLike}
        >
          <ThumbsUp className={`${colorThumbsup} w-5 h-5`} />
        </CustomButton>

        <CustomButton
          className="w-min sm:w-min md:w-min bg-white border-primary shadow-primary hover:bg-white rounded-primary-radius p-3 flex items-center space-x-2"
          onClick={onSave}
        >
          <Bookmark className="text-primary w-5 h-5" />
        </CustomButton>
      </div>
    </div>
  );
};

export default LikeAndSaveButtons;
