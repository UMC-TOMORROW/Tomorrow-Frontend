import { useEffect, useState } from "react";
import { getSavedJobs } from "../../apis/mypage";
import type { savedJobs as SavedJobType } from "../../types/mypage";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJobType[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getSavedJobs();
        setSavedJobs(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("저장한 공고 불러오기 실패:", e);
        setSavedJobs([]);
      }
    };
    load();
  }, []);

  const handleApplyClick = (index: number) => {
    setAppliedJobs((prev) => (prev.includes(index) ? prev : [...prev, index]));
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
          {savedJobs.length}건
        </div>

        {savedJobs.map((job, index) => {
          const stars =
            typeof job.rating === "number" ? job.rating.toFixed(1) : undefined;
          const period = "";
          return (
            <section key={index}>
              <div className="flex flex-col px-[20px]">
                <div className="flex h-[102px] justify-between items-center">
                  <div className="flex flex-col">
                    <p className="text-[12px]">{job.company}</p>
                    <p className="text-[16px]" style={{ fontWeight: 800 }}>
                      {job.title}
                    </p>
                    <p className="text-[12px] text-[#729A73]">
                      {(job.tags ?? []).join(", ")}
                    </p>
                    <p className="text-[12px] text-[#555555D9]">
                      {period}
                      {stars && (
                        <span className="text-[#000000] ml-[10px]">
                          ★{stars}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="w-[79px] h-[79px] border border-[#2121210]"></div>
                </div>
                <div className="flex px-[15px] h-[1px] w-full bg-white border-b border-[#BFBFBF8C]"></div>
              </div>

              <div className="flex justify-between items-center border-b border-[#5555558C] h-[43px] px-[20px]">
                <div className="flex">
                  <p className="text-[12px]">{job.location}</p>
                  <p className="text-[12px] ml-[10px]">{job.wage}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleApplyClick(index)}
                    className={`flex border w-[80px] h-[28px] items-center justify-center text-[14px] ${
                      appliedJobs.includes(index)
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
          );
        })}

        <section></section>
      </div>
    </div>
  );
};

export default SavedJobs;
