import { useState } from "react";
import CommonButton from "../components/common/CommonButton";
import palette from "../styles/theme";
import { useNavigate } from "react-router-dom";
import OnboardingSkipModal from "../components/Onboarding/OnboardingSkipModal";

function Onboarding() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const ProgressDots = ({
    current,
    total,
  }: {
    current: number;
    total: number;
  }) => (
    <div className="flex justify-center gap-[3px] mb-4">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-[5px] h-[5px] rounded-full ${
            current === i + 3 ? "bg-[#729A73]" : "bg-[#B8CDB9]"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div>
      {page === 1 && (
        <div className="flex flex-col items-center justify-center px-4 h-screen bg-white">
          <h1
            className="text-[30px] text-center !font-bold leading-[51.776px] tracking-[0.04em] mb-10 !mt-[92px]"
            style={{
              fontFamily: "Hakgyoansim Mulgyeol",
              color: palette.primary.primary,
            }}
          >
            어떤 목적으로
            <br />
            방문하셨나요?
          </h1>

          <div
            className="flex flex-col items-center gap-[20px] mt-[265px] font-bold"
            style={{ fontFamily: "Pretendard" }}
          >
            {[
              {
                label: "👥 직원을 찾고 있어요",
                onClick: () => navigate("../MyPage/EmployerMyPage"),
              },
              {
                label: "💼 일을 찾고 있어요",
                onClick: () => setPage(2),
              },
            ].map(({ label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="w-[316px] h-[56px] rounded-[10px] text-[20px] flex items-center justify-center border font-bold transition duration-200"
                style={{
                  borderColor: palette.primary.primary,
                  color: palette.primary.primary,
                  backgroundColor: "white",
                  lineHeight: "32.36px",
                  letterSpacing: "4%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = palette.primary.primary;
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {page === 2 && (
        <div className="flex flex-col items-center justify-center px-4 h-screen bg-white">
          <h1
            className="text-[30px] text-center !font-bold leading-[51.776px] tracking-[0.04em] mt-[52px]"
            style={{
              fontFamily: "Hakgyoansim Mulgyeol",
              color: palette.primary.primary,
            }}
          >
            잘 맞는 일자리를
            <br />
            추천해드릴게요.
          </h1>
          <img
            src="/src/assets/onboarding/Checklist-pana.png"
            className="w-[295px] h-[258px] mt-[16px]"
          />
          <div className="flex flex-col gap-[12px]">
            <p
              className="text-center text-black text-[16px] font-extrabold leading-[30px] tracking-[-0.03em] mt-3 mb-2"
              style={{ fontFamily: "Pretendard" }}
            >
              ‘내일’은 건강 상태와 선호를 반영하여
              <br />
              보다 편안하고 적합한 일자리와 활동을 추천해드립니다.
            </p>
            <p
              className="text-center text-black text-[14px] font-normal leading-[20px] tracking-[-0.03em] mb-10 mt-3"
              style={{ fontFamily: "Pretendard" }}
            >
              본 질문은 의료 진단이나 치료 목적이 아닌,
              <br />
              서비스 추천을 위한 참고 정보로만 사용됩니다.
            </p>
          </div>
          <div
            className="w-full max-w-[320px] font-bold text-[18px] flex flex-col gap-[15px] !mt-10"
            style={{ fontFamily: "Pretendard" }}
          >
            {[
              { label: "계속하기", onClick: () => setPage(3) },
              {
                label: "건너뛰기",
                onClick: () => setShowSkipModal(true),
              },
            ].map(({ label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="border leading-[32.36px] tracking-[4%] bg-white w-[316px] h-[48px] rounded-[10px]"
                style={{
                  borderColor: palette.primary.primary,
                  color: palette.primary.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = palette.primary.primary;
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {page === 3 && (
        <div className="flex flex-col items-center justify-center px-4 h-screen bg-white gap-10">
          <ProgressDots current={page} total={5} />
          {/* 상단 안내 문구 */}
          <h1
            className="text-[30px] text-center !font-bold leading-[51.776px] tracking-[0.04em] mb-10"
            style={{
              fontFamily: "Hakgyoansim Mulgyeol",
              color: palette.primary.primary,
            }}
          >
            "장시간 앉아 있는 일
            <br />
            괜찮으신가요?"
          </h1>
          {/* 이미지 */}
          <img
            src="/src/assets/onboarding/Typing-pana.png"
            className="w-[340px] h-[300px]"
          />
          {/* 버튼 영역 */}
          <div
            className="w-full font-bold max-w-[320px] items-center flex flex-col gap-3"
            style={{ fontFamily: "Pretendard" }}
          >
            {[
              { label: "예", onClick: () => setPage(4) },
              {
                label: "아니오",
                onClick: () => setPage(4),
              },
            ].map(({ label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="border leading-[32.36px] tracking-[4%] bg-white w-[315px] h-[52px] rounded-[10px]"
                style={{
                  borderColor: palette.primary.primary,
                  color: palette.primary.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = palette.primary.primary;
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {page === 4 && (
        <div className="flex flex-col items-center justify-center px-4 h-screen bg-white gap-10">
          <ProgressDots current={page} total={5} />
          {/* 상단 안내 문구 */}
          <h1
            className="text-[30px] text-center !font-bold leading-[51.776px] tracking-[0.04em] mb-10"
            style={{
              fontFamily: "Hakgyoansim Mulgyeol",
              color: palette.primary.primary,
            }}
          >
            "장시간 서있는 일
            <br />
            괜찮으신가요?"
          </h1>
          {/* 이미지 */}
          <img
            src="/src/assets/onboarding/Bricklayer-pana.png"
            className="w-[340px] h-[300px]"
          />
          {/* 버튼 영역 */}
          <div
            className="w-full font-bold max-w-[320px] items-center flex flex-col gap-3"
            style={{ fontFamily: "Pretendard" }}
          >
            {[
              { label: "예", onClick: () => setPage(5) },
              {
                label: "아니오",
                onClick: () => setPage(5),
              },
            ].map(({ label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="border leading-[32.36px] tracking-[4%] bg-white  w-[315px] h-[52px] rounded-[10px]"
                style={{
                  borderColor: palette.primary.primary,
                  color: palette.primary.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = palette.primary.primary;
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {page === 5 && (
        <div className="flex flex-col items-center justify-center px-4 h-screen bg-white gap-10">
          <ProgressDots current={page} total={5} />
          {/* 상단 안내 문구 */}
          <h1
            className="text-[30px] text-center !font-bold leading-[51.776px] tracking-[0.04em] mb-10"
            style={{
              fontFamily: "Hakgyoansim Mulgyeol",
              color: palette.primary.primary,
            }}
          >
            "물건을 옮기는 일
            <br />
            괜찮으신가요?"
          </h1>
          {/* 이미지 */}
          <img
            src="/src/assets/onboarding/Heavybox-pana.png"
            className="w-[340px] h-[300px]"
          />{" "}
          {/* 버튼 영역 */}
          <div
            className="w-full font-bold max-w-[320px] items-center flex flex-col gap-3"
            style={{ fontFamily: "Pretendard" }}
          >
            {[
              { label: "예", onClick: () => setPage(6) },
              {
                label: "아니오",
                onClick: () => setPage(6),
              },
            ].map(({ label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="border leading-[32.36px] tracking-[4%] bg-white  w-[315px] h-[52px] rounded-[10px]"
                style={{
                  borderColor: palette.primary.primary,
                  color: palette.primary.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = palette.primary.primary;
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {page === 6 && (
        <div className="flex flex-col items-center justify-center px-4 h-screen bg-white gap-10">
          <ProgressDots current={page} total={5} />
          {/* 상단 안내 문구 */}
          <h1
            className="text-[30px] text-center !font-bold leading-[51.776px] tracking-[0.04em] mb-10"
            style={{
              fontFamily: "Hakgyoansim Mulgyeol",
              color: palette.primary.primary,
            }}
          >
            "가볍게 움직이는 일
            <br />
            괜찮으신가요?"
          </h1>
          {/* 이미지 */}
          <img
            src="/src/assets/onboarding/Gardening-pana.png"
            className="w-[340px] h-[300px]"
          />{" "}
          {/* 버튼 영역 */}
          <div
            className="w-full font-bold max-w-[320px] items-center flex flex-col gap-3"
            style={{ fontFamily: "Pretendard" }}
          >
            {[
              { label: "예", onClick: () => setPage(7) },
              {
                label: "아니오",
                onClick: () => setPage(7),
              },
            ].map(({ label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="border leading-[32.36px] tracking-[4%] bg-white  w-[315px] h-[52px] rounded-[10px]"
                style={{
                  borderColor: palette.primary.primary,
                  color: palette.primary.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = palette.primary.primary;
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {page === 7 && (
        <div className="flex flex-col items-center justify-center px-4 h-screen bg-white gap-10">
          <ProgressDots current={page} total={5} />
          {/* 상단 안내 문구 */}
          <h1
            className="text-[30px] text-center !font-bold leading-[51.776px] tracking-[0.04em] mb-10"
            style={{
              fontFamily: "Hakgyoansim Mulgyeol",
              color: palette.primary.primary,
            }}
          >
            "사람을 응대하는 일
            <br />
            괜찮으신가요?"
          </h1>
          {/* 이미지 */}
          <img
            src="/src/assets/onboarding/Waiters-pana.png"
            className="w-[340px] h-[300px]"
          />{" "}
          {/* 버튼 영역 */}
          <div
            className="w-full font-bold max-w-[320px] items-center flex flex-col gap-3"
            style={{ fontFamily: "Pretendard" }}
          >
            {[
              { label: "예", onClick: () => setPage(8) },
              {
                label: "아니오",
                onClick: () => setPage(8),
              },
            ].map(({ label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="border leading-[32.36px] tracking-[4%] bg-white  w-[315px] h-[52px] rounded-[10px]"
                style={{
                  borderColor: palette.primary.primary,
                  color: palette.primary.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = palette.primary.primary;
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor =
                    palette.primary.primary;
                  e.currentTarget.style.color = "white";
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {page === 8 && (
        <div
          style={{ backgroundColor: palette.primary.primary }}
          className="flex flex-col items-center justify-center px-4 h-screen bg-white gap-10"
        >
          <img
            src="/src/assets/logo/logo_white.png"
            className="w-[233px] h-[153px]"
          ></img>
          {/* 이미지 */}
          <img
            src="/src/assets/onboarding/FormingTeamLeadership-pana.png"
            className="w-[340px] h-[300px]"
          />{" "}
          <p
            className="text-[20px] !font-semibold text-white text-center"
            style={{
              fontFamily: "Pretendard",
            }}
          >
            당신의 더 나은
            <br />
            '내일'을 위해 '내 일' 찾기
          </p>
          {/* 버튼 영역 */}
          <div className="w-full max-w-[320px] font-bold items-center flex flex-col gap-3">
            <CommonButton
              label="시작하기"
              className="!w-[315px] !h-[52px] !rounded-[10px] !bg-white !text-[#729A73]"
              onClick={() => navigate("/")}
            />
          </div>
        </div>
      )}
      {showSkipModal && (
        <OnboardingSkipModal
          onAccept={() => {
            setShowSkipModal(false);
            setPage(3);
          }}
          onClose={() => navigate("/")}
        />
      )}
    </div>
  );
}

export default Onboarding;
