// src/components/Custom/BackButton.tsx
import React from "react";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void; // This is the click handler prop
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-primary w-11 h-11 border-2 border-primary rounded-[12.5px] px-2 py-2 flex items-center justify-center mr-4 hover:bg-orange-50"
    >
      <ArrowLeft className="w-full h-full text-primary" />
    </button>
  );
};

export default BackButton;
