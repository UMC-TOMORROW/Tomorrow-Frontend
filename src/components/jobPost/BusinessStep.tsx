import { useEffect, useState } from "react";
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

  // YYYY-MM-DD 형식으로 변환
  const toYMD = (v: any) => {
    const s = String(v ?? "");
    if (!s) return "";
    const m = s.match(/^\d{4}-\d{2}-\d{2}/);
    if (m) return m[0];
    const d = new Date(s);
    if (isNaN(d.getTime())) return "";
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  };

  // 숫자 4자리 넘어가면 자르기(모바일 입력 보정)
  const clampDateYear = (raw: string) => {
    const [y = "", m = "", d = ""] = String(raw).split("-");
    let year = y.replace(/\D/g, "");
    if (year.length > 4) year = year.slice(0, 4);
    if (year && Number(year) > 9999) year = "9999";
    return [year, m, d].filter(Boolean).join("-");
  };

  // ✅ 페이지 진입 시 기존 사업자 DB가 있으면 입력 칸을 채운다
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.post("/api/v1/jobs/business-verifications/checkPage", undefined, {
          withCredentials: true,
          headers: { Accept: "application/json" },
        });

        // 스펙: { timestamp, code, message, result: { bizNumber, companyName, ownerName, openingDate } }
        const r = data?.result ?? {};
        if (r) {
          setRegNo(
            String(r.bizNumber ?? "")
              .replace(/\D+/g, "")
              .slice(0, 10)
          );
          setCorpName(String(r.companyName ?? ""));
          setOwner(String(r.ownerName ?? ""));
          setOpenDate(toYMD(r.openingDate));
        }
      } catch {
        // 등록 이력 없으면 그대로 빈칸 유지
        console.log("사업자 정보 없음");
      }
    })();
  }, []);

  const canSubmit = regNo && corpName && owner && openDate;

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

      // 1) 사업자 정보 저장 (업서트: POST 실패 시 PUT으로 재시도)
      try {
        await axiosInstance.post("/api/v1/jobs/business-verifications/only", payload, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      } catch (err: any) {
        const s = err?.response?.status;
        if (s === 405 || s === 409) {
          await axiosInstance.put("/api/v1/jobs/business-verifications/only", payload, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });
        } else {
          throw err;
        }
      }

      alert("사업자 정보가 저장되었습니다.");
      navigate("/Mypage/EmployerMyPage", { replace: true });
    } catch (e: any) {
      const s = e?.response?.status;
      const d = e?.response?.data;

      console.group("[BusinessStep] 제출 실패");
      console.log("status:", s);
      console.log("data:", d);
      console.groupEnd();

      // 검증에러(COMMON402) 등 필드 메시지 우선 노출
      if (s === 400 && (d?.code === "COMMON402" || /Validation/i.test(String(d?.message ?? "")))) {
        const errs = d?.result && typeof d.result === "object" ? d.result : {};
        const merged = Object.values(errs).filter(Boolean).join("\n") || "입력값을 확인해주세요.";
        alert(merged);
        return;
      }

      const msg =
        d?.message ||
        d?.result?.message ||
        (d?.result && typeof d.result === "object"
          ? Object.entries(d.result)
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
            max="9999-12-31"
            onInput={(e) => {
              const t = e.currentTarget;
              const fixed = clampDateYear(t.value);
              if (fixed !== t.value) {
                t.value = fixed; // 타이핑 중 즉시 교정 (사파리/크롬 모두 동작)
              }
            }}
            onChange={(e) => {
              // 최종 반영 시도 시에도 한 번 더 안전하게 클램프
              const fixed = clampDateYear(e.target.value);
              setOpenDate(fixed);
            }}
          />
        </div>
      </div>

      <CommonButton label={submitting ? "등록 중..." : "등록하기"} onClick={onSubmit} />
    </div>
  );
}
