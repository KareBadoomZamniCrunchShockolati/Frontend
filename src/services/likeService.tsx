import type { CreatePostPayload, LikeRequest, UpdatePostPayload } from "@/types/postTypes";
import { deleteData, getData, postData, PROTECTED_BASE, putData } from "./services";

export const LikePostService = async (id:number) => {
  const data = await postData({
    endPoint: `${PROTECTED_BASE}/posts/${id}/like`,
    data: {},
  });
  return data;
};

export const UnlikePostService = async (id:number) => {
  return await deleteData({
    endPoint: `${PROTECTED_BASE}/posts/${id}/like`,
  });
};

export const LikeChallengeService = async (id:number) => {
  const data = await postData({
    endPoint: `${PROTECTED_BASE}/challenges/${id}/like`,
    data: {},
  });
  return data;
};

export const UnlikeChallengeService = async (id:number) => {
  return await deleteData({
    endPoint: `${PROTECTED_BASE}/challenges/${id}/like`,
  });
};

export const getChallengeLikesService = async (id: number) => {
  return await getData({
    endPoint: `${PROTECTED_BASE}/challenges/${id}/likes`,
  });
};

export const getChallengeIsLikedService = async (id: number) => {
  return await getData({
    endPoint: `${PROTECTED_BASE}/challenges/${id}/is-liked`,
  });
};