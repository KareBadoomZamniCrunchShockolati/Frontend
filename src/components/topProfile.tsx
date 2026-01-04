import React, { useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DarkModeSwitch from "@/pages/DarkLightMode"; // مسیر رو درست کن

interface TopProfileProps {
  hideMenu?: boolean; // اختیاری: اگر true باشه منو نشون داده نمی‌شه
}

const TopProfile: React.FC<TopProfileProps> = ({ hideMenu = false }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Header Bar */}
      <div className="p-2 flex justify-between w-full items-center mb-4 max-w-xl">
        <button
          onClick={handleBack}
          className="text-primary w-11 h-11 border-2 border-primary rounded-xl flex items-center justify-center hover:bg-primary/10 transition-colors"
          aria-label="بازگشت"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {!hideMenu && (
          <button
            onClick={toggleMenu}
            className="text-primary w-11 h-11 border-2 border-primary rounded-xl flex items-center justify-center hover:bg-primary/10 transition-colors"
            aria-label="منو"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}
      </div>

      {/* Side Menu - Slides from Right */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-card shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Top of Menu - Dark Mode Switch */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">تنظیمات</h2>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="بستن منو"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            {/* Dark Mode Switch - Right on top */}
            <div className="mt-6">
              <DarkModeSwitch />
            </div>
          </div>

          {/* Rest of menu content (you can add more items later) */}
          <div className="flex-1 p-6">
          </div>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default TopProfile;