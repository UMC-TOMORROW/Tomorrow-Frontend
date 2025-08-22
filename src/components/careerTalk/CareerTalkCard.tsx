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
  const fullText = ` ${title} | ${content}`;
  const trimmedText =
    fullText.length > maxLength
      ? fullText.slice(0, maxLength) + "..."
      : fullText;

  return (
<div
  onClick={() => navigate(`/career-talk/${id}`)}
  className="w-[320px] h-[75px] rounded-xl px-[10px] text-[16px] leading-[22px] shadow-sm cursor-pointer flex items-center"
  style={{
    backgroundColor: shouldFill
      ? palette.primary.primaryLight75
      : palette.gray.light,
    color: palette.gray.dark,
    border: `1px solid ${palette.primary.primary}`,
  }}
>
  <span>
    <strong>[{category}]</strong> {trimmedText}
    {fullText.length > maxLength && (
      <span className="font-semibold"> 더보기</span>
    )}
  </span>
</div>

  );
}

export default CareerTalkCard;
