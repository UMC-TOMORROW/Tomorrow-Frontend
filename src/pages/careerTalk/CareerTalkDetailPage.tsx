import { useParams, useNavigate } from "react-router-dom";
import { X, MoreVertical } from "lucide-react";
import careerTalkData from "../../data/careerTalkData";
import Header from "../../components/Header";
import palette from "../../styles/theme";
import talk from "../../assets/talk.png";
import { useState } from "react";

const CareerTalkDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const career = careerTalkData.find((item) => item.id === Number(id));
  const [showMenu, setShowMenu] = useState(false);

  // 현재 로그인한 사용자 ID (임시)
  const currentUserId = 1;
  const isAuthor = career?.userId === currentUserId;

  if (!career)
    return (
      <div className="relative px-4 pt-14 pb-10 min-h-screen font-[Pretendard]">
        존재하지 않는 게시글입니다.
      </div>
    );

  return (
    <div
      className="relative px-4 pt-14 pb-10 min-h-screen font-[Pretendard]"
      style={{ backgroundColor: palette.gray.light }}
    >
      <Header title="내일" />

      {/* X 버튼 */}
      <div className="absolute top-[18px] left-4 mt-[40px]">
        <button
          className="cursor-pointer"
          onClick={() => navigate("/career-talk")}
        >
          <X size={24} color={palette.gray.default} />
        </button>
      </div>

      {/* 상단 구분선 */}
      <div
        className="border-b mt-[90px]"
        style={{ borderColor: palette.gray.default }}
      />

      {/* 카테고리 */}
      <div className="flex justify-center items-center py-[14px] border-y">
        <span
          className="text-[15px] font-semibold"
          style={{
            color:
              career.category === "무료 자격증 추천" ||
              career.category === "커리어 준비 루트"
                ? palette.primary.primary
                : palette.gray.default,
          }}
        >
          {career.category}
        </span>
      </div>

      {/* 제목 + 드롭다운 메뉴 */}
      <div className="flex justify-center mt-[16px] mb-[16px] relative">
        <strong
          className="text-[16px] font-bold leading-none text-center px-4"
          style={{ color: palette.gray.dark }}
        >
          {career.title}
        </strong>

        {isAuthor && (
          <div className="absolute right-0 top-0">
            <button onClick={() => setShowMenu(!showMenu)}>
              <MoreVertical size={20} />
            </button>

            {showMenu && (
              <div className="absolute top-[-25px] right-full translate-y-[-50%] mr-[4px] w-[58px] h-[84px] bg-[#EAEAEA] rounded-md shadow-[-4px_4px_8px_rgba(0,0,0,0.1)] z-10">
                <div className="absolute top-[75%] -right-[5px] w-0 h-0 border-t-6 border-b-6 border-l-[6px] border-t-transparent border-b-transparent border-l-[#EAEAEA]" />

                <button
                  className="w-full h-[41px] flex items-center justify-center text-[10px] text-black hover:bg-gray-200 rounded-t-md"
                  onClick={() => console.log("수정")}
                >
                  수정
                </button>

                <div className="h-[1px] w-full bg-[#D4D4D4]" />

                <button
                  className="w-full h-[41px] flex items-center justify-center text-[10px] text-[#C84141] hover:bg-gray-200 rounded-b-md"
                  onClick={() => console.log("삭제")}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 제목 아래 구분선 */}
      <div
        className="border-b mb-[20px]"
        style={{ borderColor: palette.gray.default }}
      />

      {/* 본문 내용 */}
      <div
        className="text-[15px] leading-[24px] whitespace-pre-wrap"
        style={{
          color: palette.gray.dark,
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        {career.content}
      </div>

      {/* 채팅 아이콘 버튼 */}
      <button className="fixed bottom-[90px] right-4 w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-md z-50 cursor-pointer">
        <img src={talk} alt="채팅" />
      </button>
    </div>
  );
};

export default CareerTalkDetailPage;
