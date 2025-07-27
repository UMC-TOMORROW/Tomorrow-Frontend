import Header from "../../components/Header";
import settings from "../../assets/settings.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Vector from "../../assets/Vector.png";
import { SlOptionsVertical } from "react-icons/sl";

const ResumeManage = () => {
  const navigate = useNavigate();
  const [selfIntro, setSelfIntro] = useState("");
  const [showSelfIntroBox, setShowSelfIntroBox] = useState(false);
  const [workPlace, setWorkPlace] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [workYear, setWorkYear] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [showCareerBox, setShowCareerBox] = useState(false);
  const [licenseFile, setLicenseFile] = useState<File[]>([]);
  // 저장 버튼 누르기 전 자격증 미리보기
  const [licensePreview, setLicensePreview] = useState(false);
  const [showLicenseBox, setShowLicenseBox] = useState(false);
  const [careerMenuOpen, setCareerMenuOpen] = useState(true);
  const [licenseMenuOpen, setLicenseMenuOpen] = useState(true);

  const handleSaveResume = () => {
    if (selfIntro.trim()) setShowSelfIntroBox(true);
    if (workPlace && workDescription && workYear && selectedLabel)
      setShowCareerBox(true);
    if (licenseFile.length > 0) setShowLicenseBox(true);
  };

  const handleLicenseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setLicenseFile([files[0]]);
      setLicensePreview(true);
    }
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
              <p className="text-[16px]" style={{ fontWeight: 700 }}>
                자기소개
              </p>
              <div className="flex flex-col gap-[16px]">
                <div className="flex flex-col gap-[3px]">
                  <p className="text-[14px]" style={{ fontWeight: 700 }}>
                    간단한 자기소개를 남겨주세요.
                  </p>
                  <p className="text-[14px]">
                    경험, 성격, 일에 대한 생각을 남겨주시면 <br />
                    구인자가 더 잘 이해할 수 있어요.
                  </p>
                </div>
                <div className="flex flex-col gap-[7px]">
                  <textarea
                    className="w-full h-[98px] border border-[#555555D9] pb-[10px] text-[12px] resize-none p-[10px]"
                    style={{ borderRadius: "12px" }}
                    value={selfIntro}
                    onChange={(e) => setSelfIntro(e.target.value)}
                  ></textarea>
                  <p className="text-[13px] text-[#EE0606CC]">
                    100자 이내로 작성해주세요.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col p-[15px] h-[145px] gap-[5px]">
              <p className="text-[18px]" style={{ fontWeight: 800 }}>
                자기소개
              </p>
              <div className="flex flex-col h-[85px] gap-[9px]">
                <button
                  onClick={() => setShowSelfIntroBox(false)}
                  className="flex text-[13px] text-[#729A73] justify-end underline"
                  style={{ fontWeight: 600 }}
                >
                  수정
                </button>
                <div
                  className="w-full h-[58px] border border-[#729A73] overflow-auto px-[8px]"
                  style={{
                    borderRadius: "12px",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    className="text-[12px] p-[8px]"
                    style={{ fontWeight: 400 }}
                  >
                    {selfIntro}
                  </p>
                </div>
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
            <p className="text-[16px]" style={{ fontWeight: 700 }}>
              경력
            </p>
            <div className="flex flex-col gap-[30px]">
              <div className="flex flex-col gap-[16px]">
                <p className="text-[14px]" style={{ fontWeight: 700 }}>
                  일한 곳
                </p>
                <textarea
                  className="w-full h-[51px] border border-[#555555D9] text-[12px] resize-none pl-[10px] py-[10px]"
                  style={{ borderRadius: "12px" }}
                  value={workPlace}
                  onChange={(e) => setWorkPlace(e.target.value)}
                ></textarea>
              </div>
              <div className="flex flex-col gap-[16px]">
                <p className="text-[14px]" style={{ fontWeight: 700 }}>
                  했던 일
                </p>
                <textarea
                  className="w-full h-[51px] border border-[#555555D9] text-[12px] resize-none pl-[10px] py-[10px]"
                  style={{ borderRadius: "12px" }}
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="flex flex-col gap-[16px]">
                <p className="text-[14px]" style={{ fontWeight: 700 }}>
                  일한 연도
                </p>
                <textarea
                  className="w-full h-[51px] border border-[#555555D9] text-[12px] resize-none pl-[10px] py-[10px]"
                  placeholder="예. 2025년"
                  style={{ borderRadius: "12px" }}
                  value={workYear}
                  onChange={(e) => setWorkYear(e.target.value)}
                ></textarea>
              </div>
              <div className="flex flex-col gap-[16px]">
                <p className="text-[14px]" style={{ fontWeight: 700 }}>
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
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[172px] p-[15px]">
            <p className="text-[18px]" style={{ fontWeight: 800 }}>
              경력
            </p>
            <div className=" flex flex-col gap-[6px]">
              <div className="relative flex justify-end gap-[14px]">
                <button
                  className="text-[13px] text-[#729A73]"
                  style={{ fontWeight: 600 }}
                >
                  +추가
                </button>
                <button
                  onClick={() => setCareerMenuOpen(!careerMenuOpen)}
                  className="text-[13px] text-[#729A73]"
                  style={{ fontWeight: 600 }}
                >
                  <SlOptionsVertical />
                </button>
                {careerMenuOpen && (
                  <div
                    className="flex flex-col w-[66px] h-[84px] bg-[#EAEAEA] items-center justify-center gap-[10px] absolute right-0 mt-[20px] z-10"
                    style={{ borderRadius: "8px" }}
                  >
                    <button
                      onClick={() => setShowCareerBox(false)}
                      className="text-[10px]"
                      style={{ fontWeight: 500 }}
                    >
                      수정
                    </button>
                    <hr className="border-[#B1B1B1] w-[58px]" />
                    <button
                      className="text-[10px] text-[#C84141]"
                      style={{ fontWeight: 500 }}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <div
                className="flex flex-col text-[12px] h-[84px] border border-[#729A73] p-[10px]"
                style={{ borderRadius: "12px" }}
              >
                <div className="flex flex-col pl-[8px] gap-[5px]">
                  <p className="text-[12px]" style={{ fontWeight: 800 }}>
                    {workPlace}
                  </p>
                  <p
                    className="text-[12px] text-[#555555D9]"
                    style={{ fontWeight: 400 }}
                  >
                    {workYear}/{selectedLabel}
                  </p>
                  <p className="text-[12px]" style={{ fontWeight: 400 }}>
                    {workDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="px-[15px]">
          <div className="h-[10px] w-full bg-white border-b border-[#55555526]"></div>
          <div className="h-[10px] w-full bg-white"></div>
        </div>

        {!showLicenseBox ? (
          <div className="flex flex-col h-[229px] px-[15px] pt-[15px] pb-[15px] gap-[16px]">
            <p className="text-[16px]" style={{ fontWeight: 700 }}>
              자격증
            </p>
            <div className="flex flex-col gap-[22px]">
              <div className="flex flex-col gap-[3px]">
                <p className="text-[14px]" style={{ fontWeight: 700 }}>
                  자격증을 추가해주세요.
                </p>
                <p className="text-[14px]">
                  필수는 아니지만, 구인자가 신뢰를 가질 수 있는 정보입니다.
                </p>
              </div>
              <div className="flex flex-col gap-[7px]">
                {licenseFile.length > 0 && licensePreview ? (
                  <div
                    className="flex flex-col w-full h-[135px] border border-[#729A73] p-[15px] gap-[4px]"
                    style={{ borderRadius: "12px" }}
                  >
                    <img
                      src={URL.createObjectURL(licenseFile[0])}
                      className="w-[79px] h-[79px]"
                    />
                    <p className="text-[12px]" style={{ fontWeight: 400 }}>
                      {licenseFile[0].name}
                    </p>
                  </div>
                ) : (
                  <label>
                    <input
                      type="file"
                      accept=".pdf, .jpg, .png"
                      multiple
                      className="hidden"
                      onChange={handleLicenseFileChange}
                    />
                    <div
                      className="flex w-full h-[44px] border border-[#555555D9] text-[#555555D9] justify-between items-center px-[15px]"
                      style={{ borderRadius: "12px" }}
                    >
                      <span className="text-[14px]">파일 선택</span>
                      <img src={Vector} className="w-[14px] h-[14.9px]" />
                    </div>
                  </label>
                )}

                <p
                  className="text-[13px] text-[#EE0606CC]"
                  style={{ fontWeight: 400 }}
                >
                  첨부 파일은 최대 3개, 30MB까지 등록 가능합니다.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[229px] px-[15px] pt-[15px] pb-[15px]">
            <p className="text-[18px]" style={{ fontWeight: 800 }}>
              자격증
            </p>
            <div className="relative flex justify-end h-[30px] gap-[14px]">
              <button
                className="text-[13px] text-[#729A73]"
                style={{ fontWeight: 600 }}
              >
                +추가
              </button>
              <button
                onClick={() => setLicenseMenuOpen(!licenseMenuOpen)}
                className="text-[13px] text-[#729A73]"
                style={{ fontWeight: 600 }}
              >
                <SlOptionsVertical />
              </button>
              {licenseMenuOpen && (
                <div
                  className="flex flex-col w-[66px] h-[84px] bg-[#EAEAEA] items-center justify-center gap-[10px] absolute right-0 mt-[25px] z-10"
                  style={{ borderRadius: "8px" }}
                >
                  <button
                    onClick={() => setShowLicenseBox(false)}
                    className="text-[10px]"
                    style={{ fontWeight: 500 }}
                  >
                    수정
                  </button>
                  <hr className="border-[#B1B1B1] w-[58px]" />
                  <button
                    className="text-[10px] text-[#C84141]"
                    style={{ fontWeight: 500 }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            <div
              className="flex flex-col w-full h-[135px] border border-[#729A73] p-[15px] gap-[4px]"
              style={{ borderRadius: "12px" }}
            >
              <img
                src={URL.createObjectURL(licenseFile[0])}
                className="w-[79px] h-[79px]"
              />
              <p className="text-[12px]" style={{ fontWeight: 400 }}>
                {licenseFile[0].name}
              </p>
            </div>
          </div>
        )}

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
