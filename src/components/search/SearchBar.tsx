import { useState } from "react";
import searchIcon from "../../assets/search.png";

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [keyword, setKeyword] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(keyword.trim());
    }
  };

  const handleSearchClick = () => {
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  return (
    <div className="flex items-center w-[306px] border-[1.5px] border-[#729A73] rounded-[10px] px-[10px] py-[7px] gap-[7px]">
      <button type="button" onClick={handleSearchClick}>
        <img src={searchIcon} alt="search" className="w-4 h-4 mr-2" />
      </button>
      <input
        type="text"
        placeholder="궁금한 내용을 찾아보세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
      />
    </div>
  );
};

export default SearchBar;
