import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Devider from "../common/Devider";
import CommonButton from "../common/CommonButton";
import { axiosInstance } from "../../apis/axios";

export default function BusinessStep() {
  const navigate = useNavigate();

  const [regNo, setRegNo] = useState("");
  const [corpName, setCorpName] = useState("");
  const [owner, setOwner] = useState("");
  const [openDate, setOpenDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = regNo && corpName && owner && openDate;
  // 응답/헤더에서 jobId 추출 유틸
  const getJobIdFromHeaders = (headers: any) => {
    const loc = headers?.location || headers?.Location;
    if (!loc) return null;
    const last = String(loc).split("/").filter(Boolean).pop();
    return last && /^\d+$/.test(last) ? Number(last) : last ?? null;
  };
  // const onSubmit = async () => {
  //   if (!canSubmit) {
  //     alert("모든 항목을 입력해주세요.");
  //     return;
  //   }

  //   const payload = {
  //     bizNumber: regNo.replace(/\D+/g, "").slice(0, 10),
  //     companyName: corpName.trim(),
  //     ownerName: owner.trim(),
  //     openingDate: openDate.slice(0, 10), // YYYY-MM-DD
  //   };

  //   try {
  //     setSubmitting(true);

  //     console.log("[BusinessStep] POST /api/v1/jobs/business-verifications/register", payload);

  //     await axiosInstance.post("/api/v1/jobs/business-verifications/register", payload, {
  //       withCredentials: true,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //     });

  //     // ✅ 스펙: jobId는 최종 완료 시에만 발급됨.
  //     // 여기서는 추가 호출 없이 성공 처리만 하고 홈/완료 페이지로 이동.
  //     alert("사업자 인증이 완료되었습니다. 등록이 마무리되면 목록에 반영됩니다.");
  //     navigate("/", { replace: true });
  //   } catch (e: any) {
  //     const status = e?.response?.status;
  //     const data = e?.response?.data;

  //     console.group("[BusinessStep] 제출 실패");
  //     console.log("status:", status);
  //     console.log("data:", data);
  //     console.groupEnd();

  //     // 세션에 1차 폼이 없으면 서버가 400/409 등을 낼 수 있음
  //     if (status === 400 || status === 409) {
  //       alert("이전 단계(일자리 등록 1차 폼)가 세션에 없습니다. 처음부터 다시 진행해주세요.");
  //       return;
  //     }

  //     const msg =
  //       data?.message ||
  //       data?.result?.message ||
  //       (data?.result && typeof data.result === "object"
  //         ? Object.entries(data.result)
  //             .map(([k, v]) => `${k}: ${v}`)
  //             .join("\n")
  //         : null);

  //     alert(msg ?? "등록에 실패했습니다. 입력값을 다시 확인해주세요.");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  const onSubmit = async () => {
    if (!canSubmit || submitting) return;

    const payload = {
      bizNumber: regNo.replace(/\D+/g, "").slice(0, 10),
      companyName: corpName.trim(),
      ownerName: owner.trim(),
      openingDate: openDate.slice(0, 10), // YYYY-MM-DD
    };

    try {
      setSubmitting(true);

      console.log("[BusinessStep] POST /api/v1/jobs/business-verifications/register", payload);

      // 1) 사업자 인증
      const res = await axiosInstance.post("/api/v1/jobs/business-verifications/register", payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      });

      // 2) jobId 추출 (result, data, Location 헤더 등 여러 경로 지원)
      const body = res?.data?.result ?? res?.data ?? {};
      let jobId: any = body?.jobId ?? body?.id ?? getJobIdFromHeaders(res?.headers) ?? null;

      console.log("[BusinessStep] verify ok. jobId:", jobId);

      // 3) jobId 있으면 즉시 게시
      if (jobId != null) {
        console.log("[BusinessStep] POST /api/v1/jobs/%s/publish", jobId);
        await axiosInstance.post(
          `/api/v1/jobs/${jobId}/publish`,
          {},
          {
            withCredentials: true,
            headers: { Accept: "application/json" },
          }
        );
        alert("등록이 완료되었습니다.");
      } else {
        // 백엔드가 jobId를 안 주는 케이스: 인증만 성공(초안/대기 상태)
        alert("사업자 인증이 완료되었습니다. (게시 대기) 목록 반영까지 시간이 조금 걸릴 수 있습니다.");
      }

      navigate("/", { replace: true });
    } catch (e: any) {
      const status = e?.response?.status;
      const data = e?.response?.data;

      console.group("[BusinessStep] 제출 실패");
      console.log("status:", status);
      console.log("data:", data);
      console.groupEnd();

      if (status === 400 || status === 409) {
        alert("이전 단계(일자리 등록 1차 폼)가 세션에 없습니다. 처음부터 다시 진행해주세요.");
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
