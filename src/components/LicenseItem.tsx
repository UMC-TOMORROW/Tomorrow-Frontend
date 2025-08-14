import { useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";

interface LicenseItemProps {
  fileUrl: string;
  filename: string;
  onDelete: () => void;
  isPending?: boolean;
}

const placeholder =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='160'>
      <rect width='100%' height='100%' fill='#f6f6f6'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        fill='#9aa0a6' font-family='sans-serif' font-size='20'>미리보기</text>
    </svg>`
  );

const LicenseItem: React.FC<LicenseItemProps> = ({
  fileUrl,
  filename,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const src = fileUrl?.trim() ? fileUrl : placeholder;

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
          onError={(e) => {
            const t = e.currentTarget;
            if (t.src !== placeholder) t.src = placeholder;
          }}
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
