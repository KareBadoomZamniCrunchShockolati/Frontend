import { useEffect, useState } from "react";
import SearchBar from "@/components/ChallengeManagement/public/SearchBar";
import tick from "@/assets/Img/Icon/tick-square.svg";
import cross from "@/assets/Img/Icon/Close Square.svg";
import thumb from "@/assets/Img/Group 101.png";
import TopBackText from "./TopBackText";
import {
  acceptReq,
  deleteReq,
  showRequestingUsers,
} from "@/services/challengeService";
import type { User } from "@/types/acceptUser";
import { useNavigate, useParams } from "react-router-dom";
import { getBackendErrorMessage } from "@/services/errorService";
import CustomToast from "./CustomToast";

const AcceptList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const { challengeId } = useParams<{ challengeId: string }>();

  const searchedUsers = users.filter((user) =>
    user.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      if (!isNaN(Number(challengeId))) {
        const users = await showRequestingUsers(Number(challengeId));
        setUsers(users);
      } else {
        console.log("challenge id must be a number");
      }
    } catch (err) {
      CustomToast(getBackendErrorMessage(err), "error");
    }
  };

  const handleAccept = async (reqId: number) => {
    try {
      const data = await acceptReq(reqId);
      console.log(data);
      navigate(0);
    } catch (e) {
      CustomToast(getBackendErrorMessage(e), "error");
    }
  };

  const handleDelete = async (reqId: number) => {
    try {
      const data = await deleteReq(reqId);
      console.log(data);
      navigate(0);
    } catch (e) {
      CustomToast(getBackendErrorMessage(e), "error");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <TopBackText text="درخواست‌های پیوستن" />
      <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
      <div
        className="flex-1 overflow-y-auto px-[var(--side-page)] pb-20"
        style={
          {
            "--thumb-image": `url('${thumb}')`,
          } as React.CSSProperties
        }
      >
        <div className="space-y-4 py-4">
          {searchedUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              درخواستی برای پیوستن وجود ندارد
            </p>
          ) : (
            searchedUsers.map((user) => (
              <div
                key={user.requestId}
                className="flex items-center justify-between p-4 rounded-xl bg-card border border-foreground/20 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={user.user.profile_picture || ""}
                      alt={user.user.username}
                    />
                  </div>
                  <p className="font-medium text-foreground">
                    {user.user.username}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
                    onClick={() => handleDelete(user.requestId)}
                  >
                    <img src={cross} alt="رد کردن" className="w-6 h-6" />
                  </button>
                  <button
                    className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                    onClick={() => handleAccept(user.requestId)}
                  >
                    <img src={tick} alt="پذیرش" className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptList;