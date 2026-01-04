// src/context/ThemeContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // اگر قبلاً کاربر انتخاب کرده بود، همون رو بخون
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';

      // اگر ذخیره نشده بود، تنظیمات سیستم رو چک کن
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // هر وقت isDark تغییر کرد، کلاس dark رو به <html> اضافه یا حذف کن
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// هوک ساده برای استفاده در کامپوننت‌ها
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme باید داخل ThemeProvider استفاده بشه');
  }
  return context;
};