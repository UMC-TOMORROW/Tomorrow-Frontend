import checkActive from "../../assets/check_active.png";
import checkInactive from "../../assets/check_inactive.png";

type Props = {
  paymentLabel: string; // 급여 형태 (시급, 건당 등)
  amount: number; // 숫자 (10000)
  negotiable?: boolean;
  onChange: (data: { paymentLabel: string; amount: number; negotiable?: boolean }) => void;
};

const payTypes = ["시급", "건당", "일급", "월급"];

const SalaryInput = ({ paymentLabel, amount, negotiable = false, onChange }: Props) => {
  const formatNumber = (num: number) => {
    if (!num) return "";
    return num.toLocaleString();
  };

  const parseNumber = (str: string) => {
    const num = Number(str.replace(/,/g, ""));
    return isNaN(num) ? 0 : num;
  };

  return (
    <div className="w-full">
      <h2
        style={{ marginBottom: "20px", fontWeight: "600" }}
        className="text-[18px] text-[#333] leading-[100%] font-pretendard"
      >
        급여를 작성해주세요.
      </h2>

      {/* 급여 형태 버튼 */}
      <div className="flex flex-wrap gap-[10px] !mb-3">
        {payTypes.map((type) => {
          const selected = paymentLabel === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ paymentLabel: type, amount, negotiable })}
              className={`px-[10px] py-[4px] rounded-[7px] border-[1px] text-[13px] leading-none whitespace-nowrap transition
                ${
                  selected
                    ? "bg-[#729A73] !text-white border-[#729A73]"
                    : "bg-white text-[#333] border-[#555]/85 hover:border-[#BBB] active:scale-[0.99]"
                }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* 금액 입력 */}
      <div className="relative w-full mb-2">
        <input
          type="text"
          className="w-full h-[44px] border border-[#DEDEDE] rounded-[8px] px-4 text-[16px] text-[#333] !px-3"
          value={formatNumber(amount)}
          onChange={(e) => onChange({ paymentLabel, amount: parseNumber(e.target.value), negotiable })}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333] text-sm">원</span>
      </div>

      {/* 협의 가능 */}
      <div
        className="flex !mt-2 items-center gap-1 text-sm text-[#666] cursor-pointer"
        onClick={() => onChange({ paymentLabel, amount, negotiable: !negotiable })}
      >
        <img
          src={negotiable ? checkActive : checkInactive}
          alt={negotiable ? "선택됨" : "선택 안됨"}
          className="w-4 h-4"
        />
        협의 가능
      </div>
    </div>
  );
};

export default SalaryInput;
