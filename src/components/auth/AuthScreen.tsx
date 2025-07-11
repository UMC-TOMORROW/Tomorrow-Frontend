import React from "react";
import logo from "../../assets/logo/logo.png";
import naverIcon from "../../assets/login/naver.png";
import kakaoIcon from "../../assets/login/kakao.png";
import googleIcon from "../../assets/login/google.png";

const AuthScreen = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white px-6">
      {/* 로고 */}
      <img src={logo} alt="logo" className="w-[250px]" />

      {/* 슬로건 */}
      <p className="text-[#729A73] text-sm mb-6">당신의 더 나은 '내일'을 위한 '내 일' 찾기</p>

      {/* 간편가입 안내 */}
      <div className="w-full max-w-[300px] py-2 px-4 bg-[#F6F6F6] rounded-md text-sm text-center text-[#8B8B8B]">
        ✨ 3초 만에 빠른 회원가입
      </div>

      {/* 네이버 */}
      <button className="w-full max-w-[300px] h-12 bg-[#03C75A] rounded-md text-white font-semibold text-sm flex items-center justify-center mb-3">
        <img src={naverIcon} alt="Naver" className="w-5 h-5 mr-2" />
        네이버로 시작하기
      </button>

      {/* 카카오 */}
      <button className="w-full max-w-[300px] h-12 bg-[#FEE500] rounded-md text-[#3C1E1E] font-semibold text-sm flex items-center justify-center mb-3">
        <img src={kakaoIcon} alt="Kakao" className="w-5 h-5 mr-2" />
        카카오로 시작하기
      </button>

      {/* 구글 */}
      <button className="w-full max-w-[300px] h-12 border border-[#DADCE0] rounded-md text-[#3C4043] font-semibold text-sm flex items-center justify-center">
        <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" />
        Google로 시작하기
      </button>
    </div>
  );
};

export default AuthScreen;
