import { Button } from "@/components/ui/button";
import type { CustomBtnProps } from "@/types/btnTypes";
export default function CustomBtn({
  color = "#fff",
  children,
  ...props
}: CustomBtnProps) {
  return (
    <Button
      {...props}
      className={`
        h-[40px] border-[2px] border-[#000] rounded-[15px]
        font-bold cursor-pointer transition-all duration-200
        w-full bg-[#ff7700] mb-[20px] py-[3px] px-[39px] text-[20px]
        hover:bg-[#ff7700]
        disabled:opacity-50 disabled:cursor-not-allowed text-[${color}]
      `}
    >
      {children}
    </Button>
  );
}
