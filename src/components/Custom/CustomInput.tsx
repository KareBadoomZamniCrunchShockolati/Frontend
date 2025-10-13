import { Input } from "@/components/ui/input";
import type { InputHTMLAttributes } from "react";
import { useState } from "react";

type CustomInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function CustomInput({
  label = "متن",
  ...props
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  const isFloating = isFocused || hasValue;

  return (
    <div className="relative w-72">
      <Input
        {...props}
        type="email"
        required
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        dir="rtl"
        className={`
          border !border-[var(--borderDefault)]
          shadow-[0px_1px_0px_var(--borderDefault)]

          focus:!border-[var(--borderFoucus)]
          focus:!shadow-[0px_1px_0px_var(--borderFoucusShadow)]

          focus:!ring-0
          focus-visible:!ring-0
          rounded-xl
          h-10
          w-full
          text-right
          pr-4
          transition-all
          duration-200
          ease-in-out
          ${props.className ?? ""}
        `}
      />
      <label
        className={`
          absolute
          right-4
          pointer-events-none
          transition-all
          duration-200
          ease-in-out
          ${
            isFloating
              ? "top-[-10px] text-xs bg-white text-[var(--borderFoucus)]"
              : "top-[8px] text-sm text-gray-500"
          }
        `}
      >
        {label}
      </label>
    </div>
  );
}
