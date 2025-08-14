import checkActive from "../../assets/check_active.png";
import checkInactive from "../../assets/check_inactive.png";

const periods = ["단기", "1개월 이상", "3개월 이상", "6개월 이상", "1년 이상"];

type Props = {
  periodLabel: string; // 예: "1년 이상" (없으면 "")
  onChangeLabel: (v: string) => void; // 기간 버튼 클릭 시 호출
  negotiable: boolean; // 협의 가능 여부
  onChangeNegotiable: (b: boolean) => void; // 협의 버튼 클릭 시 호출
};

const JobPeriodSelector = ({ periodLabel, onChangeLabel, negotiable, onChangeNegotiable }: Props) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <h2
        style={{ marginBottom: "25px", fontWeight: "700" }}
        className="text-[18px] text-[#333] leading-[100%] font-pretendard"
      >
        일하는 기간을 작성해주세요.
      </h2>

      <div className="flex flex-wrap gap-[10px]">
        {periods.map((period) => {
          const selected = periodLabel === period; // ✅ 부모값으로만 선택 상태 판단
          return (
            <button
              key={period}
              type="button"
              onClick={() => {
                // 같은 버튼 다시 눌러도 그대로 유지 (필요하면 토글로 변경 가능)
                console.log("[JobPeriodSelector] click:", period);
                onChangeLabel(period);
              }}
              className={`px-[10px] py-[4px] rounded-[7px] border-[1px] text-[13px] leading-none whitespace-nowrap transition
          ${
            selected
              ? "bg-[#729A73] !text-white border-[#729A73]"
              : "bg-white text-[#333] border-[#D9D9D9] hover:border-[#BBB] active:scale-[0.99]"
          }`}
            >
              {period}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="flex items-center gap-1 mt-1 text-sm text-[#666]"
        onClick={() => {
          console.log("[JobPeriodSelector] 협의 토글:", !negotiable);
          onChangeNegotiable(!negotiable);
        }}
      >
        <img
          src={negotiable ? checkActive : checkInactive}
          alt={negotiable ? "선택됨" : "선택 안됨"}
          className="w-4 h-4"
        />
        협의 가능
      </button>
    </div>
  );
};

export default JobPeriodSelector;
