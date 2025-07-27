import { useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

const ManageMyJobs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"모집중" | "모집완료">("모집중");

  const jobList = [
    {
      date: "2025.06.01",
      company: "(주) 내일",
      title: "사무 보조 (문서 스캔 및 정리)",
      status: "모집중",
      tags: ["앉아서 근무 중심", "반복 손작업 포함"],
    },
    {
      date: "2025.06.01",
      company: "내일도서관",
      title: "도서 정리 및 대출 보조",
      status: "모집중",
      tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
    },
    {
      date: "2025.06.10",
      company: "내일텃밭",
      title: "텃밭 관리 도우미",
      status: "모집중",
      tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
    },
    {
      date: "2025.06.01",
      company: "(주) 내일",
      title: "사무 보조 (문서 스캔 및 정리)",
      status: "모집완료",
      tags: ["앉아서 근무 중심", "반복 손작업 포함"],
    },
    {
      date: "2025.06.01",
      company: "내일도서관",
      title: "도서 정리 및 대출 보조",
      status: "모집완료",
      tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
    },
    {
      date: "2025.06.10",
      company: "내일텃밭",
      title: "텃밭 관리 도우미",
      status: "모집완료",
      tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
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
            내 공고 관리
          </div>
        </section>
        <section className="flex justify-around items-center h-[36px]">
          <button
            onClick={() => setActiveTab("모집중")}
            className={`w-full text-[13px] ${
              activeTab === "모집중" ? "border-b-3 border-[#729A73]" : ""
            }`}
          >
            모집중
          </button>
          <button
            onClick={() => setActiveTab("모집완료")}
            className={`w-full text-[13px] ${
              activeTab === "모집완료" ? "border-b-3 border-[#729A73]" : ""
            }`}
          >
            모집 완료
          </button>
        </section>
        <div className="flex text-[13px] items-center pl-[20px] h-[36px] border-b border-[#5555558C]">
          {filteredJobs.length}건
        </div>
        <ul>
          {filteredJobs.map((job, index) => (
            <div key={index} onClick={() => navigate("/MyPage/ApplicantList")}>
              <div className="h-[25px]"></div>
              <p className="flex items-end text-[12px] px-[20px] h-[25px]">
                {job.date}
              </p>

              <li className="flex items-center justify-between h-[104px] px-[20px] border-b border-[#5555558C]">
                <div>
                  <p className="text-[12px]">{job.company}</p>
                  <div className="flex gap-[10px]">
                    <p className="text-[14px]" style={{ fontWeight: 800 }}>
                      {job.title}
                    </p>
                    <div
                      className={`flex items-center justify-center h-[19px] text-[11px] bg-[#D9D9D9] text-[#729A73] ${
                        job.status === "모집중"
                          ? "w-[36px] text-[#729A73]"
                          : "w-[45px] text-[#EE0606CC]"
                      }`}
                      style={{ fontWeight: 600, borderRadius: "5px" }}
                    >
                      {job.status}
                    </div>
                  </div>
                  <p className="text-[12px] text-[#729A73]">
                    {job.tags.join(", ")}
                  </p>
                </div>
                <div className="w-[79px] h-[79px] bg-gray-300"></div>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageMyJobs;
