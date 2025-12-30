// CustomSwitchButton.tsx

import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface CustomSwitchButtonProps {
  name: string;
  labelText?: string;
  classNames?: {
    label?: string;
    switch?: string;
  };
  checked?: boolean;              // NEW
  onCheckedChange?: (checked: boolean) => void; // NEW
}

const CustomSwitchButton: React.FC<CustomSwitchButtonProps> = ({
  name,
  labelText = "متن",
  classNames = {},
  checked: externalChecked,
  onCheckedChange: externalOnChange,
}) => {
  // Use internal state only if not controlled
  const [internalChecked, setInternalChecked] = useState(false);
  
  const isControlled = externalChecked !== undefined;
  const checked = isControlled ? externalChecked : internalChecked;

  const handleChange = (newChecked: boolean) => {
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    externalOnChange?.(newChecked);
  };

  return (
    <div className="flex items-center space-x-3 space-x-reverse">
      {labelText && (
        <label className={`${classNames?.label} select-none`}>
          {labelText}
        </label>
      )}

      <Switch
        id={name}
        checked={checked}
        onCheckedChange={handleChange}
        className={`
          ${classNames?.switch}
          border-[2px]
          ${checked ? 'bg-primary border-primary' : 'bg-white border-black'}
          data-[state=checked]:bg-primary data-[state=checked]:border-primary
          data-[state=unchecked]:bg-white data-[state=unchecked]:border-black
          relative inline-flex items-center rounded-full transition-colors duration-300
          shadow-none
        `}
      />
    </div>
  );
};

export default CustomSwitchButton;