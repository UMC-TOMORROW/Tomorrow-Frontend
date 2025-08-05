import { useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";

interface LicenseItemProps {
  file: File;
  onDelete: () => void;
}

const LicenseItem: React.FC<LicenseItemProps> = ({ file, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="relative flex border border-[#729A73] h-[145px] p-[10px]"
      style={{ borderRadius: "12px" }}
    >
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute text-[13px] text-[#729A73] top-[10px] right-[10px]"
        style={{ fontWeight: 600 }}
      >
        <SlOptionsVertical />
      </button>
      <div className="flex flex-col w-full gap-[4px]">
        <img src={URL.createObjectURL(file)} className="h-[89px]" />
        <p className="text-[14px]" style={{ fontWeight: 400 }}>
          {file.name}
        </p>
      </div>

      {menuOpen && (
        <div
          className="absolute flex flex-col w-[43px] h-[32px] bg-[#EDEDED] items-center justify-center gap-[10px] right-[20px] z-10"
          style={{ borderRadius: "8px" }}
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

export default LicenseItem;
