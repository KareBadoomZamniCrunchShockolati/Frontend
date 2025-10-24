import React from 'react';
import CustomInput from '@/components/Custom/CustomInput';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchTermChange, onBlur }) => {
  return (
    <div className="flex justify-center mb-3">
      <CustomInput
        className="w-88 h-8 rounded-[12.5px]"
        name="searchTerm"
        label=""
        value={searchTerm}
        onChange={onSearchTermChange}
        onBlur={onBlur}
      />
    </div>
  );
};

export default SearchBar;
