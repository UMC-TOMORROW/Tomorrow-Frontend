import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MemverRecover from "../../assets/recover.png";
import palette from "../../styles/theme";
import { getMyInfo } from "../../apis/employerMyPage";
import { recoverMember } from "../../apis/memberRecover";
import { axiosInstance } from "../../apis/axios";

const MemberRecover = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleCancel = async () => {
    if (submitting) return;
    try {
      // 백엔드 호스트로 로그아웃 (쿠키 삭제)
      await axiosInstance
        .post("/api/v1/auth/logout", null, {
          withCredentials: true,
        })
        .catch((e) => {
          // 401이어도 신경쓰지 말고 로컬 정리 후 진행
          console.warn("logout ignored:", e?.response?.status);
        });

      sessionStorage.clear();
      localStorage.removeItem("Authorization");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      navigate("/auth", { replace: true });
    }
  };

  const handleRecover = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);

      const me = await getMyInfo();
      const memberId = me?.id;
      if (!memberId) {
        alert("계정 정보를 확인할 수 없습니다. 다시 로그인해 주세요.");
        navigate("/auth", { replace: true });
        return;
      }

      await recoverMember(memberId);

      // 복구 성공 → 역할에 따라 라우팅
      const role = String(me?.role || "").toUpperCase();
      if (role === "EMPLOYER") {
        navigate("/MyPage/EmployerMyPage", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (e: any) {
      // 디버깅 메시지 (원인 파악에 도움)
      const status = e?.response?.status;
      const url = e?.config?.baseURL
        ? `${e.config.baseURL}${e.config.url}`
        : e?.config?.url;
      console.error("계정 복구 실패:", status, url, e?.response?.data ?? e);

      if (status === 404) {
        alert("복구 API 경로 확인이 필요합니다. 잠시 후 다시 시도해 주세요.");
      } else {
        alert("계정 복구에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 h-screen bg-white">
      <div className="flex flex-col items-center justify-center">
        <img
          src={MemverRecover}
          className="flex flex-col items-center h-[190px] w-[190px]"
          alt="recover"
        />
        <div
          className="flex flex-col text-center text-[22px] font-bold mt-[40px]"
          style={{ fontFamily: "Pretendard", color: palette.primary.primary }}
        >
          탈퇴 신청한 계정입니다.
          <br />
          지금 계정을 복구하시겠어요?
        </div>
        <div
          className="flex flex-col text-center text-[18px] mt-[30px]"
          style={{ fontFamily: "Pretendard" }}
        >
          14일 이내에 복구하지 않을 시
          <br />
          계정과 데이터는 완전히 삭제됩니다.
        </div>
      </div>

      <div className="flex flex-row gap-4 mt-[120px]">
        <button
          onClick={handleCancel}
          className="w-[140px] h-[48px] rounded-[10px] text-[18px] text-[#EE0606CC] !font-bold flex items-center justify-center border transition duration-200"
          style={{ borderColor: "#EE0606CC", fontFamily: "Pretendard" }}
          disabled={submitting}
        >
          취소
        </button>

        <button
          onClick={handleRecover}
          disabled={submitting}
          className="w-[140px] h-[48px] rounded-[10px] text-[18px] !text-white !font-bold flex items-center justify-center border transition duration-200 disabled:opacity-60"
          style={{
            borderColor: palette.primary.primary,
            backgroundColor: palette.primary.primary,
            fontFamily: "Pretendard",
          }}
        >
          {submitting ? "복구 중..." : "복구"}
        </button>
      </div>
    </div>
  );
};

export default MemberRecover;
