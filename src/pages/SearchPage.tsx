import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import palette from "../styles/theme";
import Header from "../components/Header";
import SearchBar from "../components/search/SearchBar";

const SearchPage = () => {
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const input = document.querySelector("input[type='text']");
    if (!input) return;

    inputRef.current = input as HTMLInputElement;

    let isComposing = false;

    const handleCompositionStart = () => {
      isComposing = true;
    };

    const handleCompositionEnd = () => {
      isComposing = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (isComposing) return;
        const value = inputRef.current?.value.trim();
        if (!value) return;

        setRecentSearches((prev) => {
          if (prev[0] === value) return prev;
          const updated = [value, ...prev.filter((s) => s !== value)];
          return updated.slice(0, 5);
        });

        inputRef.current!.value = "";
      }
    };

    input.addEventListener("compositionstart", handleCompositionStart);
    input.addEventListener("compositionend", handleCompositionEnd);
    input.addEventListener("keydown", handleKeyDown as EventListener);

    return () => {
      input.removeEventListener("compositionstart", handleCompositionStart);
      input.removeEventListener("compositionend", handleCompositionEnd);
      input.removeEventListener("keydown", handleKeyDown as EventListener);
    };
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
          onClick={() => navigate("/")}
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
