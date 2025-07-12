import { useState } from "react";
import BottomNavbar from "../components/BottomNavbar";
import Header from "../components/Header";
import RecommendationCard from "../components/recommendation/RecommendationCard";
import recommendationData from "../data/recommendationData";
import classNames from "classnames";
import palette from "../styles/theme";

const RecommendationPage = () => {
  const [current, setCurrent] = useState(0);
  const total = recommendationData.length;

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleNext = () => {
    if (current < total - 1) setCurrent(current + 1);
  };

  return (
    <div className="min-h-screen px-4 pb-16 pt-[60px]">
      <Header title="내일추천" />

      {/* 추천 설정 O */}
      {recommendationData.length > 0 ? (
        <>
          <p
            className='text-center text-[20px] leading-[20px] mb-[10px] mt-[40px] font-["Ulsan_Junggu"]'
            style={{ color: palette.primary.primary }}
          >
            당신의 내일을 응원합니다.
            <br />
            <br />
            지금 나에게 맞는 일을 찾아보세요.
          </p>

          {/* 카드 캐러셀 영역 */}
          <div className="relative h-[400px] w-full flex items-center justify-center overflow-hidden">
            {recommendationData.map((job, index) => {
              const position = index - current;

              let translate = "";
              let scale = "scale-100";
              let zIndex = "z-10";
              let opacity = "opacity-100";

              if (position === -1) {
                translate = "translateX(-115%)";
                scale = "scale-95";
                zIndex = "z-0";
                opacity = "opacity-90";
              } else if (position === 1) {
                translate = "translateX(110%)";
                scale = "scale-95";
                zIndex = "z-0";
                opacity = "opacity-90";
              } else if (position < -1 || position > 1) {
                translate = "translateX(0%)";
                opacity = "opacity-0";
                zIndex = "z-0";
              } else {
                translate = "translateX(0%)";
              }

              return (
                <div
                  key={job.id}
                  className={classNames(
                    "absolute transition-all duration-500 ease-in-out",
                    scale,
                    zIndex,
                    opacity
                  )}
                  style={{
                    left: "50%",
                    transform: `translateX(-50%) ${translate}`,
                  }}
                >
                  <div className="w-[280px]">
                    <RecommendationCard job={job} />
                  </div>
                </div>
              );
            })}

            {/* ← 버튼 */}
            {current > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow z-20"
              >
                ←
              </button>
            )}

            {/* → 버튼 */}
            {current < total - 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow z-20"
              >
                →
              </button>
            )}
          </div>

          {/* 설정 링크 */}
          <p
            className="text-[13px] text-center mt-[10px] underline cursor-pointer font-[Pretendard]"
            style={{ color: palette.gray.default }}
          >
            내일추천 설정하기
          </p>
        </>
      ) : (
        // 추천 설정 X
        <div className="flex flex-col items-center justify-center text-center mt-[160px] font-[Pretendard] font-semibold">
          <p
            className="text-[20px] leading-[26px] mb-[36px]"
            style={{ color: palette.gray.dark }}
          >
            당신의 내일을 응원합니다.
            <br />
            지금 나에게 맞는 일을 찾아보세요.
          </p>

          <button
            className="text-[20px] underline cursor-pointer"
            style={{ color: palette.primary.primary }}
          >
            내일추천 설정하기
          </button>
        </div>
      )}

      <BottomNavbar />
    </div>
  );
};

export default RecommendationPage;
