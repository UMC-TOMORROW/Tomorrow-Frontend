import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Devider from "../common/Devider";
import CommonButton from "../common/CommonButton";
import { axiosInstance } from "../../apis/axios";

export default function PersonalStep() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [request, setRequest] = useState("");
  const [submitting, setSubmitting] = useState(false);
  console.log(setLatitude,setLongitude)
  // 필수: name, address, contact(phone), registrationPurpose
  const canSubmit = !!(name && address && phone && request);

  const onSubmit = async () => {
    if (!canSubmit) {
      alert("필수 항목(이름, 주소, 연락처, 요청 내용)을 입력해주세요.");
      return;
    }

    // 지도 연동 전 임시 좌표(서울시청) 기본값
    const lat = latitude ?? 37.5665;
    const lng = longitude ?? 126.978;

    // ✅ 스웨거 스펙: camelCase만 전송
    const payload = {
      name: name.trim(),
      latitude: lat,
      longitude: lng,
      contact: phone.trim(),
      registrationPurpose: request.trim(),
      address: address.trim(),
    };

    try {
      setSubmitting(true);

      // 세션 기반: jobId path variable 사용 X
      await axiosInstance.post("/api/v1/jobs/personal_registrations", payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      });

      alert("등록이 완료되었습니다.");
      // 서버가 모든 절차 끝낸 뒤 자체적으로 jobId 부여. 응답 의존 X.
      navigate("/", { replace: true });
    } catch (e: any) {
      const status = e?.response?.status;
      const data = e?.response?.data;
      console.group("[PersonalStep] 제출 실패");
      console.log("status:", e?.response?.status);
      console.log("headers:", e?.response?.headers);
      console.log("data:", e?.response?.data);
      console.groupEnd();

      // 세션에 드래프트 job이 없을 때 나올 수 있음 (1차 폼 단계 누락)
      if (status === 400 || status === 409) {
        alert("이전 단계(일자리 등록 1차 폼)를 먼저 제출해주세요.");
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
          간단한 요청 내용을 적어주세요. 구직자가 확인하고 지원하는 데 도움이 됩니다.
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
            placeholder="이내일"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73] !text-[14px]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 주소 → address */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">주소</label>
          <input
            type="text"
            placeholder="서울 강서구 oo로 ooo"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73] !text-[14px]"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
            className="w-[336px] p-[10px] rounded-[10px] border border-[#729A73] !text-[14px]"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
          />
        </div>

        {/* (옵션) 좌표 수동 입력 UI 필요 시 */}
        {/*
        <div className="flex gap-2">
          <input type="number" step="0.000001" placeholder="위도" value={latitude ?? ""} onChange={e => setLatitude(Number(e.target.value) || undefined)} />
          <input type="number" step="0.000001" placeholder="경도" value={longitude ?? ""} onChange={e => setLongitude(Number(e.target.value) || undefined)} />
        </div>
        */}
      </div>

      <CommonButton label={submitting ? "등록 중..." : "등록하기"} onClick={onSubmit} />
    </div>
  );
}
