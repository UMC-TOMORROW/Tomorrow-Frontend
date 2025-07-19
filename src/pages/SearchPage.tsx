import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import SearchBar from "../components/common/SearchBar";
import { useEffect, useRef, useState } from "react";
import palette from "../styles/theme";

const SearchPage = () => {
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const input = document.querySelector("input[type='text']");
    if (input) {
      inputRef.current = input as HTMLInputElement;

      const handleKeyPress = (e: Event) => {
        const event = e as KeyboardEvent;
        if (event.key === "Enter" && inputRef.current?.value.trim()) {
          const newSearch = inputRef.current.value.trim();
          setRecentSearches((prev) => {
            const updated = [newSearch, ...prev.filter((s) => s !== newSearch)];
            return updated.slice(0, 5);
          });
          inputRef.current.value = "";
        }
      };

      input.addEventListener("keydown", handleKeyPress as EventListener);
      return () =>
        input.removeEventListener("keydown", handleKeyPress as EventListener);
    }
  }, []);

  const removeSearch = (index: number) => {
    setRecentSearches((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllSearches = () => {
    if (recentSearches.length > 0) {
      setRecentSearches([]);
    }
  };

  return (
    <div className="pt-[50px] bg-white min-h-screen font-[Pretendard]">
      <Header title="내일" />
      <div className="h-[7px]" />

      {/* 검색바 + 뒤로가기 */}
      <div className="flex items-center justify-start px-4 gap-[8px] mt-4 max-w-[393px] mx-auto">
        <button
          className="flex items-center text-[25px] ml-[18px] text-[#555555] cursor-pointer"
          onClick={() => navigate(`/`)}
        >
          {"<"}
        </button>
        <div className="w-full max-w-[330px] mx-auto">
          <SearchBar />
        </div>
      </div>

      <div className="h-[27px]" />

      {/* 최근 검색어 박스 */}
      <div className="w-[331px] mx-auto min-h-[85px] px-2 py-3 relative">
        <p className="text-[15px] mb-[15px]">최근 검색어</p>

        <div className="flex flex-wrap gap-2">
          {recentSearches.map((word, idx) => (
            <div
              key={idx}
              className="flex items-center h-[22px] !px-2 border rounded-md"
              style={{
                borderColor: palette.gray.default,
                color: palette.gray.default,
                fontSize: "13px",
              }}
            >
              <span className="mr-[4px]">{word}</span>
              <button
                onClick={() => removeSearch(idx)}
                className="text-[13px] leading-none"
                style={{ color: palette.gray.default }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* 오른쪽 아래 모두 삭제 */}
        <div className="absolute bottom-0 right-0">
          <button
            className="text-[13px]"
            style={{ color: palette.gray.default }}
            onClick={clearAllSearches}
          >
            모두 삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
