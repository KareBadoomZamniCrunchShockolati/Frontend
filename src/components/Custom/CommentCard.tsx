import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp } from "lucide-react";
import type { CommentResponse } from "@/types/commentTypes";
import convertToPersianDigits from "@/utils/convertToPersianDigits";
import { timeAgo } from "@/utils/timeAgoDiff";
import formatFollowBarNumber from "@/utils/formatFollowBarNumber";
import { LikeService, UnlikeService } from "@/services/postService";
import { Form, Formik } from "formik";
import CustomInput from "./CustomInput";
import { CommentService } from "@/services/commentService";
import CustomToast from "./CustomToast";
import { useParams } from "react-router-dom";
import { SendHorizontal } from 'lucide-react';

interface CommentCardProps {
  comment: CommentResponse;
}
const CommentCard = ({ comment }: CommentCardProps) => {
  const { id } = useParams();
  const postId = Number(id);
  const [openReplySection, setOpenReplySection] = useState(false);
  const replyColor = openReplySection ? "text-neutral-gray" : "text-primary";
  const pasokhColor = openReplySection ? "text-neutral-gray" : "text-black";
  const [isLiked, setIsLiked] = useState(comment.is_liked);
  const [likeCount, setLikeCount] = useState(comment.like_count);
  const isFirstLevel = comment.parent_id ? false : true;
  const thumsupColor = isLiked ? "text-secondary" : "text-neutral-gray";
  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        // Unlike
        await UnlikeService({ entity_type: "comment", entity_id: comment.id });
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        // Like
        await LikeService({ entity_type: "comment", entity_id: comment.id });
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };
  const handleSubmitReply = async (values: { commentText: string }) => {
    console.log("Submitting comment with values:", values);
    const response: CommentResponse = await CommentService({
      entity_type: "post",
      entity_id: postId,
      content: values.commentText,
      parent_id: comment.id,
    });
    setOpenReplySection(false);
    CustomToast("نظر با موفقیت ایجاد شد!", "success");
    console.log("Comment submitted:", response);
  };
  let border = "shadow-none border-none";
  if (isFirstLevel) {
    border = "border-2 border-black";
  }
  return (
    <Card className={`w-full rounded-xl ${border}`}>
      <CardContent className="pt-2 px-4 pb-6" dir="rtl">
        {/* Top Row: Avatar + Username + Timestamp */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Avatar className="w-[var(--profpic)] h-[var(--profpic)] bg-primary">
            <AvatarImage src={undefined} /> {/* Replace with actual avatar */}
            <AvatarFallback className="bg-primary/20 text-primary font-bold flex items-center justify-center">
              S
            </AvatarFallback>
          </Avatar>

          {/* Username and Time stacked vertically */}
          <div className="flex gap-[10px] items-center">
            <p className="font-semibold text-sm">
              {/* {username} */}
              {comment.username}
            </p>
            <p className="text-xs text-neutral-gray-bold font-medium">
              {convertToPersianDigits(timeAgo(comment.created_at))}
            </p>
          </div>
        </div>

        {/* Comment Text: aligned with username */}
        <div className="mr-[calc(var(--profpic)+12px)]">
          <p className="text-gray-text font-medium text-sm">
            {comment.content}
          </p>

          <div className="flex items-center gap-4 mt-3" dir="rtl">
            <div className="gap-1 flex items-center" dir="rtl">
              <ThumbsUp
                className={`w-5 h-5 ${thumsupColor} scale-x-[-1]`}
                onClick={handleLikeToggle}
              />
              <p className="text-black font-semibold text-xs">
                {convertToPersianDigits(formatFollowBarNumber(likeCount))}
              </p>
            </div>
            <div
              className="gap-1 flex items-center"
              dir="rtl"
              onClick={() => setOpenReplySection(!openReplySection)}
            >
              <MessageCircle
                className={`w-5 h-5 ${replyColor} scale-x-[-1] transition-all duration-50`}
              />
              <p className={`${pasokhColor} font-semibold text-xs`}>پاسخ</p>
            </div>
          </div>
          {openReplySection && (
            <div className="mt-3">
              <Formik
                initialValues={{ commentText: "" }}
                onSubmit={handleSubmitReply}
              >
                {({ handleSubmit }) => (
                  <Form onSubmit={handleSubmit} className="w-full">
                    <div className="w-full flex items-center gap-1">
                      <CustomInput
                        width="w-full"
                        name="commentText"
                        label="پاسخ به نظر"
                        icon={
                          <button
                            type="submit"
                            className="flex items-center cursor-pointer"
                          >
                            <SendHorizontal className="w-[20px] h-[20px] text-secondary scale-x-[-1]" />
                          </button>
                        }
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
