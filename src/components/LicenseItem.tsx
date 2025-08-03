interface LicenseItemProps {
  file: File;
}

const LicenseItem: React.FC<LicenseItemProps> = ({ file }) => {
  return (
    <div>
      <div
        className="flex flex-col w-full h-[145px] border border-[#729A73] p-[15px] gap-[4px]"
        style={{ borderRadius: "12px" }}
      >
        <img src={URL.createObjectURL(file)} className="h-[89px]" />
        <p className="text-[14px]" style={{ fontWeight: 400 }}>
          {file.name}
        </p>
      </div>
    </div>
  );
};

export default LicenseItem;
