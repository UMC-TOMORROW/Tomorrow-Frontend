import palette from "../../styles/theme";

const OnboardingSkipModal = ({
  onClose,
  onAccept,
}: {
  onClose: () => void;
  onAccept: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center"
      style={{
        fontFamily: "Pretendard",
        backgroundColor: "rgba(0, 0, 0, 0.3)", // ✅ 검은색이 아닌 불투명 회색 배경
      }}
    >
      <div
        className="bg-white rounded-[16px] flex flex-col justify-between items-center px-[24px] py-[20px]"
        style={{ width: "375px", height: "240px" }}
      >
        <p
          className="text-center font-bold text-[18px]"
          style={{ color: palette.primary.primary }}
        >
          맞춤 추천 기능이 제한될 수 있어요.
        </p>
        <p className="text-center text-[14px] text-[#000000] mt-2 leading-5">
          건강 정보에 따라 더 잘 맞는 일자리를 추천해드릴 수 있지만,
          <br />
          지금 건너뛰셔도 괜찮습니다.
        </p>

        {/* ✅ 구분선: 완전한 너비 + 적절한 여백 */}
        <div
          className="w-full mt-4 mb-2"
          style={{ height: "1px", backgroundColor: palette.primary.primary }}
        />

        <div className="flex justify-between gap-3 w-full">
          <button
            onClick={onAccept}
            className="flex-1 h-[44px] text-[16px] font-semibold rounded-full border"
            style={{
              borderColor: palette.primary.primary,
              backgroundColor: "white",
              color: palette.primary.primary,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = palette.primary.primary;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = palette.primary.primary;
            }}
          >
            맞춤 추천 받기
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-[44px] text-[16px] font-semibold rounded-full border"
            style={{
              borderColor: palette.primary.primary,
              backgroundColor: "white",
              color: palette.primary.primary,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = palette.primary.primary;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = palette.primary.primary;
            }}
          >
            다음에 할게요
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSkipModal;
