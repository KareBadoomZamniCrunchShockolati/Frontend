import React from "react";
import { ArrowLeft, Menu, Hexagon, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomButton from '@/components/Custom/CustomButton';

const ChallengeManagementPage: React.FC = () => {
  const imageUrl =
    "https://www.muchbetteradventures.com/magazine/content/images/size/w2000/2024/04/mount-everest-at-sunset.jpg"; // Direct URL

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleMenu = () => {
    console.log("Menu clicked");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4">
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Top buttons */}
        <div className="flex justify-between w-full items-center mb-4 max-w-xl">
          <button
            onClick={handleBack}
            className="text-primary w-11 h-11 border-2 border-primary rounded-[12.5px] px-2 py-2 flex items-center justify-center mr-4 hover:bg-orange-50"
          >
            <ArrowLeft className="w-full h-full text-primary" />
          </button>
          <button
            onClick={handleMenu}
            className="text-primary w-11 h-11 border-2 border-primary rounded-[12.5px] px-2 py-2 flex items-center justify-center hover:bg-orange-50"
          >
            <Menu className="w-full h-full text-primary" />
          </button>
        </div>

        {/* Image container with shadow */}
        <div className="relative w-full max-w-xl mb-4">
          <img
            src={imageUrl} // Direct image URL
            alt="Scenic Landscape"
            className="w-full h-auto rounded-[8px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
          {/* Badge container with solid shadow (zero blur) */}
          <div className="absolute h-11 bottom-[-10px] right-[-0px] bg-secondary border-1 border-black p-1 rounded-[8px] flex space-x-2 items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* All badges with the same background (secondary color) */}
            <button className="w-10 h-10 flex items-center justify-center bg-secondary p-1 rounded-full">
              <Hexagon className="w-full h-full text-yellow-500" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-secondary p-1 rounded-full">
              <Hexagon className="w-full h-full text-orange-900" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-secondary p-1 rounded-full">
              <Hexagon className="w-full h-full text-gray-400" />
            </button>
          </div>
        </div>

        {/* Title and Description in RTL (Persian) */}
        <div className="text-right mb-6 mt-8 max-w-2xl w-full" dir="rtl">
          <h1 className="text-2xl font-semibold text-primary mb-2">عنوان چالش</h1>
          <p className="text-md text-gray-700 text-justify">
            این چالش برای آزمایش استقامت و مهارت‌های حل مسئله شما طراحی شده است.
            سفر شامل پیمودن زمین‌های سخت و غلبه بر موانع مختلف است.
            آیا آماده‌اید تا این ماجراجویی را شروع کنید و مرزهای خود را بسنجید؟
          </p>
        </div>

        {/* Date and Location Container */}
        <div className="space-y-4 mt-6 mb-4 text-right w-full max-w-xl">
          <div className="flex items-center text-sm text-gray-700 justify-end w-full">
            <p>از 28 اردیبهشت تا 8 شهریور - سه روز در هفته</p>
            <Calendar className="w-6 h-6 m-1 text-primary" />
          </div>
          <div className="flex items-center text-sm text-gray-700 justify-end w-full">
            <p>قله کوه اورست</p>
            <MapPin className="w-6 h-6 m-1 text-primary" />
          </div>
        </div>

        {/* Custom Button placed at the bottom and centered */}
        <CustomButton className="w-full sm:w-full md:w-full max-w-xl bg-primary rounded-[8px] p-5 text-lg">
          پیوستن
        </CustomButton>
      </div>
    </div>
  );
};

export default ChallengeManagementPage;
