import Vector from "../assets/Vector.png";

interface LicenseFormProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LicenseForm = ({ onFileSelect }: LicenseFormProps) => {
  return (
    <div className="flex flex-col gap-[7px]">
      <label>
        <input
          type="file"
          accept=".pdf, .jpg, .png"
          className="hidden"
          onChange={onFileSelect}
        />
        <div
          className="flex w-full h-[44px] border border-[#555555D9] text-[#555555D9] justify-between items-center px-[15px]"
          style={{ borderRadius: "12px" }}
        >
          <span className="text-[14px]">파일 선택</span>
          <img src={Vector} className="w-[14px] h-[14.9px]" />
        </div>
      </label>

      <p className="text-[13px] text-[#EE0606CC]" style={{ fontWeight: 400 }}>
        첨부 파일은 최대 3개, 30MB까지 등록 가능합니다.
      </p>
    </div>
  );
};

export default LicenseForm;
