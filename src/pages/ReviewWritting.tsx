import Header from "../components/Header";
import { SlArrowLeft } from "react-icons/sl";
import star_empty from "../assets/star/star_empty.png";
import star_filled from "../assets/star/star_filled.png";

const ReviewWritting = () => {
  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <Header title="내일" />

      <div className="mt-[50px] bg-white min-h-screen">
        <section className="flex items-center h-[40px] border-b border-[#5555558C]">
          <SlArrowLeft className="ml-[20px]" />
          <div
            className="flex justify-center items-center text-[15px]"
            style={{ fontWeight: 700 }}
          >
            후기 작성
          </div>
        </section>
        <section className="flex items-center h-[50px] border-b border-[#5555558C]">
          <p
            className="ml-[25px] text-[15px] text-[#729A73]"
            style={{ fontWeight: 700 }}
          >
            텃밭 관리 도우미
          </p>
        </section>
        <section className="flex flex-col justify-center gap-[28px] items-center h-[145px] border-b border-[#5555558C]">
          <p className="text-[15px]" style={{ fontWeight: 600 }}>
            이번 일, 몸과 마음은 어떠셨나요?
          </p>
          <div className="flex gap">
            <img className="w-[40px] h-[40px]" src={star_filled} />
            <img className="w-[40px] h-[40px]" src={star_filled} />
            <img className="w-[40px] h-[40px]" src={star_filled} />
            <img className="w-[40px] h-[40px]" src={star_empty} />
            <img className="w-[40px] h-[40px]" src={star_empty} />
          </div>
        </section>
        <section className="flex flex-col justify-center items-center gap-[15px] h-[430px] border-b">
          <p className="text-[15px]">
            어떤 점이 좋았거나 아쉬웠는지 간단히 작성해 주세요.
          </p>
          <textarea className="rounded-xl w-[360px] h-[324px] bg-[#D9D9D980]" />
        </section>
      </div>
    </div>
  );
};

export default ReviewWritting;
