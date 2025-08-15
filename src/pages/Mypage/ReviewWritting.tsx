// src/pages/ReviewWritting.tsx
import { SlArrowLeft } from "react-icons/sl";
import star_empty from "../../assets/star_empty.png";
import star_filled from "../../assets/star_filled.png";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../apis/axios";
import type { ApiResponse } from "../../types/mypage";

type JobDetail = {
  id: number;
  title: string;
};

const ReviewWritting = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const location = useLocation();

  // 이전 페이지에서 state로 넘어온 제목을 우선 사용
  const titleFromState = (location.state as { title?: string } | null)?.title;

  const [rating, setRating] = useState(3);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 제목 상태 (state 우선, 없으면 조회)
  const [jobTitle, setJobTitle] = useState<string>(titleFromState ?? "");
  const [loadingTitle, setLoadingTitle] = useState<boolean>(!titleFromState);

  useEffect(() => {
    // state에 제목이 있으면 추가 조회 불필요
    if (titleFromState) {
      setLoadingTitle(false);
      return;
    }

    const fetchTitle = async () => {
      if (!postId) return;
      try {
        setLoadingTitle(true);
        const res = await axiosInstance.get<ApiResponse<JobDetail>>(
          `/api/v1/jobs/${encodeURIComponent(postId)}`
        );
        const t = res.data?.result?.title;
        if (t && typeof t === "string") setJobTitle(t);
      } catch (e) {
        console.error("리뷰용 제목 조회 실패:", e);
      } finally {
        setLoadingTitle(false);
      }
    };

    fetchTitle();
  }, [postId, titleFromState]);

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const handleSubmit = async () => {
    if (!postId) {
      alert("공고 정보를 불러올 수 없습니다.");
      return;
    }
    if (!review.trim()) {
      alert("후기를 작성해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const body = {
        postId: Number(postId),
        stars: rating,
        review: review.trim(),
      };

      const res = await axiosInstance.post<ApiResponse<{ reviewId: number }>>(
        "/api/v1/reviews",
        body
      );
      console.log("리뷰 등록 응답:", res.data);

      alert("후기가 등록되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("후기 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        {/* 헤더 */}
        <section className="relative flex justify-center items-center h-[52px] border-b-[1.5px] border-[#DEDEDE8C]">
          <SlArrowLeft
            className="absolute left-[15px] cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <div className="text-[20px]" style={{ fontWeight: 700 }}>
            후기 작성
          </div>
        </section>

        {/* 공고 제목 */}
        <section className="flex items-center h-[50px] border-b border-[#DEDEDE8C]">
          <p
            className="ml-[25px] text-[16px] text-[#729A73]"
            style={{ fontWeight: 700 }}
          >
            {loadingTitle ? "불러오는 중..." : jobTitle || "(제목 없음)"}
          </p>
        </section>

        {/* 별점 */}
        <section className="flex flex-col justify-center gap-[30px] items-center h-[145px] border-b border-[#DEDEDE8C]">
          <p className="text-[16px]" style={{ fontWeight: 600 }}>
            이번 일, 몸과 마음은 어떠셨나요?
          </p>
          <div className="flex gap-[2px]">
            {[0, 1, 2, 3, 4].map((index) => (
              <img
                key={index}
                className="w-[40px] h-[40px] cursor-pointer"
                src={index < rating ? star_filled : star_empty}
                onClick={() => handleStarClick(index)}
                alt={`star-${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* 후기 입력 */}
        <section className="flex flex-col justify-center items-center gap-[30px] p-[20px] h-[334px]">
          <p className="text-[16px]">
            어떤 점이 좋았거나 아쉬웠는지 간단히 작성해 주세요.
          </p>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            maxLength={100}
            className="w-[295px] h-[220px] bg-[#D9D9D980] resize-none overflow-hidden overflow-y-scroll p-[10px]"
            style={{ borderRadius: "13px" }}
            placeholder="내용을 입력하세요 (최대 100자)"
          />
        </section>

        {/* 제출 버튼 */}
        <section className="flex justify-center items-center py-[30px]">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-[#FFFFFF] text-[16px] w-[310px] h-[50px] bg-[#729A73]"
            style={{ fontWeight: 600, borderRadius: "10px" }}
          >
            {isSubmitting ? "등록 중..." : "완료"}
          </button>
        </section>
      </div>
    </div>
  );
};

export default ReviewWritting;
