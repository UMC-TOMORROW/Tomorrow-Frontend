import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../../components/BottomNavbar";
import CareerTalkCard from "../../components/careerTalk/CareerTalkCard";
import Header from "../../components/Header";
import careerTalkData from "../../data/careerTalkData";
import writeIcon from "../../assets/write.png";
import palette from "../../styles/theme";
import SearchBar from "../../components/search/SearchBar";

const BATCH_SIZE = 5;

function CareerTalkListPage() {
  const navigate = useNavigate();
  const [visibleData, setVisibleData] = useState(
    careerTalkData.slice(0, BATCH_SIZE)
  );
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 플로팅 버튼 클릭 시 이동
  const handleMoveToWrite = () => {
    navigate("/career-talk/write");
  };

  // 무한 스크롤 로딩 처리
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const next = careerTalkData.slice(
            visibleData.length,
            visibleData.length + BATCH_SIZE
          );
          setVisibleData((prev) => [...prev, ...next]);
          if (visibleData.length + BATCH_SIZE >= careerTalkData.length) {
            setHasMore(false);
          }
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [visibleData, hasMore]);

  return (
    <div
      className="flex flex-col min-h-screen relative font-[Pretendard]"
      style={{ backgroundColor: palette.gray.light }}
    >
      {/* 상단 헤더 */}
      <Header title="커리어톡" />

      {/* 본문 */}
      <main
        className="flex-1 px-4 pt-5 pb-32 mt-[60px]"
        style={{ backgroundColor: palette.gray.light }}
      >
        {/* 검색창 (임시)*/}
        <div className="mb-[10px] flex justify-center">
          <SearchBar />
        </div>

        <div className="h-[1px] bg-[#555555D9] mb-[25px]" />

        {/* 카드 리스트 */}
        <div className="flex flex-col gap-[20px] items-center max-w-[340px] mx-auto">
          {visibleData.map((item, idx) => (
            <CareerTalkCard
              key={idx}
              id={item.id}
              category={item.category}
              title={item.title}
              content={item.content}
            />
          ))}
        </div>

        {hasMore && <div ref={observerRef} className="h-6" />}
      </main>

      {/* 플로팅 버튼 */}
      <button
        onClick={handleMoveToWrite}
        className="fixed bottom-[90px] right-4 w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-md z-50 cursor-pointer"
        style={{ backgroundColor: palette.primary.primary }}
      >
        <img src={writeIcon} alt="작성" className="w-[25px] h-[25px]" />
      </button>

      {/* 하단 네비게이션 */}
      <BottomNavbar />
    </div>
  );
}

export default CareerTalkListPage;
