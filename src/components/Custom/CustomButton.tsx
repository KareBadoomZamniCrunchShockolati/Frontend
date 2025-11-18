import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../ui/spinner";
import { set } from "react-hook-form";

//onClick={() => handleClickEdit()} className={`w-40 h-8.5 rounded-[12.5px] bg-[var(--color-blue-side)] text-white font-bold ${pressedEdit ? "shadow-none translate-y-[3px]" : "shadow-[0_3px_0px_0px_rgba(0,0,0,1)]"} transition-all duration-200 border-2 border-black `

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  backgroundColor?: string;
  pageAddress?: string;
  width?: string;
  onClick?: () => void;
  className?: string;
  height?: string;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
}

const CustomButton = ({
  children,
  backgroundColor = "bg-neutral-gray",
  pageAddress,
  width = "w-40 sm:w-50 md:w-60",
  className = "",
  onClick,
  height = "h-[40px]",
  type = "button",
  loading = false,
  ...props
}: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    setTimeout(() => {
      if (onClick) {
        onClick();
      }
      if (pageAddress) {
        navigate(pageAddress);
      }
    }, 200);
  };

  return (
    <Button
    {...props}
      {...(type ? { type } : {})}
      onClick={handleClick}
      className={`${width} hover:${backgroundColor} sm:text-sm md:text-base cursor-pointer ${height} sm:h-10 rounded-[12.5px] text-white font-bold ${backgroundColor} active:shadow-none active:translate-y-[3px] shadow-[0_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-25 border-2 border-black ${className} `}
      disabled={loading || props.disabled}
    >
      {loading && <Spinner />}
      {children}
    </Button>
  );
};

export default CustomButton;
