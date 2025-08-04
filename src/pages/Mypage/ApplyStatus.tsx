import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ApplyStatus = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"" | "합격">("");

  const jobList = [
    {
      date: "2025.06.01",
      company: "(주) 내일",
      title: "사무 보조 (문서 스캔 및 정리)",
      tags: ["앉아서 근무 중심", "반복 손작업 포함"],
      status: "",
    },
    {
      date: "2025.06.01",
      company: "내일도서관",
      title: "도서 정리 및 대출 보조",
      tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
      status: "",
    },
    {
      date: "2025.06.10",
      company: "내일텃밭",
      title: "텃밭 관리 도우미",
      tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
      status: "",
    },
    {
      date: "2025.06.01",
      company: "내일도서관",
      title: "도서 정리 및 대출 보조",
      tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
      status: "합격",
    },
    {
      date: "2025.06.10",
      company: "내일텃밭",
      title: "텃밭 관리 도우미",
      tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
      status: "합격",
    },
  ];

  const filteredJobs = jobList.filter((job) => job.status === activeTab);

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        <section>
          <div
            className="flex justify-center items-center text-[20px] h-[52px] border-b border-[#DEDEDE]"
            style={{ fontWeight: 700 }}
          >
            지원현황
          </div>
        </section>
        <section className="flex justify-around items-center h-[45px]">
          <button
            style={{ fontWeight: 500 }}
            onClick={() => setActiveTab("")}
            className={`w-full text-[16px] ${
              activeTab === "" ? "border-b-3 border-[#729A73]" : ""
            }`}
          >
            전체
          </button>
          <button
            style={{ fontWeight: 500 }}
            onClick={() => setActiveTab("합격")}
            className={`w-full text-[16px] ${
              activeTab === "합격" ? "border-b-3 border-[#729A73]" : ""
            }`}
          >
            합격
          </button>
        </section>
        <div className="flex text-[12px] items-center pl-[20px] h-[34px] border-b border-[#DEDEDE]">
          {filteredJobs.length}건
        </div>
        <ul>
          {filteredJobs.map((job, index) => (
            <div key={index}>
              <li>
                <div className="px-[15px] h-[18px] w-full bg-white"></div>
                <div className="flex items-center justify-between h-[104px] px-[20px]">
                  <div>
                    <p className="flex items-end text-[14px]">{job.date}</p>
                    <p className="text-[14px]">{job.company}</p>
                    <p className="text-[16px]" style={{ fontWeight: 800 }}>
                      {job.title}
                    </p>
                    <p className="text-[14px] text-[#729A73]">
                      {job.tags.join(", ")}
                    </p>
                  </div>
                  <div className="w-[79px] h-[79px] bg-gray-300"></div>
                </div>
              </li>
              {activeTab === "합격" ? (
                <div>
                  <button
                    className="w-full px-[15px]"
                    onClick={() => navigate("/MyPage/ReviewWritting")}
                  >
                    <div className="h-[13px] w-full bg-white border-t border-[#729A73]"></div>
                    <div
                      className="text-[15px] text-[#333333]"
                      style={{ fontWeight: 700 }}
                    >
                      후기 작성하기
                    </div>
                    <div className="h-[13px] w-full bg-white border-b border-[#729A73]"></div>
                  </button>
                </div>
              ) : (
                <div className="px-[15px]">
                  <div className="h-[20px] w-full bg-white border-b border-[#DEDEDE]"></div>
                </div>
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ApplyStatus;
