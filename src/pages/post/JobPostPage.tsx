// src/pages/post/JobPostForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../apis/axios";

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

const periodMap: Record<string, "SHORT_TERM" | "OVER_ONE_MONTH" | "OVER_THREE_MONTH" | "OVER_ONE_YEAR"> = {
  단기: "SHORT_TERM",
  "1개월 이상": "OVER_ONE_MONTH",
  "3개월 이상": "OVER_THREE_MONTH",
  "1년 이상": "OVER_ONE_YEAR",
};

type RegistrantType = "BUSINESS" | "PERSONAL";

// ------ 유틸 ------
const pruneNullish = (obj: any) => {
  const out: any = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") out[k] = v;
  });
  return out;
};

// envCategoriesKo -> ["can_work_standing", ...] 변환
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

// 응답 파싱 유틸
const pickResult = (res: any) => {
  if (res?.data?.result) return res.data.result; // COMMON200 래핑형
  if (res?.data?.data) return res.data.data; // data 키 사용형
  if (res?.data && typeof res.data === "object") return res.data; // 루트 payload
  return null;
};

const getJobIdFromLocation = (headers: any) => {
  const loc = headers?.location || headers?.Location;
  if (!loc || typeof loc !== "string") return null;
  const last = loc.split("/").filter(Boolean).pop();
  if (!last) return null;
  // 숫자면 숫자로, 아니면 문자열 그대로
  return /^\d+$/.test(last) ? Number(last) : last;
};

// ★ 로컬에서 임시 jobId 생성(0 → 1 → 2 …)
const getNextJobId = () => {
  const lastRaw = localStorage.getItem("lastJobId");
  const last = Number.isFinite(Number(lastRaw)) ? Number(lastRaw) : 0;
  const next = last + 1;
  localStorage.setItem("lastJobId", String(next));
  return next; // number
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
  const [headCount, setHeadCount] = useState<number | undefined>(undefined); // 내부 검증용
  const [preferenceText, setPreferenceText] = useState<string | undefined>(undefined);
  const [alwaysHiring, setAlwaysHiring] = useState(false);
  const [description, setDescription] = useState("");
  const [envCategoriesKo, setEnvCategoriesKo] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined); // 스펙상 URL 기반
  const [companyName, setCompanyName] = useState(""); // 내부 폼 유지
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ---- 검증 ----
  const validateForm = () => {
    if (!title.trim()) return alert("업무 제목을 입력해주세요."), false;
    if (selectedTags.length === 0) return alert("업무 유형을 선택해주세요."), false;
    if (!location.trim()) return alert("장소를 입력해주세요."), false;
    if (!periodLabel) return alert("근무 기간을 선택해주세요."), false;
    if (!paymentLabel) return alert("급여 유형을 선택해주세요."), false;
    if (!salary || salary <= 0) return alert("급여 금액을 입력해주세요."), false;

    if (!timeNegotiable && (!startTime || !endTime)) {
      return alert("근무 시간을 입력해주세요."), false;
    }
    if (!dayNegotiable && weekdaysKo.length === 0) {
      return alert("근무 요일을 선택해주세요."), false;
    }
    if (!alwaysHiring && !deadlineISO) {
      return alert("모집 마감일을 설정해주세요."), false;
    }

    const effectivePrimaryKo = selectedTags[0];
    if (!categoryMap[effectivePrimaryKo]) {
      return alert(`업무 유형 '${effectivePrimaryKo}'를 처리할 수 없습니다.`), false;
    }
    if (!paymentMap[paymentLabel]) {
      return alert("급여 유형이 올바르지 않습니다."), false;
    }
    if (!periodMap[periodLabel]) {
      return alert("근무 기간이 올바르지 않습니다."), false;
    }
    return true;
  };

  // ---- 스펙(표) 기준 payload: snake_case + 평면 ----
  const buildPayloadV2 = () => {
    const effectivePrimaryKo = selectedTags[0];

    const raw = {
      title: title.trim(),
      jobDescription: description.trim(), // 서버가 job_description만 읽을 수도 있어 아래에서 보강
      recruitment_type: registrantType, // "PERSONAL" | "BUSINESS"
      work_period: periodMap[periodLabel], // enum
      work_days: dayNegotiable ? [] : weekdaysKo, // ["월","수"...] 협의면 빈 배열
      work_start: timeNegotiable ? "" : startTime, // "HH:mm" or ""
      work_end: timeNegotiable ? "" : endTime, // "HH:mm" or ""
      salary: Number(salary),
      work_enviroment: buildEnvSnakeList(envCategoriesKo), // ["can_work_standing", ...]
      payment_type: paymentLabel, // "시급"/"일급"/"월급"/"건별"
      deadline: alwaysHiring ? "" : deadlineISO || "", // 마감 없으면 빈 문자열
      job_image_url: undefined as unknown as string, // 별도 업로드 후 URL 넣기
      isTimeNegotiable: !!timeNegotiable,
      isPeriodNegotiable: !!periodNegotiable,

      // 필요시 확장:
      // job_category: categoryMap[effectivePrimaryKo],
      // location: location.trim(),
      // latitude, longitude,
    };

    const body: any = pruneNullish(raw);
    body.job_description = body.jobDescription ?? description.trim(); // 보수적
    return body;
  };

  // ---- 제출 ----
  const onSubmit = async () => {
    console.log("[JobPostForm] 제출 시작");
    if (!validateForm()) return;

    const body = buildPayloadV2();
    console.log("[JobPostForm] 최종 payload(v2):", body);

    try {
      setSubmitting(true);

      const token = localStorage.getItem("accessToken"); // 있으면 Authorization에 포함

      const res = await axiosInstance.post("/api/v1/jobs", body, {
        withCredentials: true, // 쿠키 세션 병행
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      console.log("[JobPostForm] 전송 성공:", res.data);

      // 1) 응답 파싱
      const parsed = pickResult(res);
      const who = parsed?.registrantType || registrantType;
      const step = parsed?.step || res?.data?.result?.step;

      // 2) jobId 확보 시도: result → Location 헤더
      let jobId: any = parsed?.jobId ?? res.data?.result?.jobId ?? null;
      if (!jobId) jobId = getJobIdFromLocation(res?.headers);

      // 3) 폴백: 로컬에서 0→1→2… 증가하는 임시 jobId 생성
      if (!jobId || (typeof jobId === "number" && !Number.isFinite(jobId))) {
        jobId = getNextJobId();
        console.warn("임시 jobId 생성해서 사용, jobId:", jobId);
      }

      // 4) 보관 + 이동 (쿼리+state+세션)
      sessionStorage.setItem("jobId", String(jobId));
      const next = who === "BUSINESS" ? "/post/business" : "/post/personal";

      // 성공 코드면 바로 이동
      if (step === "job_form_saved" || res?.data?.code === "COMMON200") {
        navigate(`${next}?jobId=${jobId}`, { state: { jobId } });
        return;
      }

      // 형식이 달라도 이동 (최악의 경우 UX 보장)
      navigate(`${next}?jobId=${jobId}`, { state: { jobId } });
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data;

      console.group("[JobPostForm] 전송 실패");
      console.log("status:", status);
      console.log("headers:", error?.response?.headers);
      console.log("data(raw):", data);
      try {
        console.log("data(string):", typeof data === "string" ? data : JSON.stringify(data, null, 2));
      } catch {}
      console.groupEnd();

      if (status === 401 || status === 403) {
        alert("로그인이 필요해요. 로그인 후 다시 시도해줘.");
        return;
      }
      alert(data?.message ?? error?.message ?? "등록 실패");
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
        <JobTypeSelector
          value={registrantType}
          onChange={(v: RegistrantType) => {
            console.log("[JobTypeSelector] 선택:", v);
            setRegistrantType(v);
          }}
        />
        <Divider />

        {/* 2. 업무 제목 + 태그 선택 */}
        <JobTitleAndTags
          title={title}
          onTitleChange={(v) => {
            console.log("[JobTitleAndTags] 제목:", v);
            setTitle(v);
          }}
          selectedTags={selectedTags}
          onSelectedTagsChange={(arr) => {
            console.log("[JobTitleAndTags] 태그:", arr);
            setSelectedTags(arr);
          }}
        />
        <Divider />

        {/* 3. 일하는 기간 */}
        <JobPeriodSelector
          periodLabel={periodLabel}
          onChangeLabel={(v) => {
            console.log("[JobPeriodSelector] 기간:", v);
            setPeriodLabel(v);
          }}
          negotiable={periodNegotiable}
          onChangeNegotiable={(b) => {
            console.log("[JobPeriodSelector] 기간협의:", b);
            setPeriodNegotiable(b);
          }}
        />

        {/* 4. 요일 선택 */}
        <JobWeekdaysSelector
          value={weekdaysKo}
          onChange={(arr) => {
            console.log("[JobWeekdaysSelector] 요일:", arr);
            setWeekdaysKo(arr);
          }}
          negotiable={dayNegotiable}
          onChangeNegotiable={(b: boolean) => {
            console.log("[JobWeekdaysSelector] 요일 협의:", b);
            setDayNegotiable(b);
          }}
        />

        {/* 5. 일하는 시간 */}
        <JobTimeSelector
          start={startTime}
          end={endTime}
          negotiable={timeNegotiable}
          onChange={({ start, end, negotiable }) => {
            console.log("[JobTimeSelector] 시간:", { start, end, negotiable });
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
          onChange={({ paymentLabel, amount }) => {
            console.log("[SalaryInput] 급여:", { paymentLabel, amount });
            setPaymentLabel(paymentLabel);
            setSalary(Number(amount || 0));
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
            console.log("[RecruitInfo] 변경:", v);
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
          onChange={(t) => {
            console.log("[JobDescription] 설명 변경");
            setDescription(t);
          }}
          envTags={envCategoriesKo}
          onEnvTagsChange={(arr) => {
            console.log("[JobDescription] 환경태그 변경:", arr);
            setEnvCategoriesKo(arr);
          }}
          imageFile={imageFile}
          onImageFileChange={(f) => {
            console.log("[JobDescription] 이미지 변경(파일 보관만):", f?.name);
            setImageFile(f ?? undefined);
          }}
        />
        <Divider />

        {/* 9. 업체 정보 (표엔 없지만 폼 표시/검증용) */}
        <CompanyInfo
          companyName={companyName}
          location={location}
          alwaysHiring={alwaysHiring}
          isActive={isActive}
          onChange={(v: any) => {
            console.log("[CompanyInfo] 변경:", v);
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
