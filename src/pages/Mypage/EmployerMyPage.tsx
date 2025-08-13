import BottomNavbar from "../../components/BottomNavbar";
import Header from "../../components/Header";
import { SlArrowRight } from "react-icons/sl";
import resume from "../../assets/my/resume.png";
import suitcase from "../../assets/my/suitcase.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import member from "../../assets/member.png";
import type { MyInfo } from "../../types/member";
import { getMyInfo } from "../../apis/employerMyPage";

const EmployerMyPage = () => {
  const navigate = useNavigate();
  const [showUnregister, setShowUnregister] = useState(false);
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const data = await getMyInfo();
        setMyInfo(data);
      } catch (error) {
        console.error("내 정보 불러오기 실패:", error);
      }
    };
    fetchMyInfo();
  }, []);
  return (
    <div className="bg-white" style={{ fontFamily: "Pretendard" }}>
      <Header title="마이페이지" />

      <div className="min-h-screen pb-[100px] overflow-y-auto mt-[50px]">
        <section className="flex items-center justify-between px-[20px] py-[15px] h-[115px] border-b border-[#DEDEDE]">
          <div className="flex items-center gap-4">
            <img src={member} />
            <div>
              <p className="text-[18px]" style={{ fontWeight: 800 }}>
                {myInfo?.name ?? "이름을 등록해주세요"}
              </p>
              <p className="text-[13px]">
                서로를 이어주는 내일, 지금 시작해보세요
              </p>
            </div>
          </div>
          <button onClick={() => navigate("/MyPage/MemberInfo")}>
            <SlArrowRight className="w-[15px] h-[15px]" />
          </button>
        </section>
        <section className="flex justify-around h-[100px] border-b border-[#DEDEDE] px-[20px] py-[15px] mb-[30px]">
          <div
            onClick={() => navigate("/MyPage/ManageMyJobs")}
            className="flex flex-col items-center justify-center text-[15px] gap-[5px] w-[140px] h-[70px] bg-[#B8CDB9BF] rounded-xl"
          >
            <p>공고 관리</p>
            <img src={resume} />
          </div>
          <div
            className="flex flex-col items-center justify-center text-[15px] gap-[5px] w-[140px] h-[70px] bg-[#B8CDB9BF] rounded-xl"
            onClick={() => navigate("")}
          >
            <p>일자리 등록</p>
            <img src={suitcase} />
          </div>
        </section>
        <section>
          <div
            className="flex px-[25px] h-[55px] mt-[10px] text-[15px] items-center border-b border-[#DEDEDE]"
            style={{ fontWeight: 800 }}
          >
            사업자 정보
          </div>
          <ul>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#DEDEDE]">
              <span>사업자 정보 등록</span>
              <SlArrowRight />
            </li>
          </ul>
        </section>
        <section>
          <div
            className="flex px-[25px] h-[55px] mt-[10px] text-[15px] items-center border-b border-[#DEDEDE]"
            style={{ fontWeight: 800 }}
          >
            고객센터
          </div>
          <ul>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#DEDEDE]">
              <span>공지사항</span>
              <SlArrowRight />
            </li>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#DEDEDE]">
              <span>자주 묻는 질문</span>
              <SlArrowRight />
            </li>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#DEDEDE]">
              <span>1:1 문의</span>
              <button>
                <SlArrowRight className="w-[15px] h-[15px]" />
              </button>
            </li>
          </ul>
        </section>
        <section>
          <div
            className="flex px-[25px] h-[55px] mt-[10px] text-[15px] items-center border-b border-[#DEDEDE]"
            style={{ fontWeight: 800 }}
          >
            약관 및 방침
          </div>
          <ul>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#DEDEDE]">
              <span>이용약관</span>
              <SlArrowRight />
            </li>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#DEDEDE]">
              <span>개인정보처리방침</span>
              <SlArrowRight />
            </li>
          </ul>
        </section>
        <section>
          <div className="flex justify-center items-center text-[14px] h-[16px] gap-5 my-[70px]">
            <button>로그아웃</button>
            <span>|</span>
            <button
              className="text-[#EE0606]"
              onClick={() => setShowUnregister(true)}
            >
              회원 탈퇴
            </button>
          </div>
        </section>

        {showUnregister && (
          <div
            className="fixed inset-0 z-50 flex justify-center items-center bg-[#70707080]/50"
            style={{ borderRadius: "15px" }}
          >
            <div
              className="flex flex-col items-center justify-center text-center w-[330px] bg-[#FFFFFF]"
              style={{ borderRadius: "15px" }}
            >
              <div className="flex flex-col gap-[25px] py-[30px] h-[158px] w-full border-b border-[#729A73]">
                <p
                  className="text-[20px] text-[#729A73]"
                  style={{ fontWeight: 700 }}
                >
                  정말 탈퇴하시겠어요?
                </p>
                <p className="text-[16px]" style={{ fontWeight: 400 }}>
                  탈퇴 시 계정은 14일 동안 유지되며,
                  <br />
                  이후에는 삭제 되어 복구되지 않습니다.
                </p>
              </div>
              <div className="flex items-center justify-center py-[15px] gap-[17px] h-[75px]">
                <button
                  onClick={() => setShowUnregister(false)}
                  className="w-[140px] h-[48px] bg-[#729A73] text-[#FFFFFF] text-[16px]"
                  style={{ borderRadius: "10px" }}
                >
                  취소
                </button>
                <button
                  onClick={() => alert("회원 탈퇴")}
                  className="w-[140px] h-[48px] border border-[#729A73] text-[#729A73] text-[16px]"
                  style={{ borderRadius: "10px" }}
                >
                  탈퇴
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavbar />
    </div>
  );
};

export default EmployerMyPage;
