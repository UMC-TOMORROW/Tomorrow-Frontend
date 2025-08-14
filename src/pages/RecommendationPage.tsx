import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../components/BottomNavbar";
import Header from "../components/Header";
import RecommendationCard from "../components/recommendation/RecommendationCard";
import classNames from "classnames";
import palette from "../styles/theme";
import { getRecommendations } from "../apis/recommendation";
import type { Recommendation } from "../types/recommendation";
import { getMyInfo } from "../apis/employerMyPage";
import recommendLogo from "../assets/logo/recommend_logo.png";

const RecommendationPage = () => {
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [hasNext, setHasNext] = useState(true);
  const [current, setCurrent] = useState(0);
  const [userName, setUserName] = useState<string>("OO");

  const fetchRecommendations = async () => {
    try {
      const data = await getRecommendations(8, cursor);
      setRecommendations((prev) => [...prev, ...data.recommendationList]);
      setHasNext(data.hasNext);

      if (data.recommendationList.length > 0) {
        const last =
          data.recommendationList[data.recommendationList.length - 1];
        setCursor(last.id);
      }
    } catch (err) {
      console.error("추천 목록 불러오기 실패", err);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const info = await getMyInfo();
        if (info.name) setUserName(info.name);

        fetchRecommendations();
      } catch (err) {
        console.error("사용자 정보 조회 실패", err);
      }
    };

    fetchInitialData();
  }, []);

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleNext = () => {
    if (current < recommendations.length - 1) {
      setCurrent(current + 1);
      if (hasNext && current + 1 >= recommendations.length - 2) {
        fetchRecommendations();
      }
    }
  };

  return (
    <div className="min-h-screen px-4 pb-16 pt-[60px]">
      <Header title="내일추천" />

      {recommendations.length > 0 ? (
        <>
          <div className="text-center mt-[15px]">
            <div className="text-[25px] mb-[5px] font-[Pretendard]">✨</div>
            <p
              className="text-[18px] leading-[25px] font-semibold font-[Pretendard]"
              style={{ color: palette.primary.primary }}
            >
              당신의 내일을 응원합니다.
              <br />
              지금 나에게 맞는 일을 찾아보세요.
            </p>
          </div>

          {/* 카드 캐러셀 */}
          <div className="relative h-[430px] w-full flex items-center justify-center overflow-hidden">
            {recommendations.map((job, index) => {
              const position = index - current;

              let translate = "";
              let scale = "scale-100";
              let zIndex = "z-10";
              let opacity = "opacity-100";
              let variant = "default";

              if (position === -1) {
                translate = "translateX(-115%)";
                scale = "scale-95";
                zIndex = "z-0";
                opacity = "opacity-90";
                variant = "dimmed";
              } else if (position === 1) {
                translate = "translateX(110%)";
                scale = "scale-95";
                zIndex = "z-0";
                opacity = "opacity-90";
                variant = "dimmed";
              } else if (position < -1 || position > 1) {
                translate = "translateX(0%)";
                opacity = "opacity-0";
                zIndex = "z-0";
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
                    <RecommendationCard
                      job={job}
                      variant={variant as "default" | "dimmed"}
                      userName={userName}
                    />
                  </div>
                </div>
              );
            })}

            {current > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow z-20"
              >
                ←
              </button>
            )}
            {current < recommendations.length - 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow z-20"
              >
                →
              </button>
            )}
          </div>

          <p
            onClick={() => navigate("/MyPage/WorkPreference")}
            className="text-[13px] text-center mt-[10px] underline cursor-pointer font-[Pretendard]"
            style={{ color: palette.gray.default }}
          >
            내일추천 설정하기
          </p>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center mt-[100px] font-[Pretendard] font-semibold">
          <img
            src={recommendLogo}
            alt="내일추천 퍼즐 이미지"
            className="w-[253.8px] h-auto mb-[40px]"
          />
          <button
            onClick={() => navigate(`/MyPage/WorkPreference`)}
            className="text-[20px] underline mb-[40px] cursor-pointer"
            style={{ color: palette.primary.primary }}
          >
            내일추천 설정하기
          </button>
          <p
            className="text-[18px] leading-[30px]"
            style={{ color: palette.gray.dark }}
          >
            지금 내일추천 설정하고
            <br />
            나에게 잘 맞는 일을 찾아보세요!✨
          </p>
        </div>
      )}

      <BottomNavbar />
    </div>
  );
};

export default RecommendationPage;
