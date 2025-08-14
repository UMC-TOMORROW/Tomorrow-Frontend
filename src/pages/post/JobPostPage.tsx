import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import JobTypeSelector from "../../components/jobPost/JobTypeSelector";
import JobTitleAndTags from "../../components/jobPost/JobTitleAndTags";
import JobPeriodSelector from "../../components/jobPost/JobPeriodSelector";
import JobWeekdaysSelector from "../../components/jobPost/JobWeekdaysSelector";
import JobTimeSelector from "../../components/jobPost/JobTimeSelector";
import SalaryInput from "../../components/jobPost/SalaryInput";
import RecruitInfo from "../../components/jobPost/RecruitInfo";
import JobDescription from "../../components/jobPost/JobDescription";
import CompanyInfo from "../../components/jobPost/CompanyInfo";
import Divider from "../../components/common/Devider";
import CommonButton from "../../components/common/CommonButton";

import type { RegistrantType, JobDraftPayload } from "../../types/jobs";
import { createJobDraft } from "../../apis/jobs";

// 요일 KO → EN 코드
const DAY_KO_TO_EN: Record<string, "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"> = {
  월: "mon",
  화: "tue",
  수: "wed",
  목: "thu",
  금: "fri",
  토: "sat",
  일: "sun",
};

// "오전/오후 HH:MM" → "HH:MM" 24시간
function to24h(t: string) {
  if (!t) return "";
  if (/^\d{2}:\d{2}$/.test(t)) return t; // 이미 24h면 통과
  const m = t.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
  if (!m) return t; // 모르면 원문 그대로(서버가 허용하면 통과)
  let h = parseInt(m[2], 10);
  const min = m[3];
  const pm = m[1] === "오후";
  if (pm && h !== 12) h += 12;
  if (!pm && h === 12) h = 0;
  return String(h).padStart(2, "0") + ":" + min;
}

// --- 로컬 enum 매핑(디자인/구성 변경 X) ---
const envMap: Record<string, "SIT" | "STAND" | "LIGHT_LIFTING" | "HEAVY_LIFTING" | "ACTIVE" | "CUSTOMER_SERVICE"> = {
  "앉아서 근무 중심": "SIT",
  "서서 근무 중심": "STAND",
  "가벼운 물건 운반": "LIGHT_LIFTING",
  "무거운 물건 운반": "HEAVY_LIFTING",
  "신체 활동 중심": "ACTIVE",
  "사람 응대 중심": "CUSTOMER_SERVICE",
};

const categoryMap: Record<string, string> = {
  서빙: "SERVING",
  "주방보조/설거지": "KITCHEN_ASSIST",
  "카페/베이커리": "CAFE_BAKERY",
  "과외/학원": "TUTORING",
  "심부름/소일거리": "ERRAND",
  "전단지/홍보": "PROMOTION",
  "어르신 돌봄": "ELDER_CARE",
  "아이 돌봄": "CHILD_CARE",
  "미용/뷰티": "BEAUTY",
  사무보조: "OFFICE_ASSIST",
  기타: "ETC",
};

const paymentMap: Record<string, "HOURLY" | "DAILY" | "MONTHLY" | "PER_TASK"> = {
  시급: "HOURLY",
  일급: "DAILY",
  월급: "MONTHLY",
  건별: "PER_TASK",
  건당: "PER_TASK",
};

const periodMap: Record<
  string,
  "SHORT_TERM" | "OVER_ONE_MONTH" | "OVER_THREE_MONTH" | "OVER_SIX_MONTH" | "OVER_ONE_YEAR"
> = {
  단기: "SHORT_TERM",
  "1개월 이상": "OVER_ONE_MONTH",
  "3개월 이상": "OVER_THREE_MONTH",
  "6개월 이상": "OVER_SIX_MONTH",
  "1년 이상": "OVER_ONE_YEAR",
};

// ------ 유틸 ------
const pruneNullish = (obj: any) => {
  const out: any = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") out[k] = v;
  });
  return out;
};

// envCategoriesKo -> ["can_work_standing", ...]
const buildEnvSnakeList = (envKoList: string[]) => {
  const mapped = new Set(envKoList.map((k) => envMap[k]));
  const list: string[] = [];
  if (mapped.has("STAND")) list.push("can_work_standing");
  if (mapped.has("SIT")) list.push("can_work_sitting");
  if (mapped.has("ACTIVE")) list.push("can_move_actively");
  if (mapped.has("CUSTOMER_SERVICE")) list.push("can_communicate");
  if (mapped.has("LIGHT_LIFTING") || mapped.has("HEAVY_LIFTING")) list.push("can_carry_objects");
  return list;
};

const JobPostForm = () => {
  const navigate = useNavigate();

  // 상태
  const [registrantType, setRegistrantType] = useState<RegistrantType>("PERSONAL");
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [periodLabel, setPeriodLabel] = useState("");
  const [periodNegotiable, setPeriodNegotiable] = useState(false);
  const [weekdaysKo, setWeekdaysKo] = useState<string[]>([]);
  const [dayNegotiable, setDayNegotiable] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeNegotiable, setTimeNegotiable] = useState(false);
  const [paymentLabel, setPaymentLabel] = useState("");
  const [salary, setSalary] = useState<number>(0);
  const [deadlineISO, setDeadlineISO] = useState<string | undefined>(undefined);
  const [headCount, setHeadCount] = useState<number | undefined>(undefined);
  const [preferenceText, setPreferenceText] = useState<string | undefined>(undefined);
  const [alwaysHiring, setAlwaysHiring] = useState(false);
  const [description, setDescription] = useState("");
  const [envCategoriesKo, setEnvCategoriesKo] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined); // 별도 업로드 후 URL 사용
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSalaryNegotiable, setIsSalaryNegotiable] = useState(false);

  // ---- 검증 ----
  const validateForm = () => {
    if (!title.trim()) return alert("업무 제목을 입력해주세요."), false;
    if (selectedTags.length === 0) return alert("업무 유형을 선택해주세요."), false;
    // if (!location.trim()) return alert("장소를 입력해주세요."), false;
    if (!periodLabel) return alert("근무 기간을 선택해주세요."), false;
    if (!paymentLabel) return alert("급여 유형을 선택해주세요."), false;
    if (!isSalaryNegotiable && (!salary || salary <= 0)) {
      return alert("급여 금액을 입력해주세요."), false;
    }
    if (!timeNegotiable && (!to24h(startTime) || !to24h(endTime))) {
      // 시간 형식 검증 (to24h로 변환 후 비어있지 않은지)
      const start24 = to24h(startTime);
      const end24 = to24h(endTime);
      if (!timeNegotiable && (!start24 || !end24)) {
        return alert("근무 시간을 올바르게 입력해주세요."), false;
      }
    }

    // 요일 형식 검증 (이 자리에서 EN 코드로 변환해서 길이 체크)
    const workDaysForValidate = dayNegotiable ? [] : weekdaysKo.map((ko) => DAY_KO_TO_EN[ko]).filter(Boolean);
    if (!dayNegotiable && workDaysForValidate.length === 0) {
      return alert("근무 요일을 선택해주세요."), false;
    }

    if (!alwaysHiring && !deadlineISO) return alert("모집 마감일을 설정해주세요."), false;

    const primaryKo = selectedTags[0];
    if (!categoryMap[primaryKo]) return alert(`업무 유형 '${primaryKo}'를 처리할 수 없습니다.`), false;
    if (!paymentMap[paymentLabel]) return alert("급여 유형이 올바르지 않습니다."), false;
    if (!periodMap[periodLabel]) return alert("근무 기간이 올바르지 않습니다."), false;
    return true;
  };

  const buildPayloadV2 = (): JobDraftPayload => {
    const primaryKo = selectedTags[0];
    const job_category = categoryMap[primaryKo]; // 필수

    // 요일: 한국어 → EN 코드 배열
    const work_days = dayNegotiable ? [] : weekdaysKo.map((ko) => DAY_KO_TO_EN[ko]).filter(Boolean);

    const raw = {
      // 기본
      title: title.trim(),
      job_description: description.trim(),

      // 등록 주체 / 카테고리
      recruitment_type: registrantType, // "PERSONAL" | "BUSINESS"
      job_category, // ★ 실제로 넣어주기

      // 기간
      work_period: periodMap[periodLabel],
      is_period_negotiable: !!periodNegotiable,

      // 요일
      work_days, // ["mon","wed",...]
      is_day_negotiable: !!dayNegotiable,

      // 시간 (24h로 변환)
      work_start: timeNegotiable ? "" : to24h(startTime),
      work_end: timeNegotiable ? "" : to24h(endTime),
      is_time_negotiable: !!timeNegotiable,

      // 급여
      payment_type: paymentMap[paymentLabel],
      salary: Number(salary) || 0,
      is_salary_negotiable: !!isSalaryNegotiable,

      // 마감/상시
      always_hiring: !!alwaysHiring,
      deadline: alwaysHiring ? undefined : deadlineISO ? new Date(deadlineISO).toISOString() : undefined,

      // 회사/위치 (검증 했으니 실제 전송)
      company_name: companyName || undefined,
      // location: location || undefined,
      latitude,
      longitude,
      is_active: !!isActive,

      // 환경 태그 (★ 오타 수정: work_environment)
      work_environment: buildEnvSnakeList(envCategoriesKo),

      // 이미지 URL은 업로드 후 세팅 (undefined면 prune로 제거됨)
      job_image_url: undefined as unknown as string,

      recruitment_limit: headCount,
      preferred_qualifications: preferenceText,
    };

    return pruneNullish(raw) as JobDraftPayload;
  };

  // ---- 제출 ----
  const onSubmit = async () => {
    console.log("[JobPostForm] 제출 시작");
    if (!validateForm()) return;

    const body = buildPayloadV2();
    console.log("[JobPostForm] 최종 payload(v2):", body);

    try {
      setSubmitting(true);

      // ✅ createJobDraft는 이제 인자 1개만 받음
      const { jobId, registrantType: who, step, raw } = await createJobDraft(body);

      console.log("[JobPostForm] 전송 성공:", raw);
      console.log("[JobPostForm] 획득 jobId:", jobId, "step:", step, "who:", who);

      // 보관 + 이동
      const resolvedWho = who || registrantType;
      const next = resolvedWho === "BUSINESS" ? "/post/business" : "/post/personal";
      if (jobId != null) sessionStorage.setItem("jobId", String(jobId));

      // step/코드 여부와 무관하게 이동 (UX 보장)
      navigate(`${next}${jobId != null ? `?jobId=${jobId}` : ""}`, {
        state: { jobId },
      });
    } catch (e: any) {
      const status = e?.response?.status;
      const data = e?.response?.data;

      console.group("[JobPostForm] 전송 실패");
      console.log("status:", status);
      console.log("headers:", e?.response?.headers);
      console.log("data(raw):", data);
      try {
        console.log("data(string):", typeof data === "string" ? data : JSON.stringify(data, null, 2));
      } catch {}
      console.groupEnd();

      if (status === 401 || status === 403) {
        // 로그인 필요 → 로그인 후 다시 돌아오도록 next 세팅
        const nextUrl = window.location.pathname + window.location.search;
        navigate(`/auth?next=${encodeURIComponent(nextUrl)}`);
        return;
      }
      alert(data?.message ?? e?.message ?? "등록 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[375px] mx-auto px-4 py-8">
      <div className="-mx-4 !px-4 w-full flex items-center justify-between h-14 border-b border-[#DEDEDE] relative pb-5">
        <button className="text-[20px]" onClick={() => navigate(-1)}>
          ✕
        </button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[18px] font-bold font-pretendard">
          일자리 등록
        </h1>
      </div>

      <div className="flex flex-col gap-6 !mx-4">
        {/* 1. 기업/개인 선택 */}
        <JobTypeSelector value={registrantType} onChange={(v: RegistrantType) => setRegistrantType(v)} />
        <Divider />

        {/* 2. 업무 제목 + 태그 선택 */}
        <JobTitleAndTags
          title={title}
          onTitleChange={setTitle}
          selectedTags={selectedTags}
          onSelectedTagsChange={setSelectedTags}
        />
        <Divider />

        {/* 3. 일하는 기간 */}
        <JobPeriodSelector
          periodLabel={periodLabel}
          onChangeLabel={setPeriodLabel}
          negotiable={periodNegotiable}
          onChangeNegotiable={setPeriodNegotiable}
        />

        {/* 4. 요일 선택 */}
        <JobWeekdaysSelector
          value={weekdaysKo}
          onChange={setWeekdaysKo}
          negotiable={dayNegotiable}
          onChangeNegotiable={setDayNegotiable}
        />

        {/* 5. 일하는 시간 */}
        <JobTimeSelector
          start={startTime}
          end={endTime}
          negotiable={timeNegotiable}
          onChange={({ start, end, negotiable }) => {
            setStartTime(start);
            setEndTime(end);
            setTimeNegotiable(negotiable);
          }}
        />
        <Divider />

        {/* 6. 급여 작성 */}
        <SalaryInput
          paymentLabel={paymentLabel}
          amount={salary}
          negotiable={isSalaryNegotiable}
          onChange={({ paymentLabel, amount, negotiable }) => {
            console.log("[JobPostForm] ← SalaryInput change:", { paymentLabel, amount, negotiable });
            setPaymentLabel(paymentLabel);
            setSalary(Number(amount || 0));
            if (negotiable !== undefined) setIsSalaryNegotiable(!!negotiable);
          }}
        />
        <Divider />

        {/* 7. 모집 정보 */}
        <RecruitInfo
          deadlineISO={deadlineISO}
          headCount={headCount}
          preferenceText={preferenceText}
          alwaysHiring={alwaysHiring}
          onChange={(v) => {
            if (v.deadlineISO !== undefined) setDeadlineISO(v.deadlineISO);
            if (v.headCount !== undefined) setHeadCount(v.headCount);
            if (v.preferenceText !== undefined) setPreferenceText(v.preferenceText);
            if (v.alwaysHiring !== undefined) setAlwaysHiring(v.alwaysHiring);
          }}
        />
        <Divider />

        {/* 8. 일 설명 */}
        <JobDescription
          value={description}
          onChange={setDescription}
          envTags={envCategoriesKo}
          onEnvTagsChange={setEnvCategoriesKo}
          imageFile={imageFile}
          onImageFileChange={(f) => setImageFile(f ?? undefined)}
        />
        <Divider />

        {/* 9. 업체 정보 (표엔 없지만 폼 표시/검증용) */}
        <CompanyInfo
          companyName={companyName}
          location={location}
          alwaysHiring={alwaysHiring}
          isActive={isActive}
          onChange={(v: any) => {
            if (v.companyName !== undefined) setCompanyName(v.companyName);
            if (v.location !== undefined) setLocation(v.location);
            if (v.alwaysHiring !== undefined) setAlwaysHiring(v.alwaysHiring);
            if (v.isActive !== undefined) setIsActive(v.isActive);
            if (v.latitude !== undefined) setLatitude(v.latitude);
            if (v.longitude !== undefined) setLongitude(v.longitude);
          }}
        />

        {/* 10. 제출 */}
        <CommonButton label={submitting ? "등록 중..." : "다음"} onClick={onSubmit} />
      </div>
    </div>
  );
};

export default JobPostForm;
