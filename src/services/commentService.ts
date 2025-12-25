import type { CommentRequest, GetCommentsRequest } from "@/types/commentTypes";
import { deleteData, getData, postData, PROTECTED_BASE } from "./services";

export const CommentChallengeService = async ({
  entity_type = "challenge",
  entity_id,
  content,
  parent_id
}: CommentRequest) => {
  const data = await postData({
    endPoint: `${PROTECTED_BASE}/challenges/${entity_id}/comments`,
    data: { entity_type, entity_id, content, parent_id },
  });
  return data;
};

export const GetCommentsChallengeService = async (id:number) => {
  return await getData({
    endPoint: `${PROTECTED_BASE}/challenges/${id}/comments`,
  });
};
export const CommentPostService = async ({
  entity_type = "post",
  entity_id,
  content,
  parent_id
}: CommentRequest) => {
  const data = await postData({
    endPoint: `${PROTECTED_BASE}/posts/${entity_id}/comments`,
    data: { entity_type, entity_id, content, parent_id },
  });
  return data;
};

export const GetCommentsPostService = async (id:number) => {
  return await getData({
    endPoint: `${PROTECTED_BASE}/posts/${id}/comments`,
  });
};

// export const CommentService = async ({
//   entity_type,
//   entity_id,
//   content,
//   parent_id
// }: CommentRequest) => {
//   const data = await postData({
//     endPoint: `${PROTECTED_BASE}/comments`,
//     data: { entity_type, entity_id, content, parent_id },
//   });
//   return data;
// };

// export const GetCommentsService = async ({
//   entity_type,
//   entity_id,
// }: GetCommentsRequest) => {
//   return await getData({
//     endPoint: `${PROTECTED_BASE}/comments`,
//     params: { entity_type, entity_id },
//   });
// };