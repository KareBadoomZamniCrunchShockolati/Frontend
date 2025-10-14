import { Input } from "@/components/ui/input";
import type { InputHTMLAttributes } from "react";

type CustomInputProps = InputHTMLAttributes<HTMLInputElement>;

function CustomInput(props: CustomInputProps) {
  return (
    <Input
      {...props}
      className="placeholder: font-bold placeholder:text-[#6C96E6] h-[40px] border-[2px] border-[#000] text-[30px] p-[10px] bg-[transparent] rounded-[15px] text-right shadow-(--shadow-button)"
    />
  );
}

export default CustomInput;
