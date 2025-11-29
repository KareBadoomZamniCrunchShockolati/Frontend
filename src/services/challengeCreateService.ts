// src/services/challengeService.ts

import { postData } from "./services";
import type { UserProfile } from "@/types/userTypes";

// -------------------------------------------------------------------
// ساخت چالش جدید
// -------------------------------------------------------------------
export const createChallenge = async (payload: {
  title: string;
  description: string;
  category_id: number;
  max_participants?: number | null;
  visibility: "public" | "private";
  rule?: string;
  comments_enabled: boolean;
  start_time: string;
  end_time: string;
  timezone: string;
  image_url?: string | null;
}) => {
  try {
    const response = await postData({
      endPoint: "/api/v1/challenges",
      data: payload,
    });

    // فرض: بک‌اند { data: { ID: 123, ... } } برمی‌گردونه
    return response;
  } catch (error) {
    console.error("Failed to create challenge:", error);
    throw error;
  }
};

// -------------------------------------------------------------------
// دعوت یک کاربر به چالش
// -------------------------------------------------------------------
export const inviteUserToChallenge = async (
  challengeId: number | string,
  inviteeId: number | string
) => {
  const inviteeIdInt = Number(inviteeId);
  if (isNaN(inviteeIdInt)) {
    throw new Error(`Invalid inviteeId: ${inviteeId}`);
  }

  try {
    const response = await postData({
      endPoint: `/api/v1/challenges/${challengeId}/invite`,
      data: { invitee_id: inviteeIdInt },
    });

    return response;
  } catch (error) {
    console.error(`Failed to invite user ${inviteeId} to challenge ${challengeId}:`, error);
    throw error;
  }
};

// -------------------------------------------------------------------
// دعوت همزمان چند کاربر (بهینه و تمیز)
// -------------------------------------------------------------------
export const inviteMultipleUsersToChallenge = async (
  challengeId: number | string,
  userIds: (number | string)[]
) => {
  const promises = userIds.map((userId) =>
    inviteUserToChallenge(challengeId, userId).catch((err) => ({
      userId,
      success: false,
      error: err.message || "Invite failed",
    }))
  );

  const results = await Promise.allSettled(promises);

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return { userId: userIds[index], success: true };
    } else {
      const rejected = result as PromiseRejectedResult;
      return {
        userId: userIds[index],
        success: false,
        error: rejected.reason?.error || rejected.reason?.message || "Unknown error",
      };
    }
  });
};