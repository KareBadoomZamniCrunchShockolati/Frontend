import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import FollowBar from "../FollowBar";
import OwnerButton from "../OwnerButton";
import ViewButton from "../ViewButton";
import ProfileSideSheet from "../ProfileSideSheet";

import {
  getFollowersService,
  getFollowingService,
  getUserProfileService,
} from "@/services/userService";

import styles from "./ProfileHeader.module.css";
import Badge from "@/components/Custom/Badge";
import type { ProfileHeaderProps } from "@/types/profile";
import NameBio from "../NameBio";
import TopProfile from "@/components/topProfile";
import { cn } from "@/lib/utils";

function getUserInitials(fullName: string): string {
  if (!fullName) return "";
  const nameParts = fullName.trim().split(" ");
  const first = nameParts[0]?.charAt(0).toUpperCase() || "";
  const last =
    nameParts.length > 1
      ? nameParts[nameParts.length - 1].charAt(0).toUpperCase()
      : "";
  return first + last;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  personalColor = "bg-blue-500 text-white",
  isOwner = false,
  userId,
}) => {
  const [fullName, setFullName] = useState("User");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const initials = getUserInitials(fullName);

  useEffect(() => {
    if (!userId) return;

    async function fetchUserData() {
      try {
        const userData = await getUserProfileService(userId);
        if (userData?.fullName) setFullName(userData.fullName);
        else if (userData?.username) setFullName(userData.username);

        const followersRes = await getFollowersService(userId);
        if (followersRes?.count !== undefined)
          setFollowersCount(followersRes.count);

        const followingRes = await getFollowingService(userId);
        if (followingRes?.count !== undefined)
          setFollowingCount(followingRes.count);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    }

    fetchUserData();
  }, [userId]);
  const [badges, setBadges] = useState([
    {
      imageUrl: "https://samanskh.github.io/assets/images/bio-photo.jpg",
      style: styles.badgeCenter,
    },
    {
      imageUrl: "https://samanskh.github.io/assets/images/bio-photo.jpg",
      style: styles.badgeLeft,
    },
    {
      imageUrl: "https://samanskh.github.io/assets/images/bio-photo.jpg",
      style: styles.badgeRight,
    },
  ]);
  return (
    <>
      <TopProfile hideMenue={!isOwner} />
      <div
        onClick={() => console.log("show the badges!")}
        className={cn(
          "ms-auto  pe-2 w-9/10 cursor-pointer flex justify-between items-start mb-10"
        )}
      >
        <NameBio />
        <div className="ml-7 relative">
          <Avatar className="border-primary border-2 w-28 h-28 sm:w-34 sm:h-34 md:w-44 md:h-44 shadow-lg avatar">
            <AvatarImage src="https://samanskh.github.io/assets/images/bio-p/hoto.jpg" />
            <AvatarFallback
              className={`text-2xl font-semibold ${personalColor}`}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          {badges.map((x) => (
            <Badge
              imageUrl={x.imageUrl}
              className={cn(styles.badge, x.style)}
              borderWidth={3}
            />
          ))}
        </div>
      </div>

      <FollowBar fullName={fullName}></FollowBar>

      <div className="mt-10">
        {isOwner ? <OwnerButton /> : <ViewButton username={String(userId)} />}
      </div>
    </>
  );
};

export default ProfileHeader;
