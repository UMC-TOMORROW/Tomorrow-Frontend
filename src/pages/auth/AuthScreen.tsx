// import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo/logo.png";
import naverIcon from "../../assets/login/naver2.png";
import kakaoIcon from "../../assets/login/kakao2.png";
import googleIcon from "../../assets/login/google2.png";

const BASE = import.meta.env.VITE_SERVER_API_URL as string;
const loginWith = (provider: "kakao" | "google" | "naver", returnTo = "/") => {
  const url = `${BASE}/oauth2/authorization/${provider}?returnTo=${encodeURIComponent(returnTo)}`;
  window.location.href = url;
  console.log(`${provider}로 로그인 시도 중 ...`);
};
// const loginWith = (provider: "kakao" | "google" | "naver") => {
//   window.location.href = `${BASE}/oauth2/authorization/${provider}`;
//   console.log("SERVER:", import.meta.env.VITE_SERVER_API_URL);
//   console.log(`${provider}로 로그인 시도 중 ...`);
// };

const AuthScreen = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center bg-white px-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col gap-4 items-center">
          <img src={logo} alt="logo" className="w-[233px]" />
          <p className="text-[#729A73] text-[16px]">당신의 더 나은 '내일'을 위한 '내 일' 찾기</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-start pt-8">
        {/* 간편가입 안내 */}
        {/* <div className="flex flex-col items-center mb-6">
          <div className="py-2 px-4 bg-[#F6F6F6] border border-[#ddd] rounded-md text-sm text-[#8B8B8B] p-4">
            ✨ 3초 만에 빠른 회원가입
          </div>
        </div> */}

        {/* 네이버 */}
        {/* 로그인 버튼 영역 */}
        <div className="grow flex flex-col justify-start pt-10">
          <div className="flex flex-col items-center gap-5">
            {/* 네이버 */}
            <button
              onClick={() => loginWith("naver")}
              className="flex items-center justify-center w-[300px] h-[50px] rounded-[10px] bg-[#03C75A] text-white font-semibold text-sm px-[30px] gap-[20px]"
            >
              <img src={naverIcon} alt="Naver" className="w-5 h-5" />
              네이버로 시작하기
            </button>

            {/* 카카오 */}
            <button
              onClick={() => loginWith("kakao")}
              className="flex items-center justify-center w-[300px] h-[50px] rounded-[10px] bg-[#FEE500] text-[#3C1E1E] font-semibold text-sm px-[30px] gap-[20px]"
            >
              <img src={kakaoIcon} alt="Kakao" className="w-5 h-5" />
              카카오로 시작하기
            </button>

            {/* 구글 */}
            <button
              onClick={() => loginWith("google")}
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
