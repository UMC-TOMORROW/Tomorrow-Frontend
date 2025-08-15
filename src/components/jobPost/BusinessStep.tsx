// src/components/jobPost/BusinessStep.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Devider from "../common/Devider";
import CommonButton from "../common/CommonButton";
import { axiosInstance } from "../../apis/axios";

// const useStableJobId = () => {
//   const location = useLocation();
//   const qs = new URLSearchParams(location.search);
//   const fromState = (location.state as any)?.jobId;
//   const fromQuery = qs.get("jobId");
//   const stored = typeof window !== "undefined" ? sessionStorage.getItem("jobId") : null;

//   const jobId = useMemo(() => Number(fromState ?? fromQuery ?? stored ?? NaN), [fromState, fromQuery, stored]);

//   useEffect(() => {
//     if (Number.isFinite(jobId)) sessionStorage.setItem("jobId", String(jobId));
//   }, [jobId]);

//   return Number.isFinite(jobId) ? jobId : null;
// };

export default function BusinessStep() {
  const navigate = useNavigate();
  // const jobId = useStableJobId();

  const [regNo, setRegNo] = useState("");
  const [corpName, setCorpName] = useState("");
  const [owner, setOwner] = useState("");
  const [openDate, setOpenDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = regNo && corpName && owner && openDate;

  const onSubmit = async () => {
    if (!canSubmit) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const payload = {
      bizNumber: regNo.replace(/\D+/g, "").slice(0, 10),
      companyName: corpName.trim(),
      ownerName: owner.trim(),
      openingDate: openDate.slice(0, 10), // YYYY-MM-DD
    };

    try {
      setSubmitting(true);

      console.log("[BusinessStep] POST /api/v1/business-verifications", payload);

      const { data: regRes } = await axiosInstance.post("/api/v1/jobs/business-verifications/register", payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      // 서버 스펙: "세션에 job이 있으면 일자리 등록까지 진행"
      // 필요 시 응답에서 jobId 추출해 세션/상태에 저장
      const jobId = regRes?.result?.jobId ?? regRes?.jobId ?? regRes?.result?.id ?? regRes?.id ?? null;
      if (jobId) sessionStorage.setItem("jobId", String(jobId));
      navigate("/", { state: { jobId } });
    } catch (e: any) {
      const status = e?.response?.status;
      const data = e?.response?.data;
      console.group("[BusinessStep] 제출 실패");
      console.log("status:", status);
      console.log("data:", data);
      console.groupEnd();

      // ❗ 세션에 job이 없을 때 나올 수 있는 케이스 처리
      if (status === 400 || status === 409) {
        alert("이전 단계(일자리 등록 폼)가 세션에 없습니다. 처음부터 다시 진행해주세요.");
        return;
      }

      const msg =
        data?.message ||
        data?.result?.message ||
        (data?.result && typeof data.result === "object"
          ? Object.entries(data.result)
              .map(([k, v]) => `${k}: ${v}`)
              .join("\n")
          : null);

      alert(msg ?? "등록에 실패했습니다. 입력값을 다시 확인해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[375px] !px-5 !space-y-6">
      <div className="-mx-4 px-4 w-full flex items-center justify-between h-14 border-b border-[#DEDEDE] relative pb-5">
        <button className="text-[20px]" onClick={() => navigate(-1)}>
          ✕
        </button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[18px] !font-bold font-pretendard">
          사업자 인증
        </h1>
      </div>

      <div className="!mx-2 mb-6">
        <h2 className="text-[20px] !font-extrabold font-pretendard !leading-[22px] tracking-[-0.41px] text-[#729A73] text-white p-2 rounded !my-5">
          사업자이신가요?
        </h2>
        <p className="font-pretendard !font-semibold text-[14px] leading-[22px] tracking-[-0.41px] !text-[#333] !mb-5">
          정확한 사업자 정보를 입력해주세요.
          <br />
          신뢰할 수 있는 광고 등록을 위해 꼭 필요한 과정입니다.
        </p>
      </div>

      <Devider />

      <div className="flex flex-col gap-6">
        {/* 사업자 등록 번호 */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">사업자 등록 번호</label>
          <input
            type="text"
            placeholder="1234567890"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73]"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value.replace(/\D+/g, "").slice(0, 10))}
          />
        </div>

        {/* 상호 */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">상호 (법인/단체명)</label>
          <input
            type="text"
            placeholder="(주) 내일"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73]"
            value={corpName}
            onChange={(e) => setCorpName(e.target.value)}
          />
        </div>

        {/* 성명 */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">성명 (대표자)</label>
          <input
            type="text"
            placeholder="이내일"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73]"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
        </div>

        {/* 개업연월일 */}
        <div className="!mb-6">
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">개업연월일</label>
          <input
            type="date"
            className="w-[336px] h-[52px] px-[10px] !text-[#555]/85 rounded-[10px] border border-[#729A73]"
            value={openDate}
            onChange={(e) => setOpenDate(e.target.value)}
          />
        </div>
      </div>

      <CommonButton label={submitting ? "등록 중..." : "등록하기"} onClick={onSubmit} />
    </div>
  );
}
