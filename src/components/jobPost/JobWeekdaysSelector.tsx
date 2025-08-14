import checkActive from "../../assets/check_active.png";
import checkInactive from "../../assets/check_inactive.png";

const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

type Props = {
  // ✅ 부모 제어형: ["월","수","금"] 같은 한글 요일 배열
  value: string[];
  onChange: (arr: string[]) => void;

  // (옵션) 협의 가능 스위치도 제어형으로 쓰고 싶을 때
  negotiable?: boolean;
  onChangeNegotiable?: (b: boolean) => void;
};

const JobWeekdaysSelector = ({ value, onChange, negotiable, onChangeNegotiable }: Props) => {
  const selectedDays = value ?? [];

  const toggleDay = (day: string) => {
    const next = selectedDays.includes(day) ? selectedDays.filter((d) => d !== day) : [...selectedDays, day];

    console.log("[JobWeekdaysSelector] toggle:", next);
    onChange(next);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <h2
        style={{ margin: "10px 0", fontWeight: "600" }}
        className="text-[18px] text-[#333] leading-[100%] font-pretendard"
      >
        요일 선택
      </h2>

      {/* 요일 버튼 (디자인 그대로) */}
      <div className="flex flex-wrap gap-[10px]">
        {weekdays.map((day) => {
          const selected = selectedDays.includes(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-[10px] py-[4px] rounded-[7px] border-[1px] text-[13px] leading-none whitespace-nowrap transition
                ${
                  selected
                    ? "bg-[#729A73] !text-white !border-[#729A73]"
                    : "bg-white text-[#333] border-[#D9D9D9] hover:border-[#BBB] active:scale-[0.99]"
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 협의 가능 (디자인 그대로, 필요 시 제어형) */}
      <button
        type="button"
        className="flex items-center gap-1 mt-1 text-sm text-[#666]"
        onClick={() => {
          if (typeof negotiable === "boolean" && onChangeNegotiable) {
            onChangeNegotiable(!negotiable);
            console.log("[JobWeekdaysSelector] 협의 토글:", !negotiable);
          }
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

export default JobWeekdaysSelector;
