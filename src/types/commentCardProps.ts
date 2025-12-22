import type { CommentResponse } from "./commentTypes";

export interface CommentCardProps {
  refreshComments: () => void;
  comment: CommentResponse;
  depth?: number;
  parentUsername?: string;
  parentUserId?: number;
  isOpenFirstReplies?: boolean;
  entityType:"challenge"|"post";
  // openFirstReplies?:() => void;
  // closeFirstReplies?: () => void;
}