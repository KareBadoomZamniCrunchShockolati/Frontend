// src/components/Customn/LoadingPage.tsx
import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <div
          className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"
          role="status"
          aria-label="در حال بارگذاری"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>

        <p className="text-lg text-gray-text font-medium">...در حال بارگذاری</p>
      </div>
    </div>
  );
};

export default LoadingPage;
