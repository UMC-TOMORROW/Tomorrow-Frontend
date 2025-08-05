import Header from "../../components/Header";
import { useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import CareerForm from "../../components/CareerForm";
import CareerItem from "../../components/CareerItem";
import LicenseForm from "../../components/LicenseForm";
import LicenseItem from "../../components/LicenseItem";
import memberplus from "../../assets/memberplus.png";

const ResumeManage = () => {
  const [selfIntro, setSelfIntro] = useState("");
  const [showSelfIntroBox, setShowSelfIntroBox] = useState(false);
  const [showCareerBox, setShowCareerBox] = useState(false);
  const [licenseFile, setLicenseFile] = useState<File[]>([]);
  const [showLicenseBox, setShowLicenseBox] = useState(false);
  const [licenseMenuOpen, setLicenseMenuOpen] = useState(false);
  const [licenseForm, setLicenseForm] = useState<number[]>([0]);

  const [careers, setCareers] = useState<
    {
      id: number;
      workPlace: string;
      workYear: string;
      workDescription: string;
      selectedLabel: string;
    }[]
  >([]);

  const [currentCareer, setCurrentCareer] = useState({
    workPlace: "",
    workYear: "",
    workDescription: "",
    selectedLabel: "",
  });

  const handleAddCareer = () => {
    const { workPlace, workYear, workDescription, selectedLabel } =
      currentCareer;
    if (!workPlace || !workYear || !workDescription || !selectedLabel) return;

    const newCareer = {
      id: Date.now(),
      workPlace,
      workYear,
      workDescription,
      selectedLabel,
    };

    setCareers((prev) => [...prev, newCareer]);
    setCurrentCareer({
      workPlace: "",
      workYear: "",
      workDescription: "",
      selectedLabel: "",
    });
  };

  const handleSaveResume = () => {
    if (selfIntro.trim()) setShowSelfIntroBox(true);

    const { workPlace, workYear, workDescription, selectedLabel } =
      currentCareer;
    if (workPlace && workYear && workDescription && selectedLabel) {
      const newCareer = {
        id: Date.now(),
        workPlace,
        workYear,
        workDescription,
        selectedLabel,
      };

      setCareers((prev) => [...prev, newCareer]);
      setCurrentCareer({
        workPlace: "",
        workYear: "",
        workDescription: "",
        selectedLabel: "",
      });
    }

    if (
      careers.length > 0 ||
      (workPlace && workYear && workDescription && selectedLabel)
    ) {
      setShowCareerBox(true);
    }

    if (licenseFile.length > 0) setShowLicenseBox(true);
  };

  const handleLicenseFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (licenseFile.length >= 3) return;
    setLicenseFile((prev) => [...prev, files[0]]);
    setLicenseForm((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteCareer = (id: number) => {
    setCareers((prev) => prev.filter((career) => career.id !== id));
  };

  const handleDeleteLicense = (index: number) => {
    setLicenseFile((prev) => prev.filter((_, i) => i !== index));
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
            <img src={memberplus} />
            <div>
              <p className="text-[18px]" style={{ fontWeight: 800 }}>
                이내일
              </p>
              <p className="text-[13px]">010-1234-5678</p>
            </div>
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
                    className="w-full h-[98px] border border-[#555555D9] pb-[10px] text-[14px] resize-none p-[10px]"
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
                    className="text-[14px] p-[8px]"
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
          <div className="flex flex-col px-[15px] py-[15px] gap-[16px]">
            <p className="text-[16px]" style={{ fontWeight: 700 }}>
              경력
            </p>
            {careers.map((career) => (
              <CareerItem
                key={career.id}
                workPlace={career.workPlace}
                workYear={career.workYear}
                selectedLabel={career.selectedLabel}
                workDescription={career.workDescription}
                onDelete={() => handleDeleteCareer(career.id)}
              />
            ))}
            <CareerForm
              workPlace={currentCareer.workPlace}
              setWorkPlace={(v) =>
                setCurrentCareer((prev) => ({ ...prev, workPlace: v }))
              }
              workDescription={currentCareer.workDescription}
              setWorkDescription={(v) =>
                setCurrentCareer((prev) => ({ ...prev, workDescription: v }))
              }
              workYear={currentCareer.workYear}
              setWorkYear={(v) =>
                setCurrentCareer((prev) => ({ ...prev, workYear: v }))
              }
              selectedLabel={currentCareer.selectedLabel}
              setSelectedLabel={(v) =>
                setCurrentCareer((prev) => ({ ...prev, selectedLabel: v }))
              }
              labels={labels}
            />
            <button
              className="h-[42px] border border-[#729A73] text-[#729A73] text-14px mt-[20px]"
              style={{ borderRadius: "12px" }}
              onClick={handleAddCareer}
            >
              + 추가하기
            </button>
          </div>
        ) : (
          <div className="flex flex-col p-[15px]">
            <p className="text-[18px]" style={{ fontWeight: 800 }}>
              경력
            </p>
            <div className=" flex flex-col gap-[6px]">
              <div className="relative flex justify-end h-[36px]">
                <button
                  onClick={() => {
                    setShowCareerBox(false);
                    setCurrentCareer({
                      workPlace: "",
                      workYear: "",
                      workDescription: "",
                      selectedLabel: "",
                    });
                  }}
                  className="text-[13px] text-[#729A73]"
                  style={{ fontWeight: 600 }}
                >
                  +추가
                </button>
              </div>
              {careers.map((career) => (
                <CareerItem
                  key={career.id}
                  workPlace={career.workPlace}
                  workYear={career.workYear}
                  selectedLabel={career.selectedLabel}
                  workDescription={career.workDescription}
                  onDelete={() => handleDeleteCareer(career.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="px-[15px]">
          <div className="h-[10px] w-full bg-white border-b border-[#55555526]"></div>
          <div className="h-[10px] w-full bg-white"></div>
        </div>

        {!showLicenseBox ? (
          <div className="flex flex-col px-[15px] pt-[15px] pb-[15px] gap-[16px]">
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
                {licenseFile.map((file, idx) => (
                  <LicenseItem
                    key={`preview-${idx}`}
                    file={file}
                    onDelete={() => handleDeleteLicense(idx)}
                  />
                ))}
                {licenseForm.map((_, idx) => (
                  <LicenseForm
                    key={`form-${idx}`}
                    onFileSelect={(e) => handleLicenseFileChange(e, idx)}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                if (licenseFile.length + licenseForm.length < 4)
                  setLicenseForm((prev) => [...prev, prev.length]);
              }}
              className="h-[42px] border border-[#729A73] text-[#729A73] text-14px mt-[30px]"
              style={{ borderRadius: "12px" }}
            >
              + 추가하기
            </button>
          </div>
        ) : (
          <div className="flex flex-col px-[15px] pt-[15px] pb-[15px]">
            <p className="text-[18px]" style={{ fontWeight: 800 }}>
              자격증
            </p>
            <div className="relative flex justify-end h-[30px] gap-[14px]">
              <button
                className="text-[13px] text-[#729A73]"
                style={{ fontWeight: 600 }}
                onClick={() => setShowLicenseBox(false)}
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
                  className="flex flex-col w-[43px] h-[32px] bg-[#EDEDED] items-center justify-center gap-[10px] absolute right-0 mt-[30px] z-10"
                  style={{ borderRadius: "8px" }}
                >
                  <button
                    className="text-[12px] text-[#EE0606CC]"
                    style={{ fontWeight: 600 }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-[15px]">
              {licenseFile.map((file, idx) => (
                <LicenseItem
                  key={idx}
                  file={file}
                  onDelete={() => handleDeleteLicense(idx)}
                />
              ))}
            </div>
          </div>
        )}

        <section className="flex justify-center items-center py-[100px]">
          <button
            onClick={handleSaveResume}
            className="text-[#FFFFFF] text-[16px] w-[333px] h-[50px] bg-[#729A73]"
            style={{ fontWeight: 600, borderRadius: "12px" }}
          >
            이력서 저장
          </button>
        </section>
      </div>
    </div>
  );
};

export default ResumeManage;
