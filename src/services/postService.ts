import type { CreatePostPayload, UpdatePostPayload } from "@/types/postTypes";
import { deleteData, getData, postData, PROTECTED_BASE, putData } from "./services";

export const createPostService = async ({
  description,
  challengeID,
  pictures,
}: CreatePostPayload) => {
  const data = await postData({
    endPoint: `${PROTECTED_BASE}/posts`,
    data: { description, challengeID, pictures },
  });
  return data;
};

export const updatePostService = async ({
  id,
  description,
  pictures,
}: UpdatePostPayload) => {
  const data = await putData({
    endPoint: `${PROTECTED_BASE}/posts/${id}`, 
    data: { description, pictures },
  });
  return data;
};

export const getPostService = async (id: number) => {
  return await getData({
    endPoint: `${PROTECTED_BASE}/posts/${id}`,
  });
};

export const deletePostService = async (id: number) => {
  return await deleteData({
    endPoint: `${PROTECTED_BASE}/posts/${id}`,
  });
};

export const getParticipatingChallengesService = async () => {
  return await getData({
    endPoint: `${PROTECTED_BASE}/challenges/participating`,
  });
};

