/*  ChallengeInfo.tsx  */
import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomButton from "@/components/Custom/CustomButton";
import BackButtonAndMenu from "@/components/ChallengeManagement/info/BackButtonAndMenu";
import ImageAndBadgeContainer from "@/components/ChallengeManagement/info/ImageAndBadgeContainer";
import LikeAndSaveButtons from "@/components/ChallengeManagement/info/LikeAndSaveButtons";
import TitleAndDescription from "@/components/ChallengeManagement/info/TitleAndDescription";
import DateAndLocation from "@/components/ChallengeManagement/info/DateAndLocation";
import SearchBar from "@/components/ChallengeManagement/public/SearchBar";
import UserCardList from "@/components/ChallengeManagement/public/UserCardsList";
import ChallengeSlideshow from "@/components/ChallengeManagement/info/SlideShow";
import type { UserProfile } from "@/types/userTypes";
import type { ChallengeDataDetails } from "@/types/challengeElementsTypes";

// Keep your mocks!
import { mockChallenges } from "@/data/mockChallenges";

import { OverlappingCards } from "@/components/Custom/OverlappingCards";
import { cn } from "@/lib/utils";

// Use the correct fixed map component
import LocationMapPicker from "@/components/Custom/LocationMap";

import {
  fetchChallengeById,
  joinPrivateChallenge,
  joinPublicChallenge,
  leaveChallenge,
} from "@/services/challengeService";
import {
  getFollowersService,
  getFollowingService,
  getUserById,
} from "@/services/userService";

import CustomToast from "@/components/Custom/CustomToast";

const DEFAULT_CHALLENGE_IMG =
  "https://www.muchbetteradventures.com/magazine/content/images/size/w2000/2024/04/mount-everest-at-sunset.jpg";

const defaultChallenge: ChallengeDataDetails = {
  commentsEnabled: false,
  categories: [],
  type: "عمومی",
  memberCount: "0",
  title: "عنوان چالش",
  description:
    "این چالش برای آزمایش استقامت و مهارت‌های حل مسئله شما طراحی شده است. سفر شامل پیمودن زمین‌های سخت و غلبه بر موانع مختلف است. آیا آماده‌اید تا این ماجراجویی را شروع کنید و مرزهای خود را بسنجید؟",
  dateRange: "از 28 اردیبهشت تا 8 شهریور - سه روز در هفته",
  location: "قله کوه اورست",
  Img: DEFAULT_CHALLENGE_IMG,
  participants: [],
  like_count: 0,
  start_time: "28 اردیبهشت",
  end_time: "8 شهریور",
  visibility: "public",
};

const ChallengeInfo: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { challengeId } = useParams<{ challengeId: string }>();
  const challenge_Id = Number(challengeId);

  // Fallback from navigation state (kept for backward compatibility)
  const payload: ChallengeDataDetails =
    (location.state?.challenge as ChallengeDataDetails) ?? defaultChallenge;

  const safeImageUrl = payload.Img?.trim()
    ? payload.Img
    : DEFAULT_CHALLENGE_IMG;

  const [challenge, setChallenge] = useState<ChallengeDataDetails | any>(payload);
  const [participants, setParticipants] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isParticipated, setIsParticipated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Use real backend latitude/longitude for the map
  const displayCoordinates = useMemo<[number, number] | null>(() => {
    if (challenge?.latitude && challenge?.longitude) {
      return [challenge.latitude, challenge.longitude];
    }
    return [35.6892, 51.389]; // Tehran fallback
  }, [challenge?.latitude, challenge?.longitude]);

  const filteredUsers = useMemo(() => {
    return participants.filter(
      (u) =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
    );
  }, [participants, searchTerm]);

  const handleMenu = () => {
    navigate("/editChallenge", {
      state: {
        challenge: {
          ...challenge,
          Img: safeImageUrl,
          members: participants,
          memberCount: participants.length.toString(),
        },
      },
    });
  };

  const handleLike = () =>
    setChallenge((prev: any) => ({
      ...prev,
      like_count: (prev.like_count || 0) + 1,
    }));

  const nextSlide = () =>
    setCurrentSlide((i) => (i + 1) % mockChallenges.length);
  const prevSlide = () =>
    setCurrentSlide(
      (i) => (i - 1 + mockChallenges.length) % mockChallenges.length
    );

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!challenge_Id) return;
      try {
        const fetched = await fetchChallengeById(String(challenge_Id));
        setChallenge(fetched);
      } catch (err) {
        console.error("Failed to fetch challenge:", err);
        CustomToast("خطا در بارگذاری چالش", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [challenge_Id]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!challenge.participants?.length) {
        setParticipants([]);
        return;
      }

      const users: UserProfile[] = [];
      for (const p of challenge.participants) {
        try {
          const user = await getUserById(p.user_id);
          const followers = await getFollowersService(p.user_id);
          const following = await getFollowingService(p.user_id);

          users.push({
            id: user.id,
            username: user.username,
            imagePath: user.profile_picture || "",
            bio: user.bio || "",
            followersCount: followers.count || 0,
            followingCount: following.count || 0,
            doneChallengesCount: 0,
          });
        } catch (err) {
          console.error("Error fetching participant:", err);
        }
      }
      setParticipants(users);
    };
    fetchUsers();
  }, [challenge.participants]);

  const joinChallengeHandler = async () => {
    try {
      if (challenge.visibility === "public") {
        await joinPublicChallenge(challenge_Id);
      } else {
        await joinPrivateChallenge(challenge_Id);
      }
      setIsParticipated(true);
      CustomToast("با موفقیت به چالش پیوستید!", "success");
    } catch (e) {
      CustomToast("خطا در پیوستن به چالش", "error");
    }
  };

  const leaveChallengeHandler = async () => {
    try {
      await leaveChallenge(challenge_Id);
      setIsParticipated(false);
      CustomToast("چالش را ترک کردید", "success");
    } catch (e) {
      CustomToast("خطا در ترک چالش", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg">در حال بارگذاری چالش...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-4">
      <div className="flex-1 flex flex-col items-center">
        <BackButtonAndMenu onMenuClick={handleMenu} />

        <ImageAndBadgeContainer imageUrl={challenge.Img ?? challenge.image_url ?? undefined} />

        <LikeAndSaveButtons
          onLike={handleLike}
          onSave={() => console.log("Challenge saved!")}
          likeCount={challenge.like_count || 0}
        />

        <TitleAndDescription
          title={challenge.title}
          description={challenge.description}
        />

        <DateAndLocation
          dateRange={`${challenge.start_time} - ${challenge.end_time}`}
          location={challenge.address || challenge.location || "مکان مشخص نشده"}
        />

        {/* INTERACTIVE READ-ONLY MAP — Pin fixed, pan/zoom allowed */}
        <div className="w-full max-w-xl mt-6">
          <LocationMapPicker
            onLocationSelect={() => {}} // Required but ignored
            initialPosition={displayCoordinates}
            height="h-50"
            readOnly={true}
          />
        </div>

        {/* Action Buttons */}
        <CustomButton
          onClick={joinChallengeHandler}
          className={cn(
            "mt-6 w-full max-w-xl bg-primary rounded-2xl p-5 text-lg",
            isParticipated && "hidden"
          )}
        >
          پیوستن
        </CustomButton>

        <CustomButton
          className={cn(
            "mt-6 w-full max-w-xl bg-secondary rounded-2xl p-5 text-lg",
            !isParticipated && "hidden"
          )}
        >
          مشاهده پیشرفت
        </CustomButton>

        <CustomButton
          onClick={leaveChallengeHandler}
          className={cn(
            "mt-6 w-full max-w-xl bg-red-main rounded-2xl p-5 text-lg",
            !isParticipated && "hidden"
          )}
        >
          ترک چالش
        </CustomButton>

        {/* Participants */}
        <div className="w-full max-w-2xl mt-8" dir="rtl">
          <h2 className="text-xl font-semibold mb-4">شرکت‌کنندگان</h2>
          <SearchBar
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />
          <UserCardList
            users={filteredUsers}
            onDelete={() => {}}
            isOwner={false}
          />
        </div>

        {/* Related Challenges Slideshow — MOCKS KEPT! */}
        <div className="w-full max-w-2xl mt-10" dir="rtl">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <img
              src="/src/assets/Img/staircase.jpg"
              alt="Staircase"
              className="w-8 h-8 ml-2"
            />
            چالش‌های مرتبط
          </h2>

          <ChallengeSlideshow
            currentChallengeIndex={currentSlide}
            mockChallenges={mockChallenges}
            nextSlide={nextSlide}
            prevSlide={prevSlide}
          />
        </div>

        {/* View Posts Button */}
        <div
          className="w-full mt-12"
          onClick={() => {
            setTimeout(() => {
              navigate(`/challenge/${challenge_Id}/posts`);
            }, 200);
          }}
        >
          <div
            className="
              relative flex items-center justify-between rounded-2xl
              border-2 shadow-shadow-strong border-black px-10 py-8
              active:shadow-none active:translate-y-[3px] active:translate-x-[3px]
              transition-all duration-25
            "
            style={{
              background: "linear-gradient(135deg, var(--primary), #ff8f33)",
            }}
          >
            <div className="text-white text-right">
              <h2 className="text-2xl font-bold mb-2">مشاهده پست‌های چالش</h2>
              <p className="text-sm opacity-90">
                دیدن تمام پست‌های ثبت شده توسط شرکت‌کنندگان
              </p>
            </div>
            <div className="relative">
              <OverlappingCards />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeInfo;