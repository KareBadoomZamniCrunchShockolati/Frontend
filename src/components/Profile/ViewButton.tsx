import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  // Import useParams
import CustomButton from "../Custom/CustomButton";
import { followUser, removeFollowing } from "@/services/followerFollowingService";
import useUserStore from "@/store/userStore/userStore";

interface Props {
  loggedInUserId: string;  // Add the logged-in user ID
  isFollowing?: boolean;   // Whether the user is already following
  token: string;           // Authorization token for API request
}

const ViewButton = ({ loggedInUserId, isFollowing = false, token }: Props) => {
  const [isUserFollowing, setIsUserFollowing] = useState(isFollowing);
  const { userId } = useParams<{ userId: string }>(); 


  const userToken = useUserStore(state => state.token) || ""; 

  const handleFollowClick = async () => {
    if (!userId) {
      console.error("No user ID found");
      return;
    }
    try {
      await followUser(loggedInUserId, userId, userToken);
      setIsUserFollowing(true);
    } catch (error) {
      console.error("Failed to follow the user:", error);
    }
  };

  const handleUnfollowClick = async () => {
    if (!userId) {
      console.error("No user ID found");
      return;
    }
    try {
      await removeFollowing(loggedInUserId, userId, userToken);
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
