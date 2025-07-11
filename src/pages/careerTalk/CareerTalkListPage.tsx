import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../../components/BottomNavbar";
import CareerTalkCard from "../../components/careerTalk/CareerTalkCard";
import Header from "../../components/Header";
import careerTalkData from "../../data/careerTalkData";
import writeIcon from "../../assets/write.png";
import palette from "../../styles/theme";

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
          <div
            className="flex items-center gap-[7px] w-full max-w-[306px] h-[34px] px-[10px] py-[7px] rounded-[10px] shadow-sm bg-white"
            style={{ border: `1.5px solid ${palette.primary.primary}` }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke={palette.primary.primary}
              className="w-[15px] h-[16px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              placeholder="궁금한 내용을 찾아보세요"
              className="flex-1 text-[15px] text-[#555] placeholder-[#555555D9] bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="h-[1px] bg-[#555555D9] mb-[25px]" />

        {/* 카드 리스트 */}
        <div className="flex flex-col gap-[20px] items-center max-w-[340px] mx-auto">
          {visibleData.map((item, idx) => (
            <CareerTalkCard
              key={idx}
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
