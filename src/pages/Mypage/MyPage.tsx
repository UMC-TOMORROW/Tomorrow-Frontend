import BottomNavbar from "../../components/BottomNavbar";
import Header from "../../components/Header";
import { SlArrowRight } from "react-icons/sl";
import resume from "../../assets/my/resume.png";
import suitcase from "../../assets/my/suitcase.png";
import star_filled_black from "../../assets/my/star_filled_black.png";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white" style={{ fontFamily: "Pretendard" }}>
      <Header title="마이페이지" />

      <div className="min-h-screen pb-[100px] overflow-y-auto mt-[50px]">
        <section className="flex items-center justify-between px-[20px] py-[15px] h-[90px] border-b border-[#5555558C]">
          <div className="flex items-center gap-4">
            <div className="w-[60px] h-[60px] rounded-full bg-gray-200" />
            <div>
              <p className="text-[18px]" style={{ fontWeight: 800 }}>
                이OO
              </p>
              <p className="text-[16px]">몸도 마음도 건강한 하루 되세요!</p>
            </div>
          </div>
          <button>
            <SlArrowRight className="w-[15px] h-[15px]" />
          </button>
        </section>
        <section className="flex justify-around h-[100px] border-b border-[#5555558C] px-[20px] py-[15px]">
          <div className="flex flex-col items-center justify-center text-[15px] w-[130px] h-[70px] bg-[#B8CDB9BF] rounded-xl">
            <p>이력서 관리</p>
            <img src={resume} />
          </div>
          <div
            className="flex flex-col items-center justify-center text-[15px] w-[130px] h-[70px] bg-[#B8CDB9BF] rounded-xl"
            onClick={() => navigate("/MyPage/ApplyStatus")}
          >
            <p>지원 현황</p>
            <img src={suitcase} />
          </div>
        </section>
        <section className="flex items-center justify-center h-[50px] divide-x">
          <div className="flex w-1/2 items-center justify-center gap-[3px]">
            <img src={star_filled_black} className="text-[16px] w-[20px] h-[20px]" />
            저장
          </div>
          <div className="text-[16px] flex w-1/2 items-center justify-center">내 공고 관리</div>
        </section>
        <div className="border border-[#5555558C]"></div>
        <section>
          <div
            className="flex px-[25px] h-[55px] mt-[10px] text-[15px] items-center border-b border-[#5555558C]"
            style={{ fontWeight: 800 }}
          >
            고객센터
          </div>
          <ul>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#5555558C]">
              <span>공지사항</span>
              <SlArrowRight />
            </li>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#5555558C]">
              <span>자주 묻는 질문</span>
              <SlArrowRight />
            </li>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#5555558C]">
              <span>1:1 문의</span>
              <button>
                <SlArrowRight className="w-[15px] h-[15px]" />
              </button>
            </li>
          </ul>
        </section>
        <section>
          <div
            className="flex px-[25px] h-[55px] mt-[10px] text-[15px] items-center border-b border-[#5555558C]"
            style={{ fontWeight: 800 }}
          >
            약관 및 방침
          </div>
          <ul>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#5555558C]">
              <span>이용약관</span>
              <SlArrowRight />
            </li>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#5555558C]">
              <span>개인정보처리방침</span>
              <SlArrowRight />
            </li>
          </ul>
        </section>
        <section>
          <div className="flex justify-center items-center text-[14px] h-[16px] gap-5 my-[70px]">
            <button>로그아웃</button>
            <span>|</span>
            <button className="text-[#EE0606]">회원 탈퇴</button>
          </div>
        </section>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default MyPage;
