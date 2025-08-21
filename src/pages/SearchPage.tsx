import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import palette from "../styles/theme";
import Header from "../components/Header";
import SearchBar from "../components/search/SearchBar";
import { getJobsByKeyword } from "../apis/HomePage";
import { SlArrowLeft } from "react-icons/sl";

const SearchPage = () => {
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  const handleSearch = async (value: unknown) => {
    const raw =
      typeof value === "string"
        ? value
        : String(
            (value && (value as any).target?.value) ??
              (value as any).value ??
              (value as any).keyword ??
              (value as any).q ??
              ""
          );
    const keyword = raw.trim();
    if (!keyword) return;

    setRecentSearches((prev) => {
      if (prev[0] === keyword) return prev;
      const updated = [keyword, ...prev.filter((s) => s !== keyword)].slice(
        0,
        5
      );
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });

    try {
      const result = await getJobsByKeyword(keyword);
      navigate("/", { state: { keyword, jobList: result } });
    } catch (error) {
      console.error("키워드 검색 실패", error);
    }
  };

  const removeSearch = (index: number) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllSearches = () => {
    if (recentSearches.length > 0) {
      setRecentSearches([]);
      localStorage.removeItem("recentSearches");
    }
  };

  return (
    <div className="pt-[50px] bg-white min-h-screen font-[Pretendard]">
      <Link to={"/"}>
        <Header title="내일" />
      </Link>

      {/* 헤더 하단 선 가리기 + 검색바 */}
      <div className="relative mt-4">
        <div className="absolute left-1/2 -translate-x-1/2 -top-px w-screen h-[1px] bg-white z-[200] pointer-events-none" />
        <div className="h-[7px]" />
        <div className="flex items-center justify-start px-4 gap-[8px] max-w-[393px] mx-auto bg-white">
          <button
            className="flex items-center text-7 !font-bold ml-[18px] text-[#555555] cursor-pointer"
            onClick={() => navigate("/")}
          >
            <SlArrowLeft />
          </button>

          <div className="w-full max-w-[330px] mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
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
              className="flex items-center h-[22px] !px-2 border rounded-[5px]"
              style={{
                borderColor: palette.gray.default,
                color: palette.gray.default,
                fontSize: "13px",
              }}
            >
              <span className="mr-[4px]">{word}</span>
              <button
                onClick={() => removeSearch(idx)}
                className="text-[11px] leading-none"
                style={{ color: palette.gray.default }}
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* 오른쪽 아래 모두 삭제 */}
        <div className="absolute bottom-0 right-0">
          <button
            className="text-[13px] underline"
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
