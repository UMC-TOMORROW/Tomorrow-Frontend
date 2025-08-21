import { useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";

interface LicenseItemProps {
  fileUrl: string;
  filename: string;
  onDelete: () => void;
  isPending?: boolean;
}

const LicenseItem: React.FC<LicenseItemProps> = ({
  fileUrl,
  filename,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const src = fileUrl;

  return (
    <div
      className="relative flex border border-[#729A73] h-[145px] p-[10px]"
      style={{ borderRadius: 12 }}
    >
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className="absolute text-[14px] text-[#729A73] top-[10px] right-[10px]"
        style={{ fontWeight: 600 }}
        aria-label="자격증 옵션"
      >
        <SlOptionsVertical />
      </button>

      <div className="flex flex-col w-full gap-[5px] mr-[10px] overflow-y-auto">
        <img
          src={src}
          alt={filename || "자격증"}
          className="h-[89px] w-full object-contain"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <div className="flex items-center">
          <p className="text-[14px]" style={{ fontWeight: 400 }}>
            {filename}
          </p>
        </div>
      </div>

      {menuOpen && (
        <div
          className="absolute flex flex-col w-[43px] h-[32px] bg-[#EDEDED] items-center justify-center right-[25px] top-[8px] z-10"
          style={{ borderRadius: 5 }}
        >
          <button
            type="button"
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
