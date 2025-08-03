import { useState } from "react";
import Header from "../../components/Header";

const savedJobs = [
  {
    company: "(주) 내일",
    title: "사무 보조 (문서 스캔 및 정리)",
    tags: ["앉아서 근무 중심", "반복 손작업 포함"],
    period: "시간협의, 3개월 이상",
    stars: "후기 3건",
    location: "서울 강남구",
    pay: "시 11,000원",
  },
  {
    company: "내일도서관",
    title: "도서 정리 및 대출 보조",
    tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
    period: "시간협의, 6개월 이상",
    stars: "후기 15건",
    location: "서울 서초구",
    pay: "시 11,000원",
  },
  {
    company: "내일 텃밭",
    title: "텃밭 관리 도우미",
    tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
    period: "시간협의, 3개월 이상",
    location: "서울 강서구",
    pay: "시 13,000원",
  },
  {
    company: "내일복지센터",
    title: "조리 보조 (단체 급식 준비)",
    tags: ["서서 근무 중심", "손이나 팔을 자주 사용하는 작업"],
    period: "시간협의, 1개월~3개월",
    location: "서울 강동구",
    pay: "시 13,000원",
  },
];

const SavedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);

  const handleApplyClick = (index: number) => {
    setAppliedJobs((prev) => (prev.includes(index) ? prev : [...prev, index]));
  };

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <Header title="내일" />

      <div className="mt-[50px] bg-white min-h-screen">
        <section>
          <div
            className="flex justify-center items-center text-[15px] h-[38px] border-b border-[#5555558C]"
            style={{ fontWeight: 700 }}
          >
            저장
          </div>
        </section>
        <div className="flex items-center text-[13px] pl-[10px] h-[36px] border-b border-[#5555558C]">
          {savedJobs.length}건
        </div>

        {savedJobs.map((job, index) => (
          <section key={index}>
            <div className="flex border-b border-[#5555558C] h-[102px] px-[20px] justify-between items-center">
              <div className="flex flex-col">
                <p className="text-[12px]">{job.company}</p>
                <p className="text-[16px]" style={{ fontWeight: 800 }}>
                  {job.title}
                </p>
                <p className="text-[12px] text-[#729A73]">
                  {job.tags.join(", ")}
                </p>
                <p className="text-[12px] text-[#555555D9]">
                  {job.period}
                  {job.stars && (
                    <span className="text-[#000000] ml-[10px]">
                      ★{job.stars}
                    </span>
                  )}
                </p>
              </div>
              <div className="w-[79px] h-[79px] border border-[#2121210]"></div>
            </div>
            <div className="flex justify-between items-center border-b border-[#5555558C] h-[43px] px-[20px]">
              <div className="flex">
                <p className="text-[12px]">{job.location}</p>
                <p className="text-[12px] ml-[10px]">{job.pay}</p>
              </div>
              <div className="">
                <button
                  onClick={() => handleApplyClick(index)}
                  className={`flex border w-[75px] h-[28px] items-center justify-center text-[14px] ${
                    appliedJobs.includes(index)
                      ? "bg-[#729A73] text-[#FFFFFF]"
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

        <section></section>
      </div>
    </div>
  );
};

export default SavedJobs;
