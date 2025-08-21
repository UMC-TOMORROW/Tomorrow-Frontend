import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CareerForm from "../../components/CareerForm";
import CareerItem from "../../components/CareerItem";
import LicenseForm from "../../components/LicenseForm";
import LicenseItem from "../../components/LicenseItem";
import memberplus from "../../assets/memberplus.png";
import {
  getIntroduction,
  postIntroduction,
  putIntroduction,
} from "../../apis/introduction";
import type { WorkedPeriod } from "../../types/career";
import { createCareer, getCareers, deleteCareer } from "../../apis/career";
import {
  listCertificate,
  uploadCertificate,
  deleteCertificate,
} from "../../apis/license";
import { saveResume } from "../../apis/resume";
import type { SaveResumeRequest } from "../../types/resume";
import type { Certificate } from "../../types/license";
import { axiosInstance } from "../../apis/axios";
import { isAxiosError } from "axios";
import type { MyInfo } from "../../types/member";
import { getMyInfo } from "../../apis/employerMyPage";
import { SlArrowLeft } from "react-icons/sl";
import { putMyProfileImage, getMyInfo1 } from "../../apis/member";

const labels = [
  "단기",
  "3개월 이하",
  "6개월 이하",
  "6개월~1년",
  "1년~2년",
  "2년~3년",
  "3년 이상",
] as const;

const periodMap: Record<string, WorkedPeriod> = {
  단기: "SHORT_TERM",
  "3개월 이하": "LESS_THAN_3_MONTHS",
  "6개월 이하": "LESS_THAN_6_MONTHS",
  "6개월~1년": "SIX_TO_TWELVE_MONTHS",
  "1년~2년": "ONE_TO_TWO_YEARS",
  "2년~3년": "TWO_TO_THREE_YEARS",
  "3년 이상": "MORE_THAN_THREE_YEARS",
};

const periodLabelMap: Record<WorkedPeriod, string> = {
  SHORT_TERM: "단기",
  LESS_THAN_3_MONTHS: "3개월 이하",
  LESS_THAN_6_MONTHS: "6개월 이하",
  SIX_TO_TWELVE_MONTHS: "6개월~1년",
  ONE_TO_TWO_YEARS: "1년~2년",
  TWO_TO_THREE_YEARS: "2년~3년",
  MORE_THAN_THREE_YEARS: "3년 이상",
};

const API_BASE =
  axiosInstance?.defaults?.baseURL || import.meta.env.VITE_API_BASE_URL || "";

const toAbsoluteUrl = (u?: string) => {
  if (!u) return "";
  if (
    u.startsWith("http://") ||
    u.startsWith("https://") ||
    u.startsWith("blob:") ||
    u.startsWith("data:")
  ) {
    return u;
  }
  if (!API_BASE) return u; // 개발 중 임시
  return `${API_BASE.replace(/\/+$/, "")}/${u.replace(/^\/+/, "")}`;
};

const nameFromUrl = (url: string) => {
  const last = url.split("/").pop() ?? "";
  return decodeURIComponent(last.split("?")[0]) || "certificate";
};

// 저장 전 로컬 대기 항목(서버 미반영)
type PendingCertificate = {
  file: File;
  previewUrl: string;
  filename: string;
};

const MAX_CERTS = 4;

const ResumeManage = () => {
  const navigate = useNavigate();
  const location = useLocation() as {
    state?: { from?: string; backTo?: string };
  };
  const [selfIntro, setSelfIntro] = useState("");
  const [hasIntro, setHasIntro] = useState(false);
  const [showSelfIntroBox, setShowSelfIntroBox] = useState(false);
  const [showCareerBox, setShowCareerBox] = useState(false);
  const [licenseFile, setLicenseFile] = useState<Certificate[]>([]);
  const [showLicenseBox, setShowLicenseBox] = useState(false);
  const [licenseForm, setLicenseForm] = useState<number[]>([0]);
  const { resumeId } = useParams<{ resumeId: string }>();
  const [pendingCertificates, setPendingCertificates] = useState<
    PendingCertificate[]
  >([]);
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const rid = Number(resumeId);
  // [CHANGE] rid를 state로 관리(잘못된 param이거나 없는 경우 null로 시작)
  const [rid, setRid] = useState<number | null>(
    resumeId && !Number.isNaN(Number(resumeId)) ? Number(resumeId) : null
  );

  const onClickProfileImage = () => fileInputRef.current?.click();

  const onChangeProfileImage: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있어요.");
      e.target.value = "";
      return;
    }

    try {
      await putMyProfileImage(file); // 1) 업로드 (응답 바디 없음)
      const refreshed = await getMyInfo1(); // 2) 서버 상태 재조회
      setMyInfo(refreshed); // 3) 서버 URL로 확정 반영
    } catch (err: any) {
      console.error("프로필 이미지 업로드 실패:", err);
      const status = err?.response?.status;
      if (status === 413)
        alert("파일이 너무 커요. 더 작은 이미지를 올려주세요.");
      else alert("프로필 이미지 업로드에 실패했습니다.");
    } finally {
      e.target.value = ""; // 같은 파일 다시 선택 가능
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const me = await getMyInfo1();
        setMyInfo(me);
      } catch (e) {
        console.error("내 정보 불러오기 실패:", e);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const data = await getMyInfo();
        setMyInfo(data);
      } catch (error) {
        console.error("내 정보 불러오기 실패:", error);
      }
    };
    fetchMyInfo();
  }, []);

  // useEffect(() => {
  //   if (!resumeId || Number.isNaN(rid)) {
  //     console.error("잘못된 resumeId:", resumeId);
  //   }
  // }, [resumeId, rid]);

  // 유효성 로그: NaN 체크 대신 null 여부로만 확인
  useEffect(() => {
    if (rid == null) {
      console.warn(
        "이력서 ID를 아직 확보하지 못했어요. (초안 생성/요약 조회 예정)"
      );
    }
  }, [rid]);

  // 마운트/param 변경 시 이력서 ID 보장 로직 (요약→없으면 초안 생성)
  useEffect(() => {
    let alive = true;
    (async () => {
      if (rid !== null) return; // 이미 확보됨

      try {
        // 1) 요약 조회 ({} 빈 객체도 방어)
        const { data } = await axiosInstance.get("/api/v1/resumes/summary");
        const r = data?.result ?? data;
        const idFromSummary = Number(r?.resumeId);
        if (alive && Number.isFinite(idFromSummary)) {
          setRid(idFromSummary);
          return;
        }

        // 2) 없으면 초안 생성
        const created = await axiosInstance.post("/api/v1/resumes", {
          introduction: "",
          careers: [],
          certificates: [],
        });
        const c = created?.data?.result ?? created?.data;
        const newId = Number(c?.resumeId ?? c?.id);
        if (alive && Number.isFinite(newId)) {
          setRid(newId);
          return;
        }

        console.error("이력서 식별자 확보 실패(요약/초안)");
      } catch (e: any) {
        // 이미 존재(409) 등일 때 한 번 더 요약 재시도
        if (e?.response?.status === 409) {
          try {
            const { data } = await axiosInstance.get("/api/v1/resumes/summary");
            const r = data?.result ?? data;
            const id2 = Number(r?.resumeId);
            if (alive && Number.isFinite(id2)) setRid(id2);
          } catch {
            /* ignore */
          }
        } else {
          console.debug("[ensure rid] error:", e?.response ?? e);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [resumeId, rid]);

  useEffect(() => {
    if (rid == null) return;
    (async () => {
      try {
        const [introRes, certsRes, careersRes] = await Promise.all([
          getIntroduction(rid),
          listCertificate(rid),
          getCareers(rid),
        ]);

        // 자기소개
        const introRow = introRes?.result; // result 객체가 있으면 '레코드 존재'로 간주
        const introContent = introRow?.content ?? "";
        setSelfIntro(introContent);
        setHasIntro(!!introRow); // 내용이 비어있어도 '존재' = true
        setShowSelfIntroBox(!!introContent);

        // 경력
        const list = careersRes?.result ?? [];
        setCareers(
          list.map((d) => ({
            id: d.careerId,
            workPlace: d.company,
            workYear: String(d.workedYear),
            workDescription: d.description,
            selectedLabel: periodLabelMap[d.workedPeriod as WorkedPeriod],
          }))
        );
        setShowCareerBox(list.length > 0);

        // 자격증
        const certs = certsRes?.result ?? [];
        setLicenseFile(
          (certs ?? []).map((c) => ({
            id: c.id,
            fileUrl: toAbsoluteUrl(c.fileUrl),
            filename: c.filename ?? nameFromUrl(c.fileUrl),
          }))
        );
        setShowLicenseBox(certs.length > 0);
      } catch (err) {
        console.log("초기 데이터 조회 실패:", err);
      }
    })();
  }, [rid]);

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

  const handleAddCareer = async () => {
    if (rid == null) {
      alert("이력서 식별자가 준비되지 않았어요. 잠시 후 다시 시도해 주세요.");
      return;
    }

    const { workPlace, workYear, workDescription, selectedLabel } =
      currentCareer;
    if (!workPlace || !workYear || !workDescription || !selectedLabel) return;

    const yearNum = Number(workYear);
    if (Number.isNaN(yearNum)) {
      alert("연도는 숫자로 입력해 주세요.");
      return;
    }

    try {
      const payload = {
        company: workPlace,
        description: workDescription,
        workedYear: yearNum,
        workedPeriod: periodMap[selectedLabel],
      };

      await createCareer(rid, payload);

      // 조회
      const listRes = await getCareers(rid);
      const list = listRes.result;

      setCareers(
        list.map((d) => ({
          id: d.careerId,
          workPlace: d.company,
          workYear: String(d.workedYear),
          workDescription: d.description,
          selectedLabel: periodLabelMap[d.workedPeriod],
        }))
      );

      setShowCareerBox(list.length > 0);

      setCurrentCareer({
        workPlace: "",
        workYear: "",
        workDescription: "",
        selectedLabel: "",
      });
    } catch (e) {
      console.error("경력 추가/조회 실패:", e);
      alert("경력 추가에 실패했습니다.");
    }
  };

  const handleDeleteCareer = async (id: number) => {
    if (rid == null) {
      alert("이력서 식별자가 준비되지 않았어요. 잠시 후 다시 시도해 주세요.");
      return;
    }
    try {
      await deleteCareer(rid, id);
      setCareers((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error("경력 삭제 실패:", e);
      alert("경력 삭제에 실패했습니다.");
    }
  };

  const toWorkedPeriod = (val: string | WorkedPeriod): WorkedPeriod => {
    if (typeof val === "string" && val in periodMap) {
      return periodMap[val as keyof typeof periodMap];
    }
    return val as WorkedPeriod;
  };

  const isCurrentCareerValid = (c: typeof currentCareer) =>
    !!(c.workPlace && c.workYear && c.workDescription && c.selectedLabel);

  // 서버 DTO 매핑
  const toCareerDto = (c: typeof currentCareer) => ({
    company: c.workPlace,
    description: c.workDescription,
    workedYear: Number(c.workYear) || 0,
    workedPeriod: toWorkedPeriod(c.selectedLabel),
  });

  const handleLicenseFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (licenseFile.length + pendingCertificates.length >= MAX_CERTS) return;

    const previewUrl = URL.createObjectURL(file);

    setPendingCertificates((prev) => [
      ...prev,
      { file, previewUrl, filename: file.name },
    ]);

    setLicenseForm((prev) => prev.filter((_, i) => i !== index));
    //setShowLicenseBox(true);
  };

  // 서버에 저장된(기존) 항목 삭제
  const handleDeleteSavedLicense = async (index: number) => {
    if (rid == null) {
      alert("이력서 식별자가 준비되지 않았어요. 잠시 후 다시 시도해 주세요.");
      return;
    }
    const target = licenseFile[index];
    if (!target) return;

    console.log("[DELETE CERT]", { rid, certificateId: target.id });

    const prev = [...licenseFile];
    const next = prev.filter((_, i) => i !== index);
    setLicenseFile(next);
    if (next.length + pendingCertificates.length === 0)
      setShowLicenseBox(false);

    try {
      await deleteCertificate(Number(rid), Number(target.id)); // 서버 삭제

      const fresh = await listCertificate(rid);
      const certs2 = fresh?.result ?? [];
      setLicenseFile(
        certs2.map((c) => ({
          id: c.id,
          fileUrl: toAbsoluteUrl(c.fileUrl),
          filename: c.filename ?? nameFromUrl(c.fileUrl),
        }))
      );
      setShowLicenseBox(certs2.length + pendingCertificates.length > 0);
    } catch (err) {
      let status: number | undefined = undefined;
      if (isAxiosError(err)) status = err.response?.status;

      if (status === 401) alert("로그인이 필요합니다.");
      else if (status === 404)
        alert("해당 이력서에 없는 자격증입니다. 목록을 새로고침합니다.");
      else alert("자격증 삭제에 실패했습니다.");

      setLicenseFile(prev);
      setShowLicenseBox(true);
    }
  };

  // 로컬 대기 항목 삭제
  const handleDeletePendingLicense = (index: number) => {
    const target = pendingCertificates[index];
    if (!target) return;

    try {
      URL.revokeObjectURL(target.previewUrl);
    } catch (err) {
      console.warn("previewUrl revoke 실패:", err);
    }
    setPendingCertificates((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length + licenseFile.length === 0) setShowLicenseBox(false);
      return next;
    });
  };

  const handleSaveResume = async () => {
    if (rid == null) {
      alert("이력서 ID가 아직 준비되지 않았어요. 잠시 후 다시 시도해 주세요.");
      return;
    }
    // 자기소개 유효성
    const intro = selfIntro.trim();
    if (intro.length > 100) {
      alert("자기소개는 100자 이내로 작성해주세요.");
      return;
    }

    // 자기소개 저장
    try {
      if (intro) {
        if (hasIntro) await putIntroduction(rid, { content: intro });
        else {
          try {
            await postIntroduction(rid, { content: intro });
            setHasIntro(true);
          } catch (err: any) {
            // 이미 존재하면(409) 업데이트로 전환
            if (isAxiosError(err) && err.response?.status === 409) {
              await putIntroduction(rid, { content: intro });
              setHasIntro(true);
            } else {
              throw err;
            }
          }
        }
        setShowSelfIntroBox(true);
      } else {
        setShowSelfIntroBox(false);
      }
    } catch (err: any) {
      console.error("자기소개 저장 실패:", err);
      alert("자기소개 저장에 실패했습니다.");
    }

    // '+ 추가하기' 안된 최신 경력 1건 저장
    try {
      if (isCurrentCareerValid(currentCareer)) {
        await createCareer(rid, toCareerDto(currentCareer));
        setCurrentCareer({
          workPlace: "",
          workYear: "",
          workDescription: "",
          selectedLabel: "",
        });
      }
    } catch (err) {
      console.error("경력 저장 실패:", err);
      alert("경력 저장에 실패했습니다.");
      return;
    }

    try {
      // 서버 최신 경력 조회
      const [careersRes] = await Promise.all([getCareers(rid)]);

      type CareerRowFromApi = {
        careerId: number;
        company: string;
        description: string;
        workedYear: number;
        workedPeriod: WorkedPeriod;
      };

      const serverCareers = (careersRes?.result ?? []) as CareerRowFromApi[];

      const careersPayload: SaveResumeRequest["careers"] = serverCareers.map(
        (d) => ({
          company: d.company,
          description: d.description,
          workedYear: d.workedYear,
          workedPeriod: d.workedPeriod as WorkedPeriod,
        })
      );

      // 아직 서버에 저장되지 않은 자격증 서버에 업로드
      const newlyUploaded: { fileUrl: string; filename: string }[] = [];
      for (const p of pendingCertificates) {
        try {
          const { result } = await uploadCertificate(rid, p.file);
          newlyUploaded.push({
            fileUrl: toAbsoluteUrl(result.fileUrl),
            filename: p.filename,
          });
        } catch (e) {
          console.error("자격증 업로드 실패(저장 단계):", e);
          alert("자격증 업로드에 실패했습니다.");
          return;
        }
      }

      // certificatesPayload : 이번에 새로 올린 항목들
      const certificatesPayload: SaveResumeRequest["certificates"] =
        newlyUploaded;

      // saveResume 호출
      const payload: SaveResumeRequest = {
        introduction: intro,
        careers: careersPayload,
        certificates: certificatesPayload,
      };
      await saveResume(payload);

      // 최신 동기화(경력/자격증 재조회) + 로컬 대기 초기화
      const [refetchedCareers, certsRes] = await Promise.all([
        getCareers(rid),
        listCertificate(rid),
      ]);

      const list = (refetchedCareers?.result ?? []) as CareerRowFromApi[];
      setCareers(
        list.map((d) => ({
          id: d.careerId,
          workPlace: d.company,
          workYear: String(d.workedYear),
          workDescription: d.description,
          selectedLabel: periodLabelMap[d.workedPeriod as WorkedPeriod],
        }))
      );
      setShowCareerBox(list.length > 0);

      const certs = certsRes?.result ?? [];
      setLicenseFile(
        certs.map((c) => ({
          id: c.id,
          fileUrl: toAbsoluteUrl(c.fileUrl),
          filename: c.filename ?? nameFromUrl(c.fileUrl),
        }))
      );

      // 로컬 대기는 모두 비우고 blob URL 정리
      pendingCertificates.forEach((p) => {
        try {
          URL.revokeObjectURL(p.previewUrl);
        } catch (error) {
          console.log("pendingCertificates 오류:", error);
        }
      });
      setPendingCertificates([]);

      if (certs.length > 0) setShowLicenseBox(true);
      alert("이력서를 저장했어요.");

      const fromJobDetail = location?.state?.from === "jobDetail";
      const backToPath = location?.state?.backTo;

      if (fromJobDetail && backToPath) {
        navigate(backToPath, { replace: true }); // 상세 페이지로 복귀
        return;
      }
    } catch (err) {
      console.error("이력서 저장 실패:", err);
      alert("이력서 저장에 실패했습니다.");
    }
  };

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        <section className="relative flex justify-center items-center h-[52px] border-b border-[#DEDEDE]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-[15px]"
          >
            <SlArrowLeft />
          </button>
          <div
            className="flex justify-center items-center text-[20px] h-[52px] border-[#DEDEDE]"
            style={{ fontWeight: 700 }}
          >
            이력서 관리
          </div>
        </section>
        <section className="flex items-center justify-between px-[20px] py-[15px] h-[110px]">
          <div className="flex items-center gap-4">
            <img
              src={myInfo?.profileImageUrl ?? memberplus}
              onClick={onClickProfileImage}
              draggable={false}
              className={
                myInfo?.profileImageUrl
                  ? `w-[60px] h-[60px] rounded-full object-cover cursor-pointer`
                  : ""
              }
            />
            <input
              ref={fileInputRef}
              className="hidden"
              type="file"
              accept="image/*"
              onChange={onChangeProfileImage}
            />
            <div>
              <p className="text-[18px]" style={{ fontWeight: 800 }}>
                {myInfo?.name ?? "이름을 등록해주세요"}
              </p>
              <p className="text-[14px]">
                {myInfo?.phoneNumber ?? "전화번호를 등록해주세요"}
              </p>
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
              <p className="text-[18px]" style={{ fontWeight: 700 }}>
                자기소개
              </p>
              <div className="flex flex-col gap-[16px]">
                <div className="flex flex-col gap-[3px]">
                  <p className="text-[16px]" style={{ fontWeight: 700 }}>
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
              <div className="flex flex-col h-[85px] gap-[5px]">
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
            <p className="text-[18px]" style={{ fontWeight: 700 }}>
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
              labels={[...labels]}
            />
            <button
              className="h-[42px] border border-[#729A73] text-[#729A73] text-[14px] mt-[20px]"
              style={{ borderRadius: "10px" }}
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
            <div className=" flex flex-col">
              <div className="relative flex justify-end h-[30px]">
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
                  className="text-[14px] text-[#729A73]"
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
            <p className="text-[18px]" style={{ fontWeight: 700 }}>
              자격증
            </p>
            <div className="flex flex-col gap-[22px]">
              <div className="flex flex-col gap-[3px]">
                <p className="text-[16px]" style={{ fontWeight: 700 }}>
                  자격증을 추가해주세요.
                </p>
                <p className="text-[14px]">
                  필수는 아니지만, 구인자가 신뢰를 가질 수 있는 정보입니다.
                </p>
              </div>
              <div className="flex flex-col gap-[7px]">
                {licenseFile.map((item, idx) => (
                  <LicenseItem
                    key={item.id ?? idx}
                    //fileUrl={item.fileUrl ?? ""}
                    fileUrl={toAbsoluteUrl(item.fileUrl)}
                    filename={item.filename}
                    onDelete={() => handleDeleteSavedLicense(idx)}
                  />
                ))}
                {pendingCertificates.map((p, idx) => (
                  <LicenseItem
                    key={`pending-${idx}`}
                    fileUrl={p.previewUrl}
                    filename={p.filename}
                    isPending
                    onDelete={() => handleDeletePendingLicense(idx)}
                  />
                ))}
                {licenseForm.map((_, idx) => (
                  <LicenseForm
                    key={idx}
                    onFileSelect={(e) => handleLicenseFileChange(e, idx)}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                if (
                  licenseFile.length +
                    pendingCertificates.length +
                    licenseForm.length <
                  MAX_CERTS
                )
                  setLicenseForm((prev) => [...prev, prev.length]);
              }}
              className="h-[42px] border border-[#729A73] text-[#729A73] text-[14px] mt-[30px]"
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
                className="text-[14px] text-[#729A73]"
                style={{ fontWeight: 600 }}
                onClick={() => setShowLicenseBox(false)}
              >
                +추가
              </button>
            </div>
            <div className="flex flex-col gap-[15px]">
              {pendingCertificates.map((p, idx) => (
                <LicenseItem
                  key={`pending-${idx}`}
                  fileUrl={p.previewUrl}
                  filename={p.filename}
                  isPending
                  onDelete={() => handleDeletePendingLicense(idx)}
                />
              ))}

              {licenseFile.map((item, idx) => (
                <LicenseItem
                  key={item.id ?? idx}
                  fileUrl={toAbsoluteUrl(item.fileUrl)}
                  filename={item.filename}
                  onDelete={() => handleDeleteSavedLicense(idx)}
                />
              ))}
            </div>
          </div>
        )}

        <section className="flex justify-center items-center py-[100px]">
          <button
            onClick={handleSaveResume}
            className="text-[#FFFFFF] text-[16px] w-[333px] h-[50px] bg-[#729A73]"
            style={{ fontWeight: 600, borderRadius: "10px" }}
          >
            이력서 저장
          </button>
        </section>
      </div>
    </div>
  );
};

export default ResumeManage;
