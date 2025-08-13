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
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="bg-white w-[375px] h-[240px] rounded-[16px] flex flex-col justify-between items-center">
        <p
          className="text-center mt-[25px] font-bold text-[22px]"
          style={{ color: palette.primary.primary }}
        >
          맞춤 추천 기능이 제한될 수 있어요.
        </p>
        <p className="text-center text-[16px] text-black mt-2 leading-5">
          모든 응답은 의료 진단이나 치료 목적이 아닌,
          <br />
          서비스 추천을 위한 참고 정보로만 사용됩니다.
        </p>

        <div
          className="w-full"
          style={{ height: "1px", backgroundColor: palette.primary.primary }}
        />

        <div className="flex justify-center mb-[25px] gap-[17px]">
          <button
            onClick={onAccept}
            className="w-[155px] h-[50px] text-[16px] bg-white font-semibold rounded-[15px] border"
            style={{
              borderColor: palette.primary.primary,
              color: palette.primary.primary,
              fontFamily: "Pretendard",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = palette.primary.primary;
              e.currentTarget.style.color = "white";
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
            className="w-[155px] h-[50px] text-[16px] bg-white font-semibold rounded-[15px] border"
            style={{
              borderColor: palette.primary.primary,
              color: palette.primary.primary,
              fontFamily: "Pretendard",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = palette.primary.primary;
              e.currentTarget.style.color = "white";
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
