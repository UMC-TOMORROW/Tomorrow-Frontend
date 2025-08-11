import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Devider from "../common/Devider";
import CommonButton from "../common/CommonButton";
import { axiosInstance } from "../../apis/axios";

// state → query → session 순으로 jobId 복구
const useStableJobId = () => {
  const location = useLocation();
  const qs = new URLSearchParams(location.search);
  const fromState = (location.state as any)?.jobId;
  const fromQuery = qs.get("jobId");
  const stored = typeof window !== "undefined" ? sessionStorage.getItem("jobId") : null;

  const jobId = useMemo(() => fromState ?? fromQuery ?? stored ?? null, [fromState, fromQuery, stored]);

  useEffect(() => {
    if (jobId != null) sessionStorage.setItem("jobId", String(jobId));
  }, [jobId]);

  return jobId;
};

export default function PersonalStep() {
  const navigate = useNavigate();
  const jobId = useStableJobId();

  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [phone, setPhone] = useState("");
  const [request, setRequest] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name && district && phone;

  const onSubmit = async () => {
    if (!canSubmit) {
      alert("필수 항목(이름, 동네 위치, 연락처)을 입력해주세요.");
      return;
    }

    // 서버 명세에 맞춰 키 이름만 필요 시 변경
    const payload: any = {
      name: name.trim(),
      district: district.trim(),
      phone: phone.trim(),
      request: request.trim(),
    };
    if (jobId != null) payload.job_id = jobId;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("accessToken");

      // 1) 개인 인증/추가정보 저장
      await axiosInstance.post("/api/v1/jobs/personal/verify", payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      // 2) 최종 게시 (jobId가 있으면 path 사용, 없으면 서버가 현재 초안 기준으로 처리하도록)
      if (jobId != null) {
        await axiosInstance.post(
          `/api/v1/jobs/${jobId}/publish`,
          {},
          {
            withCredentials: true,
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
      } else {
        // 만약 서버가 jobId 없이도 게시 지원한다면 아래처럼 별도 엔드포인트 사용
        // await axiosInstance.post("/api/v1/jobs/publish", {}, { withCredentials: true });
      }

      navigate("/", { state: { jobId } });
    } catch (e: any) {
      const status = e?.response?.status;
      const data = e?.response?.data;
      console.group("[PersonalStep] 제출 실패");
      console.log("status:", status);
      console.log("data:", data);
      console.groupEnd();
      alert(data?.message ?? e?.message ?? "등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[375px] !px-5 !space-y-6">
      {/* 헤더 */}
      <div className="-mx-4 px-4 w-full flex items-center justify-between h-14 border-b border-[#DEDEDE] relative pb-5">
        <button className="text-[20px]" onClick={() => navigate(-1)}>
          ✕
        </button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[18px] !font-bold font-pretendard">
          개인 등록
        </h1>
      </div>

      {/* 인트로 */}
      <div className="!mx-2 mb-6">
        <h2 className="text-[20px] !font-extrabold font-pretendard !leading-[22px] tracking-[-0.41px] text-[#729A73] text-white p-2 rounded !my-5">
          사업자가 아니신가요?
        </h2>
        <p className="font-pretendard !font-semibold text-[14px] leading-[22px] tracking-[-0.41px] !text-[#333] !mb-5">
          간단한 정보를 입력해주세요.
          <br />
          구직자가 확인하고 지원하는 데에 도움이 됩니다.
        </p>
      </div>

      <Devider />

      {/* 폼 */}
      <div className="flex flex-col gap-6">
        {/* 이름 */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">이름</label>
          <input
            type="text"
            placeholder="배수현"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73] !text-[14px]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 동네 위치 */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">동네 위치</label>
          <input
            type="text"
            placeholder="서울 강서구 oo로 ooo"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73] !text-[14px]"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
        </div>

        {/* 연락처 */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">연락처</label>
          <input
            type="tel"
            placeholder="010-****-****"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73] !text-[14px]"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* 요청 내용 */}
        <div className="!mb-6">
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">요청 내용</label>
          <textarea
            placeholder="텃밭 관리가 혼자 하기에 벅차서 도움을 부탁드려요."
            className="w-[336px]  p-[10px] rounded-[10px] border border-[#729A73] !text-[14px] "
            value={request}
            onChange={(e) => setRequest(e.target.value)}
          />
        </div>
      </div>

      {/* 버튼 */}
      <CommonButton label={submitting ? "등록 중..." : "등록하기"} onClick={onSubmit} />
    </div>
  );
}
