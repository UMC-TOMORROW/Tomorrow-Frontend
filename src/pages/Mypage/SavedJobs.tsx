// src/pages/Mypage/SavedJobs.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSavedJobs } from "../../apis/mypage";
import type { BookmarkItem } from "../../types/mypage";

const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const list = await getSavedJobs();
        setSavedJobs(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("저장한 공고 불러오기 실패:", e);
        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        {/* 헤더 */}
        <section>
          <div
            className="flex justify-center items-center text-[20px] h-[52px] border-b-[1.5px] border-[#DEDEDE]"
            style={{ fontWeight: 700 }}
          >
            저장
          </div>
        </section>

        {/* 건수 */}
        <div className="flex items-center text-[12px] pl-[20px] h-[34px] border-b border-[#DEDEDE]">
          {loading ? "로딩 중..." : `${savedJobs.length}건`}
        </div>

        {/* 리스트 */}
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

                {/* 썸네일 클릭 시 상세 이동 */}
                <div
                  className="w-[79px] h-[79px] border cursor-pointer"
                  onClick={() => navigate(`/jobs/${bm.jobId}`)}
                  title="공고 상세로 이동"
                />
              </div>

              <div className="flex px-[15px] h-[1px] w-full bg-white border-b border-[#BFBFBF8C]" />
            </div>

            {/* 하단 액션 바 */}
            <div className="flex justify-end items-center border-b border-[#5555558C] h-[43px] px-[20px]">
              <Link
                to={`/jobs/${bm.jobId}`}
                className="w-[80px] h-[28px] text-[14px] mt-1 border rounded-[7px] transition-colors duration-200 flex items-center justify-center text-[#555555D9] hover:bg-[#729A73] hover:text-white hover:border-[#729A73]"
                style={{ fontFamily: "Pretendard", borderColor: "#555555D9" }}
                role="button"
              >
                지원하기
              </Link>
            </div>
          </section>
        ))}

        {/* 빈 상태 */}
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
