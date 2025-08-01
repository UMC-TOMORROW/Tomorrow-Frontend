import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../../components/BottomNavbar";
import CareerTalkCard from "../../components/careerTalk/CareerTalkCard";
import Header from "../../components/Header";
import writeIcon from "../../assets/write.png";
import palette from "../../styles/theme";
import SearchBar from "../../components/search/SearchBar";
import { getCareerTalks, searchCareerTalksByTitle } from "../../apis/careerTalk";
import type { CareerTalk } from "../../types/careerTalk";
import CareerTalkCardSkeleton from "../../components/careerTalk/CareerTalkCardSkeleton";

const BATCH_SIZE = 8;

function CareerTalkListPage() {
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [talks, setTalks] = useState<CareerTalk[]>([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string | null>(null);

const handleSearch = async (keyword: string) => {
  const trimmedKeyword = keyword.trim();

  if (!trimmedKeyword) {
    // 검색 초기화
    setSearchKeyword(null);
    setCursor(undefined);
    setTalks([]);
    setHasMore(true);
    fetchCareerTalks(); 
    return;
  }

  setSearchKeyword(trimmedKeyword);
  setLoading(true);
  setCursor(undefined);
  setTalks([]);

  try {
    const res = await searchCareerTalksByTitle(trimmedKeyword, BATCH_SIZE);
    setTalks(res.result.careertalkList);
    setHasMore(res.result.hasNext);
    if (res.result.careertalkList.length > 0) {
      const lastId = res.result.careertalkList[res.result.careertalkList.length - 1].id;
      setCursor(lastId);
    }
  } catch (err) {
    console.error("검색 실패", err);
  } finally {
    setLoading(false);
  }
};


  const handleMoveToWrite = () => {
    navigate("/career-talk/write");
  };

  const fetchCareerTalks = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const res = await getCareerTalks(BATCH_SIZE, cursor);
      const newTalks = res.result.careertalkList;

      if (!Array.isArray(newTalks)) {
        console.error("응답이 배열이 아님:", res);
        return;
      }

      setTalks((prev) => {
        const allTalks = [...prev, ...newTalks];
        const uniqueTalks = Array.from(
          new Map(allTalks.map((item) => [item.id, item])).values()
        );
        return uniqueTalks;
      });

      if (newTalks.length > 0) {
        const lastId = Number(newTalks[newTalks.length - 1].id);
        setCursor(lastId);
      }

      setHasMore(res.result.hasNext);
    } catch (error) {
      console.error("커리어톡 불러오기 실패", error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchCareerTalks();
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
        <div className="mb-[10px] flex justify-center">
          <SearchBar onSearch={handleSearch} />

        </div>

        <div className="h-[1px] bg-[#555555D9] mb-[25px]" />

        <div className="flex flex-col gap-[20px] items-center max-w-[340px] mx-auto">
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
