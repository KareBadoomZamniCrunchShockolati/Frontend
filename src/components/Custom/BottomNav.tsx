import { useLocation, useNavigate } from "react-router-dom";
import useUserStore from "@/store/userStore/userStore";

import Home from "@/assets/Icon/Home.svg";
import Profile from "@/assets/Icon/Profile.svg";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const userId = useUserStore((s) => s.userId);

  const isHome = location.pathname === "/main";
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isDarkMode = document.documentElement.classList.contains("dark");

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-2 border-foreground  border-b-0 bg-foreground shadow-lg rounded-tr-xl rounded-tl-xl ">
      <div className="flex h-16  bg-background rounded-tr-xl rounded-tl-xl overflow-hidden">
        {/* Home Button */}
        <button
          type="button"
          onClick={() => navigate("/main")}
          className={`
            w-full
            flex-1 flex flex-col items-center justify-center font-bold
            ${isHome ? "bg-primary text-background" : "text-foreground"}
            rounded-tr-xl
            transition-all duration-300 ease-in-out
          `}
        >
          {isDarkMode && !isHome && <img src={Home} alt="خانه" className="h-6 w-6 mb-1 dark:invert" />}
          {!isDarkMode && !isHome && <img src={Home} alt="خانه" className="h-6 w-6 mb-1" />}
          {isDarkMode && isHome && <img src={Home} alt="خانه" className="h-6 w-6 mb-1" />}
          {!isDarkMode && isHome && <img src={Home} alt="خانه" className="h-6 w-6 mb-1 dark:invert" />}
          <span className="text-xs">خانه</span>
        </button>

        <div className="w-1 bg-foreground shrink-0" />

        {/* Dashboard/Profile Button */}
        <button
          type="button"
          disabled={!userId}
          onClick={() => userId && navigate(`/dashboard/${userId}`)}
          className={`
            flex-1 flex flex-col items-center justify-center font-bold
            ${isDashboard ? "bg-primary text-background" : "text-foreground"}
            ${!userId ? "opacity-50 cursor-not-allowed" : ""}
            rounded-tl-xl
            transition-all duration-300 ease-in-out
          `}
        >
          {isDarkMode && !isDashboard && <img src={Profile} alt="پروفایل" className="h-6 w-6 mb-1w dark:invert" />}
          {isDarkMode && isDashboard && <img src={Profile} alt="پروفایل" className="h-6 w-6 mb-1w" />}
          {!isDarkMode && !isDashboard && <img src={Profile} alt="پروفایل" className="h-6 w-6 mb-1w" />}
          {!isDarkMode && isDashboard && <img src={Profile} alt="پروفایل" className="h-6 w-6 mb-1w dark:invert" />}
          
          <span className="text-xs">پروفایل</span>
        </button>
      </div>
    </div>
  );
}
