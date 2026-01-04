import { useEffect, useState } from "react";
import thumb from "@/assets/Img/Group 101.png";
import TopBackText from "./TopBackText";
import checked from "@/assets/Img/Icon/checked.svg";
import userI from "@/assets/Img/Icon/User.svg";
import { cn } from "@/lib/utils";
import {
  fetchChallengeById,
  inviteMultipleUsersToChallenge,
} from "@/services/challengeService";
import {
  getFollowersService,
  getUserProfileService,
} from "@/services/userService";
import CustomBtn from "./CustomBtn";
import type { UserIvite } from "@/types/acceptUser";
import { useNavigate, useParams } from "react-router-dom";
import CustomToast from "@/components/Custom/CustomToast";
import { getBackendErrorMessage } from "@/services/errorService";

const InviteList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [followers, setFollowers] = useState<UserIvite[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserIvite[]>([]);
  const [participants, setParticipants] = useState<number[]>([]);
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();

  // Fetch current logged-in user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getUserProfileService(); // assuming it returns current user
        setCurrentUserId(Number(user.id));
      } catch (err) {
        CustomToast(getBackendErrorMessage(err), "error");
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch challenge participants (to exclude already joined users)
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!challengeId) return;
      try {
        const challenge = await fetchChallengeById(challengeId);
        setParticipants(challenge.participants.map((p: any) => p.user_id));
      } catch (err) {
        CustomToast(getBackendErrorMessage(err), "error");
      }
    };
    fetchParticipants();
  }, [challengeId]);

  // Fetch followers once currentUserId is available
  useEffect(() => {
    const fetchFollowers = async () => {
      if (!currentUserId) return;
      try {
        const response = await getFollowersService(String(currentUserId));
        setFollowers(response.users || response || []);
      } catch (err) {
        CustomToast(getBackendErrorMessage(err), "error");
      }
    };
    fetchFollowers();
  }, [currentUserId]);

  const inviteUsers = async () => {
    if (!challengeId || selectedUsers.length === 0) {
      CustomToast("کاربری انتخاب نشده یا چالش معتبر نیست", "error");
      return;
    }
    try {
      const ids = selectedUsers.map((u) => u.id);
      await inviteMultipleUsersToChallenge(challengeId, ids);
      CustomToast("دعوت‌نامه‌ها با موفقیت ارسال شد!", "success");
      navigate(-1);
    } catch (err) {
      CustomToast(getBackendErrorMessage(err), "error");
    }
  };

  const availableFollowers = followers.filter(
    (user) => !participants.includes(user.id)
  );

  const Chip = ({
    id,
    username,
    color,
  }: {
    id: number;
    username: string;
    color: "gray" | "orange" | "blue";
  }) => (
    <div
      onClick={() => {
        setSelectedUsers(selectedUsers.filter((u) => u.id !== id));
      }}
      className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium cursor-pointer",
        color === "gray"
          ? "bg-muted text-muted-foreground"
          : color === "orange"
            ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      )}
    >
      <img src={userI} alt="" className="w-4 h-4" />
      <span>{username}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <TopBackText text="دعوت افراد جدید" />

      <div className="px-6 py-4">
        <div className="mb-6 p-4 border-2 border-foreground/20 rounded-2xl bg-card">
          <div className="flex flex-wrap gap-2">
            {selectedUsers.length === 0 ? (
              <p className="text-muted-foreground text-sm">کاربری انتخاب نشده</p>
            ) : (
              selectedUsers.map((user, index) => (
                <Chip
                  key={user.id}
                  id={user.id}
                  username={user.username}
                  color={
                    index % 3 === 0 ? "gray" : index % 3 === 1 ? "orange" : "blue"
                  }
                />
              ))
            )}
          </div>
        </div>

        <CustomBtn
          color="bg-primary"
          onClick={inviteUsers}
          className="w-full mb-6"
          disabled={selectedUsers.length === 0}
        >
          دعوت ({selectedUsers.length})
        </CustomBtn>

        <div className="flex-1 overflow-y-auto pb-20" style={{ "--thumb-image": `url('${thumb}')` } as React.CSSProperties}>
          <div className="space-y-4">
            {availableFollowers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                فالوئری برای دعوت وجود ندارد
              </p>
            ) : (
              availableFollowers.map((user) => {
                const isSelected = selectedUsers.some((u) => u.id === user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
                      } else {
                        setSelectedUsers([...selectedUsers, user]);
                      }
                    }}
                    className="flex items-center justify-between p-4 rounded-xl bg-card border border-foreground/20 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full bg-muted overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={user.profile_picture || ""}
                          alt={user.username}
                        />
                        {isSelected && (
                          <img
                            src={checked}
                            alt="انتخاب شده"
                            className="absolute inset-0 w-full h-full p-2"
                          />
                        )}
                      </div>
                      <p className="font-medium text-foreground">{user.username}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteList;