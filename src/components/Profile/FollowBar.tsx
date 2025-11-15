import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import convertToPersianDigits from "@/utils/convertToPersianDigits";
import formatFollowBarNumber from "@/utils/formatFollowBarNumber";
import type { FollowBarProps } from "@/types/profile";

const FollowBar: React.FC<FollowBarProps> = () => {
  const location = useLocation(); // Retrieve state passed from the navigation
  const navigate = useNavigate();

  // Destructure the state passed through navigation (using useLocation hook)
  const {
    fullName = "saman khajeamiri",
    bio = "سلااام صبحت بخیررر",
    followersCount = 12520_000,
    followingCount = 12_300,
    doneChallengesCount = 1200,
  } = location.state || {}; // Use default values in case state is undefined

  const handleNavigateToFollowerFollowingPage = (
    tab: "followers" | "followings"
  ) => {
    navigate(`/follow?tab=${tab}`, {
      state: { fullName }, // Passing fullName as part of the state
    });
  };

  return (
    <div className="w-full max-w-md mx-auto mt-5 sm:mt-6.5 md:mt-8.4">
      <div className="flex justify-around text-center mr-5 ml-5">
        <div
          onClick={() => console.log("done challenges")}
          tabIndex={0}
          className="cursor-pointer active:bg-[var(--color-gray-main)] transition-all duration-200"
        >
          <p className="text-sm font-semibold sm:text-base md:text-lg text-black-500">
            موفقیت‌ها
          </p>
          <p className="text-sm sm:text-base md:text-lg text-black-800">
            {convertToPersianDigits(formatFollowBarNumber(doneChallengesCount))}
          </p>
        </div>

        <div
          onClick={() => handleNavigateToFollowerFollowingPage("followers")}
          tabIndex={0}
          className="cursor-pointer active:bg-[var(--color-gray-main)] transition-all duration-200"
        >
          <p className="text-sm font-semibold sm:text-base md:text-lg text-black-500">
            دنبال‌کنیا
          </p>
          <p className="text-sm sm:text-base md:text-lg text-black-800">
            {convertToPersianDigits(formatFollowBarNumber(followersCount))}
          </p>
        </div>

        <div
          onClick={() => handleNavigateToFollowerFollowingPage("followings")}
          tabIndex={0}
          className="cursor-pointer active:bg-[var(--color-gray-main)] transition-all duration-200"
        >
          <p className="text-sm font-semibold sm:text-base md:text-lg text-black-500">
            من‌دنبالشونم
          </p>
          <p className="text-sm sm:text-base md:text-lg text-black-800">
            {convertToPersianDigits(formatFollowBarNumber(followingCount))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FollowBar;
