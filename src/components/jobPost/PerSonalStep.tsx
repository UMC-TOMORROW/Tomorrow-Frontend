import { useEffect, useMemo, useState } from "react";
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
  const [request, setRequest] = useState(""); // payload.registrationPurpose
  const [latitude, _setLatitude] = useState<number | undefined>(undefined);
  const [longitude, _setLongitude] = useState<number | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  // 서버 필수: name, location, contact, registrationPurpose, latitude, longitude
  const canSubmit = !!(name && district && phone && request);

  const onSubmit = async () => {
    if (!canSubmit) {
      alert("필수 항목(이름, 주소, 연락처, 요청 내용)을 입력해주세요.");
      return;
    }

    // 지도 연동 전까지 테스트용 기본 좌표
    const lat = latitude ?? 37.5665;
    const lng = longitude ?? 126.978;

    // 서버 검증 로그 기준 camelCase, 문서 스니펫 호환 위해 snake_case도 같이 전송
    const payload = {
      name: name.trim(),
      location: district.trim(), // 문서 address 예시가 있지만 실제 서버는 location을 검증하는 케이스가 많음
      latitude: lat,
      longitude: lng,
      contact: phone.trim(),
      registrationPurpose: request.trim(), // ✅ 서버 검증
      registration_purpose: request.trim(), // 📄 문서 예시 호환
      // body에 jobId가 필요 없지만, 혹시 대비:
      ...(jobId != null ? { jobId: Number(jobId) } : {}),
    };

    try {
      setSubmitting(true);

      // PathVariable 엔드포인트 우선
      const url =
        jobId != null ? `/api/v1/jobs/${jobId}/personal_registrations` : `/api/v1/jobs/personal_registrations`;

      console.log("[PersonalStep] POST", url, payload);

      await axiosInstance.post(url, payload, {
        withCredentials: true, // 쿠키 인증
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      navigate("/", { state: { jobId } });
    } catch (e: any) {
      const status = e?.response?.status;
      const data = e?.response?.data;
      console.group("[PersonalStep] 제출 실패");
      console.log("status:", status);
      console.log("data:", data);
      try {
        const details = data?.result ?? data?.errors ?? data;
        console.log("details:", typeof details === "string" ? details : JSON.stringify(details, null, 2));
      } catch {}
      console.groupEnd();

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
          간단한 요청 내용을 적어주세요.
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

        {/* 주소 → location */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">주소</label>
          <input
            type="text"
            placeholder="서울 강서구 oo로 ooo"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73] !text-[14px]"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
        </div>

        {/* 연락처 → contact */}
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

        {/* 요청 내용 → registrationPurpose */}
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
