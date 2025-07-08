import Header from "../components/Header";

const ApplyStatus = () => {
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
          <button className="w-full border-b-4 border-[#729A73] text-[13px]">
            전체
          </button>
          <button className="w-full text-[13px]">합격</button>
        </section>
        <div className="flex text-[13px] items-center pl-[20px] h-[36px] border-b border-[#5555558C]">
          3건
        </div>
        <ul>
          <li className="flex items-center justify-between h-[129px] px-[20px] mt-[18px] border-b border-[#5555558C]">
            <div>
              <p className="text-[12px]">2025.06.01</p>
              <p className="text-[12px]">(주) 내일</p>
              <p className="text-[14px]" style={{ fontWeight: 800 }}>
                사무 보조 (문서 스캔 및 정리)
              </p>
              <p className="text-[12px] text-[#729A73]">
                앉아서 근무 중심, 반복 손작업 포함
              </p>
            </div>
            <div className="w-[79px] h-[79px] bg-gray-300"></div>
          </li>

          <li className="flex items-center justify-between h-[129px] px-[20px] mt-[18px] border-b border-[#5555558C]">
            <div>
              <p className="text-[12px]">2025.06.01</p>
              <p className="text-[12px]">내일도서관</p>
              <p className="text-[14px]" style={{ fontWeight: 800 }}>
                도서 정리 및 대출 보조
              </p>
              <p className="text-[12px] text-[#729A73]">
                가벼운 물건 운반, 손이나 팔을 자주 사용하는 작업
              </p>
            </div>
            <div className="w-[79px] h-[79px] bg-gray-300"></div>
          </li>

          <li className="flex items-center justify-between h-[129px] px-[20px] mt-[18px] border-b border-[#5555558C]">
            <div>
              <p className="text-[12px]">2025.06.10</p>
              <p className="text-[12px]">내일텃밭</p>
              <p className="text-[14px]" style={{ fontWeight: 800 }}>
                텃밭 관리 도우미
              </p>
              <p className="text-[12px] text-[#729A73]">
                가벼운 물건 운반, 손이나 팔을 자주 사용하는 작업
              </p>
            </div>
            <div className="w-[79px] h-[79px] bg-gray-300"></div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ApplyStatus;
