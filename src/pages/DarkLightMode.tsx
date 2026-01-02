// src/components/Custom/DarkModeSwitch.tsx  (or wherever you prefer)

import React from 'react';
import CustomSwitchButton from '@/components/Custom/CustomSwitchButton';
import { useTheme } from './ThemeContext'; // adjust the path if needed

const DarkModeSwitch: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <CustomSwitchButton
      name="dark-mode"
      labelText="حالت تاریک"
      checked={isDark}
      onCheckedChange={toggleTheme}
      classNames={{
        label: "text-lg font-medium select-none",
      }}
    />
  );
};

export default DarkModeSwitch;