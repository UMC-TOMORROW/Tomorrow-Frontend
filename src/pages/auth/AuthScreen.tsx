import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import naverIcon from "../../assets/login/naver2.png";
import kakaoIcon from "../../assets/login/kakao2.png";
import googleIcon from "../../assets/login/google2.png";
import { getMe1 } from "../../apis/member";

const BASE = import.meta.env.VITE_SERVER_API_URL as string;

const startLogin = (provider: "kakao" | "google" | "naver") => {
  // 로그인 성공 후에는 항상 홈("/")로만 돌아오게 고정
  const afterAuth = `/auth?returnTo=${encodeURIComponent("/")}`;
  const url = `${BASE}/oauth2/authorization/${provider}?returnTo=${encodeURIComponent(
    afterAuth
  )}`;
  window.location.href = url;
};

const AuthScreen = () => {
  const navigate = useNavigate();

  const isDeactivated = (me: any) => {
    const s = String(me?.status || "").toUpperCase();
    return (
      s === "INACTIVE" ||
      s === "DEACTIVATED" ||
      s === "DELETED" ||
      !!me?.isDeactivated
    );
  };

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe1();

        // 탈퇴 계정이면 복구 플로우
        if (isDeactivated(me)) {
          navigate("/auth/recover", { replace: true });
          return;
        }

        // 활성 계정이면 항상 홈으로 이동 (라우터 로더가 이후 분기 처리)
        if (me) {
          navigate("/", { replace: true });
          return;
        }
      } catch {
        // 비로그인 → 로그인 화면 유지
      }
    })();
  }, [navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center bg-white px-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col gap-4 items-center">
          <img src={logo} alt="logo" className="w-[233px]" />
          <p className="text-[#729A73] text-[16px]">
            당신의 더 나은 '내일'을 위한 '내 일' 찾기
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-start pt-8">
        <div className="grow flex flex-col justify-start pt-10">
          <div className="flex flex-col items-center gap-5">
            {/* 네이버 */}
            <button
              onClick={() => startLogin("naver")}
              className="flex items-center justify-center w-[300px] h-[50px] rounded-[10px] bg-[#03C75A] text-white font-semibold text-sm px-[30px] gap-[20px]"
            >
              <img src={naverIcon} alt="Naver" className="w-5 h-5" />
              네이버로 시작하기
            </button>

            {/* 카카오 */}
            <button
              onClick={() => startLogin("kakao")}
              className="flex items-center justify-center w-[300px] h-[50px] rounded-[10px] bg-[#FEE500] text-[#3C1E1E] font-semibold text-sm px-[30px] gap-[20px]"
            >
              <img src={kakaoIcon} alt="Kakao" className="w-5 h-5" />
              카카오로 시작하기
            </button>

            {/* 구글 */}
            <button
              onClick={() => startLogin("google")}
              className="flex items-center justify-center w-[300px] h-[50px] rounded-[10px] bg-white border border-[#eee] text-[#3C4043] font-semibold text-sm px-[30px] gap-[20px]"
            >
              <img src={googleIcon} alt="Google" className="w-5 h-5" />
              Google로 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
