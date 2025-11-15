import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import CustomButton from "../Custom/CustomButton";
import type { ViewBtnProps } from "@/types/profile";

// Assuming you have a followUser function to make the API call to follow a user
const followUser = async (username: string) => {
  try {
    // Replace with actual API logic to follow the user
    // Example: await api.followUser(username);
    console.log(`Following ${username}`);
  } catch (error) {
    console.error("Failed to follow the user:", error);
  }
};

const ViewButton = ({ isFollowing = false, username }: ViewBtnProps) => {
  const [isUserFollowing, setIsUserFollowing] = useState(isFollowing);

  const handleFollowClick = async () => {
    // Perform the follow action (make API call, etc.)
    await followUser(username);

    // After successful follow, update the state to reflect the change
    setIsUserFollowing(true);
  };

  const handleUnfollowClick = async () => {
    // Handle unfollow logic (API call to remove from following list)
    // Example: await api.unfollowUser(username);
    console.log(`Unfollowed ${username}`);

    // After successful unfollow, update the state
    setIsUserFollowing(false);
  };

  return (
    <div className="px-2 mt-5 flex w-full justify-center">
      {isUserFollowing ? (
        <CustomButton
          backgroundColor="bg-red-500"
          width="w-full"
          onClick={handleUnfollowClick}
          className="font-bold !text-white text-profile-title-size"
        >
          لغو دنبال
        </CustomButton>
      ) : (
        <CustomButton
          backgroundColor="bg-primary"
          width="w-full"
          onClick={handleFollowClick}
          className="font-bold !text-white text-profile-title-size"
        >
          دنبال کن
        </CustomButton>
      )}
    </div>
  );
};

export default ViewButton;
