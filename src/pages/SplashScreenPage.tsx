import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo_white.png";

const SplashScreenPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth"); // 2초 후 AuthScreen으로 이동
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'PretendardLocal';
            src: url('/fonts/Pretendard-Regular.woff2') format('woff2');
            font-weight: 400;
            font-style: normal;
          }
        `}
      </style>

      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#729A73] gap-2">
        <img src={logo} alt="로고" className="w-[233px]" />
        <p className="text-white text-[16px]" style={{ fontFamily: "PretendardLocal, sans-serif" }}>
          당신의 더 나은 '내일'을 위한 '내 일' 찾기
        </p>
      </div>
    </>
  );
};

export default SplashScreenPage;
