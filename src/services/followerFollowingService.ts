import { getData, deleteData, postData } from "./services";

export const fetchUsers = async (
  loggedInUserId: string,
  activeTab: "followers" | "followings"
) => {
  const endpoint =
    activeTab === "followers"
      ? `/api/v1/users/${loggedInUserId}/followers`
      : `/api/v1/users/${loggedInUserId}/following`;

  try {
    const data = await getData({ endPoint: endpoint });
    return data.users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

// Method to remove a follower
export const removeFollower = async (
  loggedInUserId: string,
  followerId: string,
  token: string
) => {
  const endpoint = `/api/v1/followers/remove`;


  const followerIdInt = parseInt(followerId, 10);


  if (isNaN(followerIdInt)) {
    throw new Error(`Invalid followerId: ${followerId}`);
  }

  const requestBody = {
    following_id: followerIdInt, 
  };

  try {
    console.log("Sending request to remove follower:", {
      endpoint,
      requestBody,
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await deleteData({
      endPoint: endpoint,
      data: requestBody,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data; 
  } catch (error) {
    console.error("Failed to remove follower:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    throw error; // Re-throw the error so the caller can handle it
  }
};

// Method to remove a following
export const removeFollowing = async (
  loggedInUserId: string,
  followingId: string,
  token: string
) => {
  const endpoint = `/api/v1/follow`;

  const followingIdInt = parseInt(followingId, 10);

  if (isNaN(followingIdInt)) {
    throw new Error(`Invalid followingId: ${followingId}`);
  }

  const requestBody = {
    following_id: followingIdInt, 
  };

  try {
    const data = await deleteData({
      endPoint: endpoint,
      data: requestBody,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data; 
  } catch (error) {
    console.error("Failed to remove following:", error);
    throw error;
  }
};

export const followUser = async (
  loggedInUserId: string,
  userIdToFollow: string,
  token: string
) => {
  const endpoint = `/api/v1/follow`;


  const userIdToFollowInt = parseInt(userIdToFollow, 10);


  if (isNaN(userIdToFollowInt)) {
    throw new Error(`Invalid userIdToFollow: ${userIdToFollow}`);
  }

  const requestBody = {
    following_id: userIdToFollowInt,
  };

  try {
    const data = await postData({
      endPoint: endpoint,
      data: requestBody,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Failed to follow user:", error);
    throw error;
  }
};
