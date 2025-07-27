import palette from "../../styles/theme";

interface CommonSectionHeaderProps {
  label: string;
  className?: string;
}

function CommonSectionHeader({
  label,
  className = "",
}: CommonSectionHeaderProps) {
  return (
    <div
      className={`
    w-full
    border-t border-b
    text-[20px]
    ${className}
  `}
      style={{
        fontFamily: "Hakgyoansim Mulgyeol", // 폰트 설정
        backgroundColor: "#fff",
        borderTopColor: "#ccc",
        borderBottomColor: "#ccc",
        borderTopStyle: "solid",
        borderBottomStyle: "solid",
        color: palette.primary.primary, // 폰트 색상
        height: "50px",
        lineHeight: "50px",
        textAlign: "center",
      }}
    >
      {label}
    </div>
  );
}

export default CommonSectionHeader;
