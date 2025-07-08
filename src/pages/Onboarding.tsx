import { useState } from "react";
import CommonButton from "../components/common/CommonButton";
import palette from "../styles/theme";
import { useNavigate } from "react-router-dom";

function Onboarding() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const ProgressDots = ({
    current,
    total,
  }: {
    current: number;
    total: number;
  }) => {
    return (
      <div className="flex justify-center gap-2 mb-4">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-[5px] h-[5px] rounded-full ${
              current === i + 2 ? "bg-[#729A73]" : "bg-[#B8CDB9]"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      {page === 1 && (
        <div className="flex flex-col items-center justify-center px-4 h-screen bg-white gap-7">
          {/* 상단 안내 문구 */}
          <p
            className="text-[24px] text-center mb-10"
            style={{
              fontFamily: "Ulsan Junggu",
              color: palette.primary.primary,
            }}
          >
            00님에게 잘 맞는
            <br />
            일과 활동을 추천해드릴게요.
          </p>
          {/* 이미지 또는 일러스트 자리 */}
          <div className="w-[298px] h-[203px] bg-gray-300 mb-8 rounded-md" />
          {/* 설명 텍스트 */}
          <p
            style={{ fontFamily: "Pretendard" }}
            className="text-center text-black text-[16px] font-bold leading-5 mb-2"
          >
            ‘내일’은 건강 상태와 선호를 반영하여
            <br />
            보다 편안하고 적합한 일자리와 활동을 추천해드립니다.
          </p>
          <p
            style={{ fontFamily: "Pretendart" }}
            className="text-center text-[13px] text-[#000000] leading-4 mb-10"
          >
            본 질문은 의료 진단이나 치료 목적이 아닌,
            <br />
            서비스 추천을 위한 참고 정보로만 사용됩니다.
          </p>
          {/* 버튼 영역 */}
          <div className="w-full max-w-[320px] flex flex-col gap-3">
            <CommonButton label="계속하기" onClick={() => setPage(2)} />
            <CommonButton
              label="건너뛰기"
              className="!bg-white !text-[#729A73] !border-[#729A73]"
              onClick={() => console.log("건너뛰기 클릭")}
            />
          </div>
        </div>
      )}

      {page === 2 && (
        <div className="flex flex-col items-center justify-center px-4 h-screen bg-white gap-20">
          <ProgressDots current={page} total={5} />
          {/* 상단 안내 문구 */}
          <p
            className="text-[30px] text-center mb-4"
            style={{
              fontFamily: "Ulsan Junggu",
              color: palette.primary.primary,
            }}
          >
            "장시간 앉아 있는 활동은
            <br />
            괜찮으신가요?"
          </p>
          {/* 이미지 또는 일러스트 자리 */}
          <div className="w-[348px] h-[259px] bg-gray-300 mb-8 rounded-md" />
          {/* 버튼 영역 */}
          <div className="w-full max-w-[320px] flex flex-col gap-3">
            <CommonButton label="예" onClick={() => setPage(3)} />
            <CommonButton
              label="아니오"
              className="!bg-white !text-[#729A73] !border-[#729A73]"
              onClick={() => setPage(3)}
            />
          </div>
        </div>
      )}

      {page === 3 && (
        <div className="flex flex-col items-center justify-center px-4 h-screen bg-white gap-20">
          <ProgressDots current={page} total={5} />
          {/* 상단 안내 문구 */}
          <p
            className="text-[30px] text-center mb-4"
            style={{
              fontFamily: "Ulsan Junggu",
              color: palette.primary.primary,
            }}
          >
            "장시간 서서 하는 활동은
            <br />
            불편함이 없으신가요?"
          </p>
          {/* 이미지 또는 일러스트 자리 */}
          <div className="w-[348px] h-[259px] bg-gray-300 mb-8 rounded-md" />
          {/* 버튼 영역 */}
          <div className="w-full max-w-[320px] flex flex-col gap-3">
            <CommonButton label="예" onClick={() => setPage(4)} />
            <CommonButton
              label="아니오"
              className="!bg-white !text-[#729A73] !border-[#729A73]"
              onClick={() => setPage(4)}
            />
          </div>
        </div>
      )}

      {page === 4 && (
        <div className="flex flex-col items-center justify-center px-4 h-screen bg-white gap-20">
          <ProgressDots current={page} total={5} />
          {/* 상단 안내 문구 */}
          <p
            className="text-[30px] text-center mb-4"
            style={{
              fontFamily: "Ulsan Junggu",
              color: palette.primary.primary,
            }}
          >
            "물건을 자주 옮기는 활동에
            <br />
            어려움이 없으신가요?"
          </p>
          {/* 이미지 또는 일러스트 자리 */}
          <div className="w-[348px] h-[259px] bg-gray-300 mb-8 rounded-md" />
          {/* 버튼 영역 */}
          <div className="w-full max-w-[320px] flex flex-col gap-3">
            <CommonButton label="예" onClick={() => setPage(5)} />
            <CommonButton
              label="아니오"
              className="!bg-white !text-[#729A73] !border-[#729A73]"
              onClick={() => setPage(5)}
            />
          </div>
        </div>
      )}

      {page === 5 && (
        <div className="flex flex-col items-center justify-center px-4 h-screen bg-white gap-20">
          <ProgressDots current={page} total={5} />
          {/* 상단 안내 문구 */}
          <p
            className="text-[30px] text-center mb-4"
            style={{
              fontFamily: "Ulsan Junggu",
              color: palette.primary.primary,
            }}
          >
            "가볍게 몸을 움직이며
            <br />
            일하는 것이 잘 맞으시나요?"
          </p>
          {/* 이미지 또는 일러스트 자리 */}
          <div className="w-[348px] h-[259px] bg-gray-300 mb-8 rounded-md" />
          {/* 버튼 영역 */}
          <div className="w-full max-w-[320px] flex flex-col gap-3">
            <CommonButton label="예" onClick={() => setPage(6)} />
            <CommonButton
              label="아니오"
              className="!bg-white !text-[#729A73] !border-[#729A73]"
              onClick={() => setPage(6)}
            />
          </div>
        </div>
      )}

      {page === 6 && (
        <div className="flex flex-col items-center justify-center px-4 h-screen bg-white gap-20">
          <ProgressDots current={page} total={5} />
          {/* 상단 안내 문구 */}
          <p
            className="text-[30px] text-center mb-4"
            style={{
              fontFamily: "Ulsan Junggu",
              color: palette.primary.primary,
            }}
          >
            "사람들과 직접 대화하거나
            <br />
            응대하는 일을 선호하시나요?"
          </p>
          {/* 이미지 또는 일러스트 자리 */}
          <div className="w-[348px] h-[259px] bg-gray-300 mb-8 rounded-md" />
          {/* 버튼 영역 */}
          <div className="w-full max-w-[320px] flex flex-col gap-3">
            <CommonButton label="예" onClick={() => setPage(7)} />
            <CommonButton
              label="아니오"
              className="!bg-white !text-[#729A73] !border-[#729A73]"
              onClick={() => setPage(7)}
            />
          </div>
        </div>
      )}

      {page === 7 && (
        <div className="flex flex-col items-center justify-center px-4 h-screen bg-white gap-15">
          <img
            src="/src/assets/logo/logo.png"
            className="w-[233px] h-[153px]"
          ></img>
          {/* 이미지 또는 일러스트 자리 */}
          <div className="w-[348px] h-[259px] bg-gray-300 mb-8 rounded-md" />
          <p
            className="text-[25px] font-bold text-center"
            style={{
              fontFamily: "Pretendard",
              color: palette.primary.primary,
            }}
          >
            당신의 더 나은
            <br />
            '내일'을 위해 '내 일' 찾기
          </p>
          {/* 버튼 영역 */}
          <div className="w-full max-w-[320px] flex flex-col gap-3">
            <CommonButton label="시작하기" onClick={() => navigate("/")} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Onboarding;
