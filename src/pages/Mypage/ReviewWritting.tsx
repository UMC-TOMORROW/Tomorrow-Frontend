import { SlArrowLeft } from "react-icons/sl";
import star_empty from "../../assets/star_empty.png";
import star_filled from "../../assets/star_filled.png";
import { useState } from "react";

const ReviewWritting = () => {
  const [rating, setRating] = useState(3);

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        <section className="relative flex justify-center items-center h-[52px] border-b-[1.5px] border-[#DEDEDE8C]">
          <SlArrowLeft className="absolute left-[15px] " />
          <div className="text-[20px]" style={{ fontWeight: 700 }}>
            후기 작성
          </div>
        </section>
        <section className="flex items-center h-[50px] border-b border-[#DEDEDE8C]">
          <p
            className="ml-[25px] text-[16px] text-[#729A73]"
            style={{ fontWeight: 700 }}
          >
            텃밭 관리 도우미
          </p>
        </section>
        <section className="flex flex-col justify-center gap-[30px] items-center h-[145px] border-b border-[#DEDEDE8C]">
          <p className="text-[16px]" style={{ fontWeight: 600 }}>
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
        <section className="flex flex-col justify-center items-center gap-[30px] p-[20px] h-[334px]">
          <p className="text-[16px]">
            어떤 점이 좋았거나 아쉬웠는지 간단히 작성해 주세요.
          </p>
          <textarea
            className="w-[295px] h-[220px] bg-[#D9D9D980] resize-none overflow-hidden overflow-y-scroll p-[10px]"
            style={{ borderRadius: "13px" }}
          />
        </section>
        <section className="flex justify-center items-center py-[30px]">
          <button
            className="text-[#FFFFFF] text-[16px] w-[310px] h-[50px] bg-[#729A73]"
            style={{ fontWeight: 600, borderRadius: "10px" }}
          >
            완료
          </button>
        </section>
      </div>
    </div>
  );
};

export default ReviewWritting;
