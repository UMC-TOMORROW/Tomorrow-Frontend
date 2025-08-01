import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { X, MoreVertical } from "lucide-react";
import Header from "../../components/Header";
import palette from "../../styles/theme";
import talk from "../../assets/talk.png";
import type { CareerTalk } from "../../types/careerTalk";
import { deleteCareerTalk, getCareerTalkDetail } from "../../apis/careerTalk";

const CareerTalkDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState<CareerTalk | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleDelete = async () => {
  if (!career) return;

  const confirmDelete = window.confirm("정말 이 게시글을 삭제하시겠습니까?");
  if (!confirmDelete) return;

  try {
    await deleteCareerTalk(career.id);
    alert("게시글이 삭제되었습니다.");
    navigate("/career-talk");
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    alert("게시글 삭제 중 오류가 발생했습니다.");
  }
};


  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getCareerTalkDetail(Number(id));
        setCareer(data.result);
      } catch (error) {
        console.error("게시글을 불러오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <div className="px-4 pt-14 pb-10">로딩 중...</div>;
  }

  if (!career) {
    return <div className="px-4 pt-14 pb-10">존재하지 않는 게시글입니다.</div>;
  }

  return (
    <div
      className="relative px-4 pt-14 pb-10 min-h-screen font-[Pretendard]"
      style={{ backgroundColor: palette.gray.light }}
    >
      <Header title="내일" />

      <div className="absolute top-[18px] left-4 mt-[40px]">
        <button className="cursor-pointer" onClick={() => navigate("/career-talk")}>
          <X size={24} color={palette.gray.default} />
        </button>
      </div>

      <div className="border-b mt-[90px]" style={{ borderColor: palette.gray.default }} />

      <div className="flex justify-center items-center py-[14px] border-y">
        <span
          className="text-[15px] font-semibold"
          style={{
            color:
              career.category === "무료 자격증 추천" || career.category === "커리어 준비 루트"
                ? palette.primary.primary
                : palette.gray.default,
          }}
        >
          {career.category}
        </span>
      </div>

      <div className="flex justify-center mt-[16px] mb-[16px] relative">
        <strong
          className="text-[16px] font-bold leading-none text-center px-4"
          style={{ color: palette.gray.dark }}
        >
          {career.title}
        </strong>

        {career.author && (
          <div className="absolute right-0 top-0">
            <button onClick={() => setShowMenu(!showMenu)}>
              <MoreVertical size={20} />
            </button>

            {showMenu && (
              <div className="absolute top-[-25px] right-full translate-y-[-50%] mr-[4px] w-[58px] h-[84px] bg-[#EAEAEA] rounded-md shadow-[-4px_4px_8px_rgba(0,0,0,0.1)] z-10">
                <div className="absolute top-[75%] -right-[5px] w-0 h-0 border-t-6 border-b-6 border-l-[6px] border-t-transparent border-b-transparent border-l-[#EAEAEA]" />
                <button
                  className="w-full h-[41px] flex items-center justify-center text-[10px] text-black hover:bg-gray-200 rounded-t-md"
                  onClick={() => navigate(`/career-talk/edit/${career.id}`)}
                >
                  수정
                </button>
                <div className="h-[1px] w-full bg-[#D4D4D4]" />
                <button
                  className="w-full h-[41px] flex items-center justify-center text-[10px] text-[#C84141] hover:bg-gray-200 rounded-b-md"
                  onClick={handleDelete}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-b mb-[20px]" style={{ borderColor: palette.gray.default }} />

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

      <button className="fixed bottom-[90px] right-4 w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-md z-50 cursor-pointer">
        <img src={talk} alt="채팅" />
      </button>
    </div>
  );
};

export default CareerTalkDetailPage;
