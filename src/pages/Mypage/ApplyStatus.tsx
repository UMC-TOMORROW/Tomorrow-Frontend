import { useState } from "react";
import Header from "../../components/Header";
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
      <Header title="내일" />

      <div className="mt-[50px] bg-white min-h-screen">
        <section>
          <div
            className="flex justify-center items-center text-[15px] h-[38px] border-b border-[#5555558C]"
            style={{ fontWeight: 700 }}
          >
            지원현황
          </div>
        </section>
        <section className="flex justify-around items-center h-[36px]">
          <button
            onClick={() => setActiveTab("")}
            className={`w-full text-[13px] ${
              activeTab === "" ? "border-b-3 border-[#729A73]" : ""
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setActiveTab("합격")}
            className={`w-full text-[13px] ${
              activeTab === "합격" ? "border-b-3 border-[#729A73]" : ""
            }`}
          >
            합격
          </button>
        </section>
        <div className="flex text-[13px] items-center pl-[20px] h-[36px] border-b border-[#5555558C]">
          {filteredJobs.length}건
        </div>
        <ul>
          {filteredJobs.map((job, index) => (
            <div key={index}>
              <div className="h-[25px]"></div>
              <p className="flex items-end text-[12px] px-[20px] h-[25px]">
                {job.date}
              </p>

              <li className="flex items-center justify-between h-[104px] px-[20px] border-b border-[#5555558C]">
                <div>
                  <p className="text-[12px]">{job.company}</p>
                  <p className="text-[14px]" style={{ fontWeight: 800 }}>
                    {job.title}
                  </p>
                  <p className="text-[12px] text-[#729A73]">
                    {job.tags.join(", ")}
                  </p>
                </div>
                <div className="w-[79px] h-[79px] bg-gray-300"></div>
              </li>
              {activeTab === "합격" && (
                <button
                  onClick={() => navigate("/MyPage/ReviewWritting")}
                  className="w-full h-[45px] border-b text-[15px] text-[#555555D9] border-[#5555558C]"
                  style={{ fontWeight: 700 }}
                >
                  후기 작성하기
                </button>
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ApplyStatus;
