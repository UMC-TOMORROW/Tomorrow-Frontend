import { useNavigate } from "react-router-dom";
import palette from "../../styles/theme";

interface CareerTalkCardProps {
  id: number;
  category: string;
  title: string;
  content: string;
}

function CareerTalkCard({ id, category, title, content }: CareerTalkCardProps) {
  const navigate = useNavigate();

  const shouldFill =
    category === "무료 자격증 추천" || category === "커리어 준비 루트";

  const maxLength = 30; // 제목 + 내용 길이 제한
  const fullText = `${title} ${content}`;
  const trimmedText =
    fullText.length > maxLength
      ? fullText.slice(0, maxLength) + "..."
      : fullText;

  return (
    <div
      onClick={() => navigate(`/career-talk/${id}`)}
      className="rounded-xl p-[10px] text-[15px] leading-[22px] shadow-sm cursor-pointer"
      style={{
        backgroundColor: shouldFill
          ? palette.primary.primaryLight75
          : palette.gray.light,
        color: palette.gray.dark,
        border: `1px solid ${palette.primary.primary}`,
      }}
    >
      <strong>[{category}]</strong>
      {trimmedText}
      {fullText.length > maxLength && (
        <span className="font-semibold"> 더보기</span>
      )}
    </div>
  );
}

export default CareerTalkCard;
