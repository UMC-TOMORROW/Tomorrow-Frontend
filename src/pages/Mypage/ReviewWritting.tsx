import Header from "../../components/Header";
import { SlArrowLeft } from "react-icons/sl";
import star_empty from "../../assets/star/star_empty.png";
import star_filled from "../../assets/star/star_filled.png";
import { useState } from "react";

const ReviewWritting = () => {
  const [rating, setRating] = useState(3);

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <Header title="내일" />

      <div className="mt-[50px] bg-white min-h-screen">
        <section className="relative flex justify-center items-center h-[40px] border-b border-[#5555558C]">
          <SlArrowLeft className="absolute left-[15px] " />
          <div className="text-[15px]" style={{ fontWeight: 700 }}>
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
          <div className="flex gap-[2px]">
            {[0, 1, 2, 3, 4].map((index) => (
              <img
                key={index}
                className="w-[40px] h-[40px] cursor-pointer"
                src={index < rating ? star_filled : star_empty}
                onClick={() => handleStarClick(index)}
                alt={`star-${index + 1}`}
              />
            ))}
          </div>
        </section>
        <section className="flex flex-col justify-center items-center gap-[15px] h-[430px]">
          <p className="text-[15px]">
            어떤 점이 좋았거나 아쉬웠는지 간단히 작성해 주세요.
          </p>
          <textarea className="rounded-xl w-[360px] h-[324px] bg-[#D9D9D980] resize-none overflow-hidden overflow-y-scroll p-[10px]" />
        </section>
        <section className="flex justify-center items-center py-[30px]">
          <button
            className="text-[#FFFFFF] text-[16px] w-[333px] h-[50px] rounded-full bg-[#729A73]"
            style={{ fontWeight: 600 }}
          >
            완료
          </button>
        </section>
      </div>
    </div>
  );
};

export default ReviewWritting;
