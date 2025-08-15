import { useEffect, useState } from "react";
import { getSavedJobs } from "../../apis/mypage";
import type { BookmarkItem } from "../../types/mypage";
import { useNavigate } from "react-router-dom";

const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<BookmarkItem[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const list = await getSavedJobs();
        setSavedJobs(list);
      } catch (e) {
        console.error("저장한 공고 불러오기 실패:", e);
        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleApplyClick = (bookmarkId: number) => {
    setAppliedJobs((prev) =>
      prev.includes(bookmarkId) ? prev : [...prev, bookmarkId]
    );
  };

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        <section>
          <div
            className="flex justify-center items-center text-[20px] h-[52px] border-b-[1.5px] border-[#DEDEDE]"
            style={{ fontWeight: 700 }}
          >
            저장
          </div>
        </section>

        <div className="flex items-center text-[12px] pl-[20px] h-[34px] border-b border-[#DEDEDE]">
          {loading ? "로딩 중..." : `${savedJobs.length}건`}
        </div>

        {savedJobs.map((bm) => (
          <section key={bm.id}>
            <div className="flex flex-col px-[20px]">
              <div className="flex h-[102px] justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-[12px]">{bm.companyName}</p>
                  <p className="text-[16px]" style={{ fontWeight: 800 }}>
                    {bm.jobTitle}
                  </p>
                  <p className="text-[12px] text-[#729A73]">
                    {new Date(bm.bookmarkedAt).toLocaleString()}
                  </p>
                </div>

                <div
                  className="w-[79px] h-[79px] border cursor-pointer"
                  onClick={() => navigate(`/jobs/${bm.jobId}`)}
                  title="공고 상세로 이동"
                />
              </div>
              <div className="flex px-[15px] h-[1px] w-full bg-white border-b border-[#BFBFBF8C]" />
            </div>

            <div className="flex justify-between items-center border-b border-[#5555558C] h-[43px] px-[20px]">
              <div className="flex">
                {/* 서버가 위치/급여 정보는 안 주므로 생략 또는 상세에서 조회 */}
                <p className="text-[12px]">공고 ID: {bm.jobId}</p>
              </div>
              <div>
                <button
                  onClick={() => handleApplyClick(bm.id)}
                  className={`flex border w-[80px] h-[28px] items-center justify-center text-[14px] ${
                    appliedJobs.includes(bm.id)
                      ? "bg-[#729A73] text-[#FFFFFF] border-transparent"
                      : "border-[#555555D9] text-[#555555D9]"
                  }`}
                  style={{ borderRadius: "5px" }}
                >
                  지원하기
                </button>
              </div>
            </div>
          </section>
        ))}

        {!loading && savedJobs.length === 0 && (
          <p className="text-center mt-8 text-sm text-gray-500">
            저장한 공고가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
