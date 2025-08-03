interface CareerItemProps {
  workPlace: string;
  workYear: string;
  selectedLabel: string;
  workDescription: string;
}

const CareerItem: React.FC<CareerItemProps> = ({
  workPlace,
  workYear,
  selectedLabel,
  workDescription,
}) => {
  return (
    <div
      className="flex flex-col text-[14px] h-[92px] border border-[#729A73] p-[10px] overflow-y-auto"
      style={{ borderRadius: "12px", maxHeight: "92px" }}
    >
      <div className="flex flex-col pl-[8px] gap-[5px]">
        <p className="text-[14px]" style={{ fontWeight: 800 }}>
          {workPlace}
        </p>
        <p className="text-[14px] text-[#555555D9]" style={{ fontWeight: 400 }}>
          {workYear}/{selectedLabel}
        </p>
        <p className="text-[14px]" style={{ fontWeight: 400 }}>
          {workDescription}
        </p>
      </div>
    </div>
  );
};

export default CareerItem;
