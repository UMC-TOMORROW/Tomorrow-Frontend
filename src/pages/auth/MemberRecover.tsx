import React from "react";
import MemverRecover from "../../assets/recover.png";
import palette from "../../styles/theme";
import { Link } from "react-router-dom";

const MemberRecover = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 h-screen bg-white">
      <div className="flex flex-col items-center justify-center">
        <img
          src={MemverRecover}
          className="flex flex-col items-center h-[190px] w-[190px]"
        ></img>
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
        <Link to={"/auth"}>
          <button
            className="w-[140px] h-[48px] rounded-[10px] text-[18px] text-[#EE0606CC] !font-bold flex items-center justify-center border transition duration-200"
            style={{
              borderColor: "#EE0606CC",
              fontFamily: "Pretendard",
            }}
          >
            취소
          </button>
        </Link>
        <button
          className="w-[140px] h-[48px] rounded-[10px] text-[18px] !text-white !font-bold flex items-center justify-center border transition duration-200"
          style={{
            borderColor: palette.primary.primary,
            backgroundColor: palette.primary.primary,
            fontFamily: "Pretendard",
          }}
        >
          복구
        </button>
      </div>
    </div>
  );
};

export default MemberRecover;
