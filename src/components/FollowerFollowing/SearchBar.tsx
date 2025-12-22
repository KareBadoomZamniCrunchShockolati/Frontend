import React from "react";
import CustomInput from "@/components/Custom/CustomInput";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  classname?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchTermChange,
  onBlur,
  // classname,
}) => {
  return (
    <div className="flex justify-center mb-3 w-full">
      <CustomInput
        className="w-full h-8 sm:w-100 sm:h-8 md:w-110 md:h-9 rounded-[12.5px]"
        name="searchTerm"
        label=""
        icon={<Search />}
        value={searchTerm}
        onChange={onSearchTermChange}
        onBlur={onBlur}
        width="w-full"
      />
    </div>
  );
};

export default SearchBar;
