import { useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";

interface CareerItemProps {
  workPlace: string;
  workYear: string;
  selectedLabel: string;
  workDescription: string;
  onDelete: () => void;
}

const CareerItem: React.FC<CareerItemProps> = ({
  workPlace,
  workYear,
  selectedLabel,
  workDescription,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="relative flex text-[14px] h-[92px] border border-[#729A73] p-[10px] mb-[10px]"
      style={{ borderRadius: "12px", maxHeight: "92px" }}
    >
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute text-[13px] text-[#729A73] top-[10px] right-[10px]"
        style={{ fontWeight: 600 }}
      >
        <SlOptionsVertical />
      </button>
      <div className="flex flex-col w-full mr-[10px] pl-[8px] gap-[5px] overflow-y-auto">
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

      {menuOpen && (
        <div
          className="flex flex-col w-[43px] h-[32px] bg-[#EDEDED] items-center justify-center gap-[10px] absolute right-[25px] z-10"
          style={{ borderRadius: "5px" }}
        >
          <button
            onClick={onDelete}
            className="text-[12px] text-[#EE0606CC]"
            style={{ fontWeight: 600 }}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default CareerItem;
