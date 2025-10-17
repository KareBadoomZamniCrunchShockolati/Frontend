import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface CustomCheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  labelText?: string;
  textTransparentOnChecked?: boolean;  
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked = false,
  onCheckedChange,
  labelText = 'متن',
  textTransparentOnChecked = false,  
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
    if (onCheckedChange) {
      onCheckedChange(checked);
    }
  };

  return (
    <label className="flex items-center cursor-pointer">
      <span
        className={`text-lg text-black mr-2 ${textTransparentOnChecked && isChecked ? 'opacity-30' : ''}`}
      >
        {labelText}
      </span>

      <Checkbox
        checked={isChecked}
        onCheckedChange={handleChange}
        className="
          rounded-[4px] 
          border-[2px] 
          bg-white
          data-[state=checked]:text-black
          data-[state=checked]:bg-[var(--orange-primary-color)]
        "
      />
    </label>
  );
};

export default CustomCheckbox;
