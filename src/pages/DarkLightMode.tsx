// src/pages/DarkModePage.tsx

import React from 'react';
import CustomSwitchButton from '@/components/Custom/CustomSwitchButton';
import { useTheme } from './ThemeContext';

const DarkModePage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-500">
      <CustomSwitchButton
        name="dark-mode"
        labelText="حالت تاریک"
        checked={isDark}
        onCheckedChange={toggleTheme}
        classNames={{
          label: "text-lg font-medium select-none",
        }}
      />
    </div>
  );
};

export default DarkModePage;