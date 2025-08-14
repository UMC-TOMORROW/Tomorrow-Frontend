interface CareerFormProps {
  workPlace: string;
  setWorkPlace: (value: string) => void;
  workDescription: string;
  setWorkDescription: (value: string) => void;
  workYear: string;
  setWorkYear: (value: string) => void;
  selectedLabel: string | null;
  setSelectedLabel: (value: string) => void;
  labels: string[];
}

const CareerForm = ({
  workPlace,
  setWorkPlace,
  workDescription,
  setWorkDescription,
  workYear,
  setWorkYear,
  selectedLabel,
  setSelectedLabel,
  labels,
}: CareerFormProps) => {
  return (
    <div className="h-[453px] flex flex-col gap-[30px]">
      <div className="flex flex-col gap-[16px]">
        <p className="text-[16px]" style={{ fontWeight: 700 }}>
          일한 곳
        </p>
        <textarea
          className="w-full h-[44px] border border-[#555555D9] text-[14px] resize-none pl-[10px] py-[10px]"
          style={{ borderRadius: "10px" }}
          value={workPlace}
          onChange={(e) => setWorkPlace(e.target.value)}
        ></textarea>
      </div>
      <div className="flex flex-col gap-[16px]">
        <p className="text-[16px]" style={{ fontWeight: 700 }}>
          했던 일
        </p>
        <textarea
          className="w-full h-[44px] border border-[#555555D9] text-[14px] resize-none pl-[10px] py-[10px]"
          style={{ borderRadius: "10px" }}
          value={workDescription}
          onChange={(e) => setWorkDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="flex flex-col gap-[16px]">
        <p className="text-[16px]" style={{ fontWeight: 700 }}>
          일한 연도
        </p>
        <textarea
          className="w-full h-[44px] border border-[#555555D9] text-[14px] resize-none pl-[10px] py-[10px]"
          placeholder="예. 2025년"
          style={{ borderRadius: "10px" }}
          value={workYear}
          onChange={(e) => setWorkYear(e.target.value)}
        ></textarea>
      </div>
      <div className="flex flex-col gap-[16px]">
        <p className="text-[16px]" style={{ fontWeight: 700 }}>
          일한 기간
        </p>
        <div className="flex flex-wrap gap-[10px]">
          {labels.map((label) => (
            <button
              key={label}
              onClick={() => setSelectedLabel(label)}
              className={`flex items-center justify-center border h-[25px] px-[10px] py-[6px] text-[14px] ${
                selectedLabel === label
                  ? " bg-[#729A73] border-[#729A73] text-[#FFFFFF]"
                  : "border-[#555555D9] text-[#555555D9]"
              }`}
              style={{ borderRadius: "5px" }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerForm;
