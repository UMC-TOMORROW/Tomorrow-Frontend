import { useParams, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import careerTalkData from "../../data/careerTalkData";
import Header from "../../components/Header";
import palette from "../../styles/theme";
import talk from "../../assets/talk.png";

const CareerTalkDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const career = careerTalkData.find((item) => item.id === Number(id));

  if (!career) return <div className="relative px-4 pt-14 pb-10 min-h-screen font-[Pretendard]">존재하지 않는 게시글입니다.</div>;

  return (
    <div
      className="relative px-4 pt-14 pb-10 min-h-screen font-[Pretendard]"
      style={{ backgroundColor: palette.gray.light }}
    >
      <Header title="내일" />

      {/* X 버튼 */}
      <div className="absolute top-[18px] left-4 mt-[40px]">
        <button className="cursor-pointer" onClick={() => navigate("/career-talk")}>
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

      {/* 제목 */}
      <div className="flex justify-center mt-[16px] mb-[16px]">
        <strong
          className="text-[16px] font-bold leading-none"
          style={{
            color: palette.gray.dark,
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          {career.title}
        </strong>
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
