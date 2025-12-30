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
import { baseURL } from "@/services/services";

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
import { getParticipatingChallengesService } from "@/services/postService";
import { cn } from "@/lib/utils";
import { set } from "react-hook-form";
import { getBackendErrorMessage } from "@/services/errorService";
import { LikeChallengeService, UnlikeChallengeService, UnlikePostService } from "@/services/likeService";

import CustomToast from "@/components/Custom/CustomToast";
import { DEFAULT_CHALLENGE_IMG } from "@/data/mockImages";
import { Spinner } from "@/components/ui/spinner";
import { defaultChallengeData } from "@/data/mockChallenges";

const defaultChallenge = defaultChallengeData

const ChallengeInfo: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { challengeId } = useParams<{ challengeId: string }>();
  const challenge_Id = Number(challengeId);
  const [isLiked, setIsLiked] = useState(false);
  const payload: ChallengeDataDetails =
    (location.state?.challenge as ChallengeDataDetails) ?? defaultChallenge;

  const {
    Img,
    title,
    description,
    dateRange,
    location: challengeLocation,
  } = payload;

  const safeImageUrl = Img && Img.trim() !== "" ? Img : DEFAULT_CHALLENGE_IMG;

  const [challenge, setChallenge] = useState<ChallengeDataDetails>(
    payload as ChallengeDataDetails
  );
  const [participants, setParticipants] = useState<UserProfile[]>([]);
  // const [challengeId, setChallengeId] = useState<string | undefined>(
  //   useParams().challengeId
  // );
  const [searchTerm, setSearchTerm] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isParticipated, setIsParticipated] = useState<boolean>(false);

  const filteredUsers = useMemo(() => {
    if (participants) {
      return participants.filter((u) =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else return null;
  }, [participants, searchTerm]);

  const handleDelete = (id: string, username: string) => {
    console.log(`${username} (id:${id}) removed`);

  // Fallback from navigation state (kept for backward compatibility)
  const payload: ChallengeDataDetails =
    (location.state?.challenge as ChallengeDataDetails) ?? defaultChallenge;

  const normalizeUrl = (value?: string | null) => {
    if (!value) return "";
    if (/^https?:\/\//i.test(value)) return value;
    if (value.startsWith("/")) return `${baseURL}${value}`;
    return `${baseURL}/${value}`;
  };

  const safeImageUrl = payload.Img?.trim()
    ? payload.Img
    : payload.cover_image?.trim()
      ? normalizeUrl(payload.cover_image)
      : payload.image_url?.trim()
        ? normalizeUrl(payload.image_url)
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

  const handleLike = async () =>{
        if (!challenge) return;
        try {
          if (isLiked) {
            // Unlike
            await UnlikeChallengeService(Number(challengeId));
            setIsLiked(false);
            setLikeCount((prev) => prev - 1);
          } else {
            // Like
            await LikeChallengeService(Number(challengeId));
            setIsLiked(true);
            setLikeCount((prev) => prev + 1);
          }
        } catch (err) {
          CustomToast(getBackendErrorMessage(err), "error");
        }
      }
  const handleSave = () => console.log("Challenge saved!");

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
        setChallenge(fetchedChallenge);
        setLikeCount(fetchedChallenge.like_count);
        setIsLiked(fetchedChallenge.is_user_liked);
      } catch (err) {
        console.error("Failed to fetch challenge:", err);
        CustomToast("خطا در بارگذاری چالش", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [challenge_Id]);
  console.log("like count",likeCount)
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
    if (challenge.visibility == "public") {
      if (challenge_Id) {
        try {
          const data = await joinPublicChallenge(Number(challenge_Id));
          console.log(data);
        } catch (e) {
          // CustomToast(getBackendErrorMessage(e), "error");
        }
      }
    } else if (challenge.visibility == "private") {
      if (challenge_Id) {
        try {
          const data = await joinPrivateChallenge(Number(challenge_Id));
          console.log(data);
        } catch (e) {
          // CustomToast(getBackendErrorMessage(e), "error");
        }
      }
      setIsParticipated(true);
      CustomToast("با موفقیت به چالش پیوستید!", "success");
    } catch (e) {
      CustomToast("خطا در پیوستن به چالش", "error");
    }
  };

  const leaveChallengeHandler = async () => {
    if (challenge_Id) {
      try {
        const data = await leaveChallenge(Number(challenge_Id));
        setIsParticipated(false);
        console.log(data);
      } catch (e) {
        CustomToast(getBackendErrorMessage(e), "error");
      }
    }
  };

  // ← UPDATED LOADING STATE WITH SPINNER
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-12 text-primary" />
          <p className="text-lg">در حال بارگذاری چالش...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-4">
      <div className="flex-1 flex flex-col items-center">
        <BackButtonAndMenu onMenuClick={handleMenu} />

        <ImageAndBadgeContainer
          imageUrl={
            normalizeUrl(challenge.cover_image) ||
            challenge.Img ||
            normalizeUrl(challenge.image_url) ||
            undefined
          }
        />

        <LikeAndSaveButtons
          commentCount={challenge.comment_count}
          onLike={handleLike}
          onSave={handleSave}
          likeCount={likeCount}
          challengeId={Number(challengeId)}
          isLiked={isLiked}
        />

        <TitleAndDescription
          title={challenge.title}
          description={challenge.description}
        />

        <DateAndLocation
          dateRange={`${challenge.start_time} - ${challenge.end_time}`}
          location={challenge.address || challenge.location || "مکان مشخص نشده"}
        />

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
