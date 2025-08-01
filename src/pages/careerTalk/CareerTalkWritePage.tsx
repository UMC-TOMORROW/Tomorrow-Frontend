import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import CommonButton from "../../components/common/CommonButton";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import palette from "../../styles/theme";
import { postCareerTalk, putCareerTalk, getCareerTalkDetail } from "../../apis/careerTalk";

const categoryOptions = [
  "무료 자격증 추천",
  "커리어 준비 루트",
  "제2 커리어 성공 사례",
  "내일 서비스 후기",
];

const CareerTalkWritePage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 수정 모드일 경우 존재
  const isEditMode = !!id;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 수정 모드일 경우 게시글 데이터 로딩
  useEffect(() => {
    if (!isEditMode) return;

    const fetchDetail = async () => {
      try {
        const res = await getCareerTalkDetail(Number(id));
        const data = res.result;

        setSelectedCategory(data.category ?? "");
        setTitle(data.title ?? "");
        setContent(data.content ?? "");
      } catch (error) {
        console.error("게시글 로딩 실패:", error);
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
        navigate(-1);
      }
    };

    fetchDetail();
  }, [id]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !title.trim() || !content.trim()) {
      alert("카테고리, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    // 일단 카테고리 문자열 그대로 사용
    const category = selectedCategory;

    // 추후 백엔드 ENUM 필요 시 매핑 예시..
    // const categoryMap: Record<string, string> = {
    //   "무료 자격증 추천": "CERTIFICATE",
    //   "커리어 준비 루트": "ROUTE",
    //   "제2 커리어 성공 사례": "SUCCESS",
    //   "내일 서비스 후기": "REVIEW",
    // };
    // const category = categoryMap[selectedCategory];

    try {
      if (isEditMode) {
        const res = await putCareerTalk(Number(id), {
          category,
          title,
          content,
        });
        navigate(`/career-talk/${res.result.id}`);
      } else {
        const res = await postCareerTalk({
          category,
          title,
          content,
        });
        navigate(`/career-talk/${res.result.id}`);
      }
    } catch (err) {
      console.error("저장 실패:", err);
      alert("게시글 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="relative min-h-screen pb-[110px] px-4 font-[Pretendard]">
      <Header title="내일" />

      {/* X 버튼 */}
      <div className="absolute top-[18px] left-4 mt-[40px]">
        <button className="cursor-pointer" onClick={() => navigate(-1)}>
          <X size={24} />
        </button>
      </div>

      <div className="border-b" style={{ borderColor: palette.gray.default, marginTop: "90px" }} />

      {/* 드롭다운 */}
      <div className="relative">
        <button
          className="w-full flex items-center justify-between py-[10px] relative"
          onClick={toggleDropdown}
        >
          {selectedCategory ? (
            <span
              className="absolute left-1/2 transform -translate-x-1/2 text-[16px]"
              style={{
                color:
                  selectedCategory === "무료 자격증 추천" || selectedCategory === "커리어 준비 루트"
                    ? palette.primary.primary
                    : palette.gray.default,
              }}
            >
              {selectedCategory}
            </span>
          ) : (
            <span className="text-[16px]" style={{ color: palette.gray.dark }}>
              카테고리를 선택해주세요.
            </span>
          )}
          {isOpen ? <ChevronUp size={18} className="ml-auto" /> : <ChevronDown size={18} className="ml-auto" />}
        </button>

        {isOpen && (
          <div
            className="absolute left-0 top-full w-full h-[200px] bg-white border-t border-b rounded-b z-10 flex flex-col pt-[25px] pb-[25px] gap-[22px]"
            style={{ borderColor: "#ccc" }}
          >
            {categoryOptions.map((option) => {
              const isGreen = option === "무료 자격증 추천" || option === "커리어 준비 루트";
              const isSelected = selectedCategory === option;

              return (
                <div
                  key={option}
                  className={`text-center py-2 text-[15px] cursor-pointer ${
                    isSelected ? "underline font-semibold" : ""
                  }`}
                  style={{
                    color: isGreen ? palette.primary.primary : palette.gray.default,
                  }}
                  onClick={() => handleSelectCategory(option)}
                >
                  {option}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 제목 */}
      <input
        className="w-full h-[38px] px-[10px] py-[10px] rounded-[10px] text-[15px] outline-none mb-[10px]"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          border: `1px solid ${palette.gray.default}`,
          color: palette.gray.dark,
        }}
      />

      {/* 내용 */}
      <textarea
        className="w-full h-[300px] px-4 pt-6 pb-3 text-[15px] leading-[24px] outline-none resize-none"
        placeholder="내용을 입력하세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          borderTop: `1px solid ${palette.gray.default}`,
          color: palette.gray.dark,
        }}
      />

      {/* 버튼 */}
      <div className="fixed bottom-6 left-0 w-full px-4">
        <CommonButton label={isEditMode ? "수정하기" : "등록하기"} onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default CareerTalkWritePage;
