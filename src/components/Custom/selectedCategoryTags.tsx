// components/Custom/SelectedCategoryTag.tsx
import React from "react";
import type { SelectedCategoryTagProps } from "@/types/challengeCreateTypes";


const AllSelectedCategoryTag: React.FC<SelectedCategoryTagProps> = ({
  category,
  onRemove,
}) => {
  return (
    <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
      {category}
      <button
        type="button"
        onClick={() => onRemove(category)}
        className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
        aria-label={`حذف ${category}`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </span>
  );
};

export default AllSelectedCategoryTag;