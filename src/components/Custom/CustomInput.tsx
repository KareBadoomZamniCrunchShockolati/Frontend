import { Input } from "@/components/ui/input";
import type { InputHTMLAttributes } from "react";

type CustomInputProps = InputHTMLAttributes<HTMLInputElement>;

function CustomInput(props: CustomInputProps) {
  return <Input {...props} placeholder="Enter text" />;
}

export default CustomInput;
