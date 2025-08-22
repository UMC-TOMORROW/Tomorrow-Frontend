import { useRef, useState } from "react";
import CommonButton from "../components/common/CommonButton";
import palette from "../styles/theme";
import { useNavigate } from "react-router-dom";
import OnboardingSkipModal from "../components/Onboarding/OnboardingSkipModal";
import { postPreferences, patchMemberType } from "../apis/Onboarding";
import { putMyProfile } from "../apis/mypage";
import axios from "axios";

import checklist from "../assets/onboarding/Checklist-pana.png";
import typing from "../assets/onboarding/Typing-pana.png";
import bricklayer from "../assets/onboarding/Bricklayer-pana.png";
import heavybox from "../assets/onboarding/Heavybox-pana.png";
import gardening from "../assets/onboarding/Gardening-pana.png";
import waiters from "../assets/onboarding/Waiters-pana.png";
import formingTeam from "../assets/onboarding/FormingTeamLeadership-pana.png";
import logoWhite from "../assets/logo/logo_white.png";

function Onboarding() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isSavingRef = useRef(false);
  const addUniqueTag = (tag: string) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));

  const PREFERENCE_MAP: Record<string, string> = {
    "앉아서 근무 중심": "SIT",
    "서서 근무 중심": "STAND",
    "물건 운반 중심": "DELIVERY",
    "물건 운반": "DELIVERY",
    "신체 활동 중심": "PHYSICAL",
    "사람 응대 중심": "HUMAN",
  };

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
                onClick: async () => {
                  try {
                    await patchMemberType({ memberType: "EMPLOYER" });
                  } catch (e) {
                    console.error("회원유형 설정 실패(EMPLOYER):", e);
                  } finally {
                    try {
                      await putMyProfile({ isOnboarded: true });
                    } catch (e) {
                      console.warn("isOnboarded 업데이트 실패(무시):", e);
                    }
                    navigate("/MyPage/EmployerMyPage", { replace: true });
                  }
                },
              },
              {
                label: "💼 일을 찾고 있어요",
                onClick: async () => {
                  try {
                    await patchMemberType({ memberType: "JOB_SEEKER" });
                  } catch (e) {
                    console.error("회원유형 설정 실패(JOB_SEEKER):", e);
                  } finally {
                    setPage(2);
                  }
                },
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
          <img src={checklist} className="w-[295px] h-[258px] mt-[16px]" />
          <div className="flex flex-col gap-[12px]">
            <p
              className="text-center text-black text-[16px] font-extrabold leading-[30px] tracking-[-0.03em] mt-3 mb-2"
              style={{ fontFamily: "Pretendard" }}
            >
              ‘내일’은 건강 상태와 선호를 반영하여
              <br />
              보다 편안하고 적합한 일자리와 활동을 추천해드립니다.
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
          <img src={typing} className="w-[340px] h-[300px]" />
          <div
            className="w-full font-bold max-w-[320px] items-center flex flex-col gap-3"
            style={{ fontFamily: "Pretendard" }}
          >
            {[
              {
                label: "예",
                onClick: () => {
                  addUniqueTag("앉아서 근무 중심");
                  setPage(4);
                },
              },
              { label: "아니오", onClick: () => setPage(4) },
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
          <img src={bricklayer} className="w/[340px] h-[300px]" />
          <div
            className="w-full font-bold max-w-[320px] items-center flex flex-col gap-3"
            style={{ fontFamily: "Pretendard" }}
          >
            {[
              {
                label: "예",
                onClick: () => {
                  addUniqueTag("서서 근무 중심");
                  setPage(5);
                },
              },
              { label: "아니오", onClick: () => setPage(5) },
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
          <img src={heavybox} className="w-[340px] h-[300px]" />
          <div
            className="w-full font-bold max-w-[320px] items-center flex flex-col gap-3"
            style={{ fontFamily: "Pretendard" }}
          >
            {[
              {
                label: "예",
                onClick: () => {
                  addUniqueTag("물건 운반 중심");
                  setPage(6);
                },
              },
              { label: "아니오", onClick: () => setPage(6) },
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
          <img src={gardening} className="w/[340px] h-[300px]" />
          <div
            className="w-full font-bold max-w-[320px] items-center flex flex-col gap-3"
            style={{ fontFamily: "Pretendard" }}
          >
            {[
              {
                label: "예",
                onClick: () => {
                  addUniqueTag("신체 활동 중심");
                  setPage(7);
                },
              },
              { label: "아니오", onClick: () => setPage(7) },
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
          <img src={waiters} className="w-[340px] h-[300px]" />
          <div
            className="w-full font-bold max-w-[320px] items-center flex flex-col gap-3"
            style={{ fontFamily: "Pretendard" }}
          >
            {[
              {
                label: "예",
                onClick: () => {
                  addUniqueTag("사람 응대 중심");
                  setPage(8);
                },
              },
              { label: "아니오", onClick: () => setPage(8) },
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
          <img src={logoWhite} className="w-[233px] h-[153px]" />
          <img src={formingTeam} className="w-[340px] h-[300px]" />
          <p
            className="text-[20px] !font-semibold text-white text-center"
            style={{ fontFamily: "Pretendard" }}
          >
            당신의 더 나은
            <br />
            '내일'을 위해 '내 일' 찾기
          </p>
          <div className="w-full max-w-[320px] font-bold items-center flex flex-col gap-3">
            <CommonButton
              label="시작하기"
              className="!w-[315px] !h-[52px] !rounded/[10px] !bg-white !text-[#729A73]"
              onClick={async () => {
                if (isSavingRef.current) return;

                const deduped = Array.from(new Set(selectedTags));
                if (deduped.length === 0) {
                  alert("선호 태그를 최소 1개 이상 선택해 주세요.");
                  return;
                }

                const mapped = deduped
                  .map((t) => PREFERENCE_MAP[t])
                  .filter((v): v is string => Boolean(v));

                if (mapped.length === 0) {
                  alert("선호 태그 매핑에 실패했습니다. 다시 시도해 주세요.");
                  return;
                }

                try {
                  isSavingRef.current = true;
                  const saved = await postPreferences({ preferences: mapped });
                  if (saved) {
                    try {
                      await putMyProfile({ isOnboarded: true });
                    } catch (e) {
                      console.warn("isOnboarded 업데이트 실패(무시):", e);
                    }
                    navigate("/recommendation", { replace: true });
                  } else {
                    alert(
                      "선호 정보를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요."
                    );
                  }
                } catch (err: unknown) {
                  if (axios.isAxiosError(err)) {
                    console.error(
                      "AxiosError",
                      err.response?.data ?? err.message
                    );
                    alert(
                      "선호 정보 저장에 실패했습니다. 잠시 후 다시 시도해 주세요."
                    );
                  } else if (err instanceof Error) {
                    console.error(err.message);
                    alert(`선호 정보 저장에 실패했습니다.\n${err.message}`);
                  } else {
                    console.error(err);
                    alert("선호 정보 저장 중 알 수 없는 오류가 발생했습니다.");
                  }
                } finally {
                  isSavingRef.current = false;
                }
              }}
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
          onClose={async () => {
            setShowSkipModal(false);
            try {
              await putMyProfile({ isOnboarded: true });
            } catch (e) {
              console.warn("isOnboarded 업데이트 실패(무시):", e);
            }
            navigate("/", { replace: true });
          }}
        />
      )}
    </div>
  );
}

export default Onboarding;
