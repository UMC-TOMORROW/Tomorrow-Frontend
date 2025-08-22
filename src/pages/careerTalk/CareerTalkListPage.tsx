import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../../components/BottomNavbar";
import CareerTalkCard from "../../components/careerTalk/CareerTalkCard";
import Header from "../../components/Header";
import writeIcon from "../../assets/write.png";
import palette from "../../styles/theme";
import SearchBar from "../../components/search/SearchBar";
import {
  getCareerTalks,
  searchCareerTalksByTitle,
  searchCareerTalksByCategory,
} from "../../apis/careerTalk";
import type { CareerTalk } from "../../types/careerTalk";
import CareerTalkCardSkeleton from "../../components/careerTalk/CareerTalkCardSkeleton";

const BATCH_SIZE = 8;
type SearchMode = "none" | "title" | "category";

function CareerTalkListPage() {
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [talks, setTalks] = useState<CareerTalk[]>([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [searchMode, setSearchMode] = useState<SearchMode>("none");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const debounceRef = useRef<number | null>(null);
  const searchSeqRef = useRef(0);

  const resetListState = () => {
    setTalks([]);
    setCursor(undefined);
    setHasMore(true);
  };

  const handleSearch = useCallback(
    async (keyword: string) => {
      const trimmed = keyword.trim();

      resetListState();
      // 입력 비었으면 전체 리스트로 복귀
      if (!trimmed) {
        setSearchMode("none");
        setSearchKeyword("");
        setLoading(true);
        try {
          const res = await getCareerTalks(BATCH_SIZE);
          const list = res.result.careertalkList ?? [];
          setTalks(list);
          setHasMore(res.result.hasNext);
          if (list.length) setCursor(list[list.length - 1].id);
        } catch (err) {
          console.error("초기 목록 로딩 실패", err);
          setHasMore(false);
        } finally {
          setLoading(false);
        }
        return;
      }

      // 키워드 검색 시작
      setLoading(true);
      setSearchKeyword(trimmed);

      try {
        // 1) 카테고리 우선
        const byCategory = await searchCareerTalksByCategory(trimmed, BATCH_SIZE);
        const catList = byCategory.result.careertalkList ?? [];
        if (catList.length > 0) {
          setSearchMode("category");
          setTalks(catList);
          setHasMore(byCategory.result.hasNext);
          setCursor(catList[catList.length - 1].id);
          return;
        }

        // 2) 없으면 제목 검색
        const byTitle = await searchCareerTalksByTitle(trimmed, BATCH_SIZE);
        const titleList = byTitle.result.careertalkList ?? [];
        setSearchMode("title");
        setTalks(titleList);
        setHasMore(byTitle.result.hasNext);
        if (titleList.length) setCursor(titleList[titleList.length - 1].id);
      } catch (err) {
        console.error("검색 실패", err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleInputCapture = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const target = e.target as EventTarget | null;
      if (!(target instanceof HTMLInputElement)) return; // 버튼/이미지 클릭 등은 무시

      const value = target.value ?? "";

      // 디바운스
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      const seq = ++searchSeqRef.current;
      debounceRef.current = window.setTimeout(() => {
        // 최신 입력만 처리(혹시 추후 비동기 확장되면 사용)
        if (seq === searchSeqRef.current) {
          handleSearch(value);
        }
      }, 300);
    },
    [handleSearch]
  );

  const handleMoveToWrite = () => {
    navigate("/career-talk/write");
  };

  const fetchCareerTalks = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      let list: CareerTalk[] = [];
      let hasNext = true;

      if (searchMode === "category") {
        const res = await searchCareerTalksByCategory(
          searchKeyword,
          BATCH_SIZE,
          cursor
        );
        list = res.result.careertalkList ?? [];
        hasNext = res.result.hasNext;
      } else if (searchMode === "title") {
        const res = await searchCareerTalksByTitle(
          searchKeyword,
          BATCH_SIZE,
          cursor
        );
        list = res.result.careertalkList ?? [];
        hasNext = res.result.hasNext;
      } else {
        const res = await getCareerTalks(BATCH_SIZE, cursor);
        list = res.result.careertalkList ?? [];
        hasNext = res.result.hasNext;
      }

      if (!Array.isArray(list)) {
        console.error("응답이 배열이 아님:", list);
        setLoading(false);
        return;
      }

      setTalks((prev) => {
        const all = [...prev, ...list];
        // 중복 제거(id 기준)
        return Array.from(new Map(all.map((it) => [it.id, it])).values());
      });

      if (list.length > 0) {
        setCursor(Number(list[list.length - 1].id));
      }
      setHasMore(hasNext);
    } catch (error) {
      console.error("커리어톡 불러오기 실패", error);
    } finally {
      setLoading(false);
    }
  };

  // 무한 스크롤 옵저버
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchCareerTalks();
        }
      },
      { threshold: 1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [cursor, hasMore]);

  // 최초 로딩
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getCareerTalks(BATCH_SIZE);
        const list = res.result.careertalkList ?? [];
        setTalks(list);
        setHasMore(res.result.hasNext);
        if (list.length) setCursor(list[list.length - 1].id);
      } catch (e) {
        console.error("초기 로딩 실패", e);
      } finally {
        setLoading(false);
      }
    })();

    // 언마운트 시 디바운스 타이머 정리
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen relative font-[Pretendard]"
      style={{ backgroundColor: palette.gray.light }}
    >
      <Header title="커리어톡" />

      <main
        className="flex-1 px-4 pt-5 pb-32 mt-[60px]"
        style={{ backgroundColor: palette.gray.light }}
      >
        <div className="mb-[35px] flex justify-center">
          <div onInputCapture={handleInputCapture} className="w-full flex justify-center">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div className="flex flex-col gap-[20px] items-center w-[340px] mx-auto">
          {talks.map((item) => (
            <CareerTalkCard
              key={item.id}
              id={item.id}
              category={item.category}
              title={item.title}
              content={item.content ?? ""}
            />
          ))}

          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <CareerTalkCardSkeleton key={`skeleton-${index}`} />
            ))}
        </div>

        {hasMore && <div ref={observerRef} className="h-6" />}
        <div className="h-[120px]" />
      </main>

      <button
        onClick={handleMoveToWrite}
        className="fixed bottom-[90px] right-4 w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-md z-50 cursor-pointer"
        style={{ backgroundColor: palette.primary.primary }}
      >
        <img src={writeIcon} alt="작성" className="w-[25px] h-[25px]" />
      </button>

      <BottomNavbar />
    </div>
  );
}

export default CareerTalkListPage;
