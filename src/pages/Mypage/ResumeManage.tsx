import Header from "../../components/Header";
import settings from "../../assets/settings.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ResumeManage = () => {
  const navigate = useNavigate();
  const [selfIntro, setSelfIntro] = useState("");
  const [showSelfIntroBox, setShowSelfIntroBox] = useState(false);
  const [workPlace, setWorkPlace] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [workYear, setWorkYear] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [showCareerBox, setShowCareerBox] = useState(false);

  const handleSaveResume = () => {
    if (selfIntro.trim()) setShowSelfIntroBox(true);
    if (workPlace && workDescription && workYear && selectedLabel)
      setShowCareerBox(true);
  };

  const labels = [
    "단기",
    "3개월 이하",
    "6개월 이하",
    "6개월~1년",
    "1년~2년",
    "2년~3년",
    "3년 이상",
  ];

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <Header title="내일" />

      <div className="mt-[50px] bg-white min-h-screen">
        <section>
          <div
            className="flex justify-center items-center text-[15px] h-[38px] border-b border-[#5555558C]"
            style={{ fontWeight: 700 }}
          >
            이력서 관리
          </div>
        </section>
        <section className="flex items-center justify-between px-[20px] py-[15px] h-[110px]">
          <div className="flex items-center gap-4">
            <div className="w-[60px] h-[60px] rounded-full bg-gray-200" />
            <div>
              <p className="text-[18px]" style={{ fontWeight: 800 }}>
                이내일
              </p>
              <p className="text-[13px]">010-1234-5678</p>
            </div>
          </div>
          <div
            onClick={() => navigate("/MyPage/MemberInfo")}
            className="flex gap-1 text-[13px] text-[#707070]"
          >
            <img src={settings} />
            회원 정보
          </div>
        </section>

        <div className="px-[15px]">
          <div className="h-[10px] w-full bg-white border-b border-[#55555526]"></div>
          <div className="h-[10px] w-full bg-white "></div>
        </div>

        <div>
          {!showSelfIntroBox ? (
            <div className="flex flex-col p-[15px] h-[284px] gap-[16px]">
              <p className="text-[18px]" style={{ fontWeight: 800 }}>
                자기소개
              </p>
              <p className="text-[15px]" style={{ fontWeight: 700 }}>
                간단한 자기소개를 남겨주세요.
              </p>
              <p className="text-[12px]">
                경험, 성격, 일에 대한 생각을 남겨주시면 <br />
                구인자가 더 잘 이해할 수 있어요.
              </p>
              <textarea
                className="w-full h-[98px] border border-[#729A73] pb-[10px] text-[12px] resize-none p-[10px]"
                style={{ borderRadius: "12px" }}
                value={selfIntro}
                onChange={(e) => setSelfIntro(e.target.value)}
              ></textarea>
              <p className="text-[12px] text-[#EE0606CC]">
                100자 이내로 작성해주세요.
              </p>
            </div>
          ) : (
            <div className="flex flex-col p-[15px] h-[145px] gap-[5px]">
              <p className="text-[18px]" style={{ fontWeight: 800 }}>
                자기소개
              </p>
              <div className="flex flex-col h-[85px] gap-[9px]">
                <button
                  className="flex text-[13px] text-[#729A73] justify-end underline"
                  style={{ fontWeight: 600 }}
                >
                  수정
                </button>
                <p
                  className="w-full h-[59px] text-[12px] p-[5px] border border-[#729A73] bg-[#B8CDB9BF]"
                  style={{ borderRadius: "12px" }}
                >
                  {selfIntro}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-[15px]">
          <div className="h-[10px] w-full bg-white border-b border-[#55555526]"></div>
          <div className="h-[10px] w-full bg-white"></div>
        </div>

        {!showCareerBox ? (
          <div className="flex flex-col h-[529px] px-[15px] py-[15px] gap-[16px]">
            <p className="text-[18px]" style={{ fontWeight: 800 }}>
              경력
            </p>
            <p className="text-[15px]" style={{ fontWeight: 700 }}>
              일한 곳
            </p>
            <textarea
              className="w-full h-[51px] border border-[#729A73] text-[11px] resize-none pl-[10px] py-[10px]"
              placeholder="예. 내일 요양센터"
              style={{ borderRadius: "12px" }}
              value={workPlace}
              onChange={(e) => setWorkPlace(e.target.value)}
            ></textarea>
            <p className="text-[15px]" style={{ fontWeight: 700 }}>
              했던 일
            </p>
            <textarea
              className="w-full h-[70px] border border-[#729A73] text-[11px] resize-none pl-[10px] py-[10px]"
              placeholder="예. 요양 보호사"
              style={{ borderRadius: "12px" }}
              value={workDescription}
              onChange={(e) => setWorkDescription(e.target.value)}
            ></textarea>
            <p className="text-[15px]" style={{ fontWeight: 700 }}>
              일한 연도
            </p>
            <textarea
              className="w-full h-[70px] border border-[#729A73] text-[11px] resize-none pl-[10px] py-[10px]"
              placeholder="예. 2025년"
              style={{ borderRadius: "12px" }}
              value={workYear}
              onChange={(e) => setWorkYear(e.target.value)}
            ></textarea>
            <p className="text-[15px]" style={{ fontWeight: 700 }}>
              일한 기간
            </p>
            <div className="flex flex-wrap gap-[10px]">
              {labels.map((label) => (
                <button
                  key={label}
                  onClick={() => setSelectedLabel(label)}
                  className={`flex items-center justify-center border rounded-full h-[20px] px-[14px] py-[6px] text-[12px] ${
                    selectedLabel === label
                      ? " bg-[#729A73] border-[#729A73] text-[#FFFFFF]"
                      : "border-[#555555D9] text-[#555555D9]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[172px] p-[15px]">
            <p className="text-[18px]" style={{ fontWeight: 800 }}>
              경력
            </p>
            <div className="flex flex-col gap-[6px]">
              <div className="flex justify-end gap-[14px]">
                <button
                  className="text-[13px] text-[#729A73]"
                  style={{ fontWeight: 600 }}
                >
                  +추가
                </button>
                <button
                  className="text-[15px] text-[#729A73]"
                  style={{ fontWeight: 600 }}
                >
                  ...
                </button>
              </div>
              <div
                className="flex flex-col text-[12px] h-[84px] bg-[#B8CDB9BF] border border-[#729A73] p-[10px]"
                style={{ borderRadius: "12px" }}
              >
                <p>
                  <strong>{workPlace}</strong>
                </p>
                <p>
                  {workYear}/{selectedLabel}
                </p>
                <p>{workDescription}</p>
              </div>
            </div>
          </div>
        )}

        <div className="px-[15px]">
          <div className="h-[10px] w-full bg-white border-b border-[#55555526]"></div>
          <div className="h-[10px] w-full bg-white"></div>
        </div>

        <div className="flex flex-col h-[229px] px-[15px] pt-[15px] pb-[15px] gap-[16px]">
          <p className="text-[18px]" style={{ fontWeight: 800 }}>
            자격증
          </p>
          <div className="flex flex-col gap-[16px]">
            <p className="text-[15px]" style={{ fontWeight: 700 }}>
              자격증을 추가해주세요.
            </p>
            <p className="text-[12px]">
              필수는 아니지만, 구인자가 신뢰를 가질 수 있는 정보입니다.
            </p>
            <label>
              <input type="file" accept=".pdf, .jpg, .png" className="hidden" />
              <div
                className="flex w-full h-[50px] border border-[#729A73] text-[#555555D9] text-[11px] justify-center items-center"
                style={{ borderRadius: "12px" }}
              >
                자격증 파일 추가
              </div>
            </label>
          </div>
        </div>

        <section className="flex justify-center items-center py-[100px]">
          <button
            onClick={handleSaveResume}
            className="text-[#FFFFFF] text-[16px] w-[333px] h-[50px] rounded-full bg-[#729A73]"
            style={{ fontWeight: 600 }}
          >
            이력서 저장
          </button>
        </section>
      </div>
    </div>
  );
};

export default ResumeManage;
