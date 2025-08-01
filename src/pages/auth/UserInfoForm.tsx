import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserInfoForm() {
  const [user, setUser] = useState({
    email: "",
    name: "",
    gender: "",
    phoneNumber: "",
    address: "",
  });

  const navigate = useNavigate();
  const BASE = import.meta.env.VITE_SERVER_API_URL;

  useEffect(() => {
    fetch(`${BASE}/api/v1/members/me`, {
      credentials: "include", // 쿠키 포함 필수
    })
      .then((res) => {
        if (!res.ok) throw new Error("응답 실패");
        return res.json();
      })
      .then((data) => {
        console.log("✅ [회원 정보]:", data);
      })
      .catch((err) => {
        console.error("❌ [회원 정보 불러오기 실패]:", err);
      });
  }, []);

  return (
    <div className="w-full flex flex-col items-center bg-white min-h-screen">
      {/* 헤더 영역을 form 밖으로 분리 */}
      <div className="w-[375px]">
        {/* 상단 헤더 영역 */}
        <div className="relative flex items-center justify-center h-12 px-4 py-6">
          {/* 왼쪽 뒤로가기 버튼 */}
          <button onClick={() => navigate(-1)} className="absolute left-4 text-[20px]">
            &lt;
          </button>

          {/* 가운데 제목 */}
          <h1 className="text-[20px] font-bold">회원 정보</h1>
        </div>

        {/* 전체 너비 회색 줄 - 화면 전체를 채움 */}
        <div className="w-screen h-[1px] bg-[#DEDEDE] -mx-4" />
      </div>

      <form
        className="w-[375px] flex flex-col items-center px-4 gap-y-6 text-[#333333] mt-6"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* 이메일 */}
        <div className="w-full">
          <h1 className=" text-[18px] font-extrabold leading-[22px] tracking-[-0.41px] mb-2 text-[#333333]">
            기본 정보
          </h1>
          <label className="text-sm font-medium mb-1 flex">
            이메일<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            value={user.email}
            readOnly
            className="w-full h-[44px] border border-[#DEDEDE] rounded-[8px] px-3 text-[16px] text-[#333333] mt-1"
          />
          <p className="text-[12px] text-[#888] mt-1">카카오 로그인 사용중</p>
        </div>

        {/* 이름 */}
        <div className="w-full">
          <label className="text-sm font-medium mb-1 flex">
            이름<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full h-[44px] border border-[#DEDEDE] rounded-[8px] px-3 text-[16px] text-[#333333] mt-1"
          />
        </div>

        {/* 성별 */}
        <div className="w-full">
          <label className="text-sm font-medium mb-2">성별</label>
          <div className="flex gap-2">
            {["남자", "여자"].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setUser({ ...user, gender: label === "남자" ? "M" : "F" })}
                className={`w-1/2 h-[44px] rounded-[6px] border text-[16px] ${
                  user.gender === (label === "남자" ? "M" : "F") ? "border-[#333333] font-bold" : "border-[#DEDEDE]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 휴대폰 */}
        <div className="w-full">
          <label className="text-sm font-medium mb-1">휴대폰</label>
          <div className="flex gap-2">
            <input
              value={user.phoneNumber}
              onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
              className="flex-1 h-[44px] border border-[#DEDEDE] rounded-[8px] px-3 text-[16px] text-[#333333]"
            />
            <button type="button" className="w-[60px] h-[44px] rounded-[8px] bg-[#DEDEDE] text-[14px]">
              변경
            </button>
          </div>
        </div>

        {/* 주소 */}
        <div className="w-full">
          <label className="text-sm font-medium mb-1">주소</label>
          <div className="flex gap-2">
            <input
              value={user.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              className="flex-1 h-[44px] border border-[#DEDEDE] rounded-[8px] px-3 text-[16px] text-[#333333]"
            />
            <button type="button" className="w-[60px] h-[44px] rounded-[8px] bg-[#DEDEDE] text-[14px]">
              검색
            </button>
          </div>
        </div>

        {/* 버튼 */}
        <button
          type="submit"
          className="w-[315px] h-[52px] rounded-[10px] bg-[#7A9075] text-white text-[18px] font-bold tracking-[0.04em] mt-4"
        >
          수정 완료
        </button>
      </form>
    </div>
  );
}
