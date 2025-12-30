import type {
  CreatePostPayload,
  LikeRequest,
  PresignPostImagesRequest,
  PresignPostImagesResponse,
  PresignPostImageUpload,
  UpdatePostPayload,
} from "@/types/postTypes";
import { deleteData, getData, postData, PROTECTED_BASE, putData } from "./services";

export const createPostService = async ({
  description,
  challenge_id,
  pictures,
}: CreatePostPayload) => {
    console.log("createPostService called with:", { description, challenge_id, pictures });
  const data = await postData({
    endPoint: `${PROTECTED_BASE}/posts`,
    data: { description, challenge_id, pictures },
  });
  return data;
};

export const presignPostImagesService = async (
  payload: PresignPostImagesRequest
): Promise<PresignPostImagesResponse> => {
  const data = await postData({
    endPoint: `${PROTECTED_BASE}/posts/images/presign`,
    data: payload,
  });

  if (data?.uploads) {
    return data as PresignPostImagesResponse;
  }

  if (data?.data?.uploads) {
    return data.data as PresignPostImagesResponse;
  }

  return { uploads: [] };
};

export const uploadPostImageToPresignedUrl = async (
  upload: PresignPostImageUpload,
  file: File
): Promise<void> => {
  if (!upload?.upload_url) {
    throw new Error("Missing upload URL for post image");
  }

  const headers: Record<string, string> = { ...(upload.headers || {}) };
  const hasHeader = (name: string) =>
    Object.keys(headers).some(
      (key) => key.toLowerCase() === name.toLowerCase()
    );

  if (!hasHeader("Content-Type")) {
    headers["Content-Type"] = file?.type || "image/png";
  }

  try {
    const signedHeadersParam =
      new URL(upload.upload_url).searchParams.get("X-Amz-SignedHeaders") || "";
    const signedHeaders = signedHeadersParam
      .split(";")
      .map((h) => h.trim().toLowerCase());

    if (signedHeaders.includes("x-amz-acl") && !hasHeader("x-amz-acl")) {
      headers["x-amz-acl"] = "public-read";
    }
  } catch (error) {
    console.warn("Could not parse signed headers from presigned URL", error);
  }

  const response = await fetch(upload.upload_url, {
    method: "PUT",
    headers,
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }
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
  const res = await getData({
    endPoint: `${PROTECTED_BASE}/posts/${id}`,
  });
  return res.data;
};

export const deletePostService = async (id: number) => {
  return await deleteData({
    endPoint: `${PROTECTED_BASE}/posts/${id}`,
  });
};

export const getParticipatingChallengesService = async () => {
  const res = await getData({
    endPoint: `${PROTECTED_BASE}/challenges/participating`,
  });
  return res.data;
};

export const getChallengesWithIdService = async (id: number) => {
  const res = await getData({
    endPoint: `${PROTECTED_BASE}/challenges/${id}`,
  });
  return res.data;
};


// export const LikeService = async ({
//   entity_type,
//   entity_id
// }: LikeRequest) => {
//   const data = await postData({
//     endPoint: `${PROTECTED_BASE}/likes`,
//     data: { entity_type, entity_id },
//   });
//   return data;
// };

// export const UnlikeService = async ({
//   entity_type,
//   entity_id
// }: LikeRequest) => {
//   return await deleteData({
//     endPoint: `${PROTECTED_BASE}/likes`,
//     data: { entity_type, entity_id },
//   });
// };

export const getUserPostsService = async (id: number) => {
  const res = await getData({
    endPoint: `${PROTECTED_BASE}/posts/user/${id}`,
  });
  return res.data;
};

export const getChallengePostsService = async (id: number) => {
  const res = await getData({
    endPoint: `${PROTECTED_BASE}/posts/challenge/${id}`,
  });
  return res.data;
};

export const getFollowingPostsService = async () => {
  const res = await getData({
    endPoint: `${PROTECTED_BASE}/posts/feed`,
  });
  return res.data;
};

