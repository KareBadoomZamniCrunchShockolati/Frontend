import React, { useState } from "react";
import CustomButton from "../Custom/CustomButton";
import { followUser, removeFollowing } from "@/services/followerFollowingService";

interface Props {
  loggedInUserId: string;  // Add the logged-in user ID
  userIdToFollow: string;  // ID of the user to follow/unfollow
  isFollowing?: boolean;   // Whether the user is already following
  token: string;           // Authorization token for API request
}

const ViewButton = ({ loggedInUserId, userIdToFollow, isFollowing = false, token }: Props) => {
  const [isUserFollowing, setIsUserFollowing] = useState(isFollowing);

  const handleFollowClick = async () => {
    try {
      // Follow the user
      await followUser(loggedInUserId, userIdToFollow, token);
      // After successful follow, update the state
      setIsUserFollowing(true);
    } catch (error) {
      console.error("Failed to follow the user:", error);
    }
  };

  const handleUnfollowClick = async () => {
    try {
      // Unfollow the user
      await removeFollowing(loggedInUserId, userIdToFollow, token);
      // After successful unfollow, update the state
      setIsUserFollowing(false);
    } catch (error) {
      console.error("Failed to unfollow the user:", error);
    }
  };

  return (
    <div className="flex justify-center mt-5">
      {isUserFollowing ? (
        <CustomButton
          backgroundColor="bg-red-500"
          width="w-60"
          onClick={handleUnfollowClick}
        >
          لغو دنبال
        </CustomButton>
      ) : (
        <CustomButton
          backgroundColor="bg-secondary"
          width="w-60"
          onClick={handleFollowClick}
        >
          بزن دنبالش
        </CustomButton>
      )}
    </div>
  );
};

export default ViewButton;
