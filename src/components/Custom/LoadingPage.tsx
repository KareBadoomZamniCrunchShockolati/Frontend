// src/components/Customn/LoadingPage.tsx
import React from "react";
import { Spinner } from "@/components/ui/spinner";

const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <Spinner
          className="size-12 text-primary"
          role="status"
          aria-label="در حال بارگذاری"
        />

        <p className="text-lg text-gray-text font-medium">...در حال بارگذاری</p>
      </div>
    </div>
  );
};

export default LoadingPage;
