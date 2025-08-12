import React from "react";
import starEmpty from "../../assets/star/star_empty.png";
import starFilled from "../../assets/star/star_filled.png";
import starHalf from "../../assets/star/star_half_filled.png";
import bmEmpty from "../../assets/bookmark/star_empty.png";
import bmFilled from "../../assets/bookmark/star_filled.png";

// NOTE: Pure UI only (no API). Swap mock with real data later.
// TailwindCSS assumed. Width targets mobile (max-w-375).

// ---- Mock data to visualize the screen ----
const mockJob = {
  jobId: 1,
  category: "상점/소규모가게",
  title: "청소 관리 도우미",
  companyName: "내일텃밭",
  place: "성동구",
  rating: 4.2,
  reviewCount: 32,
  paymentType: "시급",
  salary: 13000,
  minWageNote: "2025년 최저시급 10,030원",
  period: "3개월 이상",
  weekdays: "요일협의",
  time: "시간협의",
  role: "상시모집",
  headcount: 6,
  preference: "유사업무 경력 우대, 인근 거주 우대",
  tip: "날 예약 없는 날, 지금 연락해보세요.",
  address: "서울 강서구 00로 000",
  description:
    "현재 밭에는 상추와 방울토마토, 고추, 쪽파 등 여러 종이 있습니다. 주기적으로 작물을 새로 심고 수확하는 곳입니다. 모종 심기부터 작물 재배와 수확까지 전 과정 성실히 일해주실 분을 찾습니다. 초보자도 환영합니다. ^^",
};

// ---- Small UI helpers ----
const Divider: React.FC = () => <div className="h-px bg-[#EAEAEA] -mx-4" />;

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="items-center !px-2 opacity-100 rounded-[8px] border border-[#EE0606CC]/80 text-[14px] bg-white text-[#EE0606CC]">
    {children}
  </span>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-3">
    <h3 className="text-[16px] leading-[100%] !font-bold text-[#333] font-pretendard font-bold !pb-4">{title}</h3>
    {children}
  </section>
);

const KV: React.FC<{ k: string; v: React.ReactNode; helper?: string }> = ({ k, v, helper }) => (
  <div className="!py-1 ">
    {/* 값 라인: 왼쪽 정렬 + 일정 간격 */}
    <div className="flex items-start gap-4 ">
      <span className="w-[72px] shrink-0 text-[12px] text-[#666] whitespace-nowrap">{k}</span>
      <div className="text-[14px] text-[#222] leading-5">{v}</div>
    </div>

    {/* helper 라인: 값 시작점과 정확히 같은 지점에서 시작 */}
    {helper ? (
      <div className="mt-1 flex items-start gap-4 ">
        <span className="w-[72px] shrink-0" /> {/* 라벨 자리만큼 비워서 정렬 */}
        <p className="text-[11px] text-[#8A8A8A]">{helper}</p>
      </div>
    ) : null}
  </div>
);

const StarsImg: React.FC<{ value?: number; size?: number; gap?: number }> = ({ value = 0, size = 17, gap = 2 }) => {
  const safe = Math.max(0, Math.min(5, Number.isFinite(value as number) ? (value as number) : 0));
  const full = Math.floor(safe);
  const frac = safe - full;
  const parts = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "full" as const;
    if (i === full) {
      if (frac >= 0.75) return "full" as const;
      if (frac >= 0.25) return "half" as const;
    }
    return "empty" as const;
  });
  const srcMap = { full: starFilled, half: starHalf, empty: starEmpty } as const;
  return (
    <div className="flex items-center" style={{ gap }} aria-label={`평점 ${safe.toFixed(1)} / 5`}>
      {parts.map((p, idx) => (
        <img key={idx} src={srcMap[p]} alt="" width={size} height={size} />
      ))}
    </div>
  );
};

export default function JobDetailPageUI() {
  const job = mockJob; // replace with API data later

  // 업무환경 → 한글 라벨
  const envKoMap: Record<string, string> = {
    can_carry_objects: "가벼운 물건 운반",
    can_move_actively: "신체 활동 중심",
    can_work_standing: "서서 근무 중심",
    can_work_sitting: "앉아서 근무 중심",
    can_communicate: "사람 응대 중심",
  };

  // envTags 값 만들기 (API/목업 둘 다 대응, 없으면 기본 2개)
  const rawEnv = (job as any).work_enviroment ?? (job as any).work_environment;
  const envTags: string[] = rawEnv
    ? (Array.isArray(rawEnv) ? rawEnv : [rawEnv]).map((k) => envKoMap[k] ?? k)
    : ["가벼운 물건 운반", "신체 활동 중심"];

  // 북마크 상태
  const [bookmarked, setBookmarked] = React.useState(false);

  return (
    <div className="max-w-[375px] mx-auto bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <div className="-mx-4 px-4 w-full flex items-center justify-between h-14 border-b border-[#DEDEDE] relative">
          <button className="text-[20px] w-12 h-12 flex items-center justify-center" aria-label="뒤로가기">
            ✕
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-bold font-pretendard">일자리 정보</h1>
        </div>
      </div>

      <div className="!px-4 !pt-4 !pb-28 !space-y-8">
        {/* Summary */}
        <section className="!space-y-2">
          <p className="text-[14px] leading-[100%] text-[#729A73] font-pretendard font-normal">{job.category}</p>
          <h2 className="text-[18px] font-extrabold leading-[100%] text-[#333] font-pretendard">{job.title}</h2>
          <p className="text-[12px] leading-[100%] text-[#333] font-pretendard font-normal">
            {job.companyName ?? job.place}
          </p>
          <div className="flex items-center gap-2 text-[12px] text-[#777]">
            <StarsImg value={job.rating} />
            <span className="inline-flex items-center !px-2 !py-0.5 rounded-full border border-[#BFD6C0] text-[#557E59]">
              후기 {job.reviewCount}건
            </span>
          </div>
        </section>

        <Divider />

        {/* 근무조건 */}
        <Section title="근무조건">
          <KV
            k="급여"
            v={
              <span className="inline-flex items-center gap-2">
                <Badge>{job.paymentType}</Badge>
                <span>{job.salary.toLocaleString()}원</span>
              </span>
            }
            helper={job.minWageNote}
          />
          <KV k="근무기간" v={<span>{job.period}</span>} />
          <KV k="근무요일" v={<span>{job.weekdays}</span>} />
          <KV k="근무시간" v={<span>{job.time}</span>} />
        </Section>

        <Divider />

        {/* 모집조건 */}
        <Section title="모집조건">
          <KV k="모집마감" v={<span>{job.role}</span>} />
          <KV k="모집인원" v={<span>{job.headcount}명</span>} />
          <KV k="우대사항" v={<span>{job.preference}</span>} />

          <div className="w-[335px] h-[92px] rounded-[10px] p-[15px] flex flex-col gap-[15px] bg-[#B8CDB959] text-[#3F5A41] !mt-7">
            <p className="mb-3 font-bold text-[14px] text-[#333]">
              <span className="text-[#729A73]">✨ 내 몸에 맞는 일,</span> 지금 추천해드릴게요.
            </p>
            <div className="flex flex-wrap gap-[10px]">
              {envTags.map((t, i) => (
                <span
                  key={i}
                  className="min-w-[108px] h-[24px] rounded-[7px] px-[6px] py-[1px] inline-flex items-center justify-center text-[12px] font-pretendard text-[#3F5A41]"
                  style={{ background: "#729A7380" }} // 정확 색상(알파 포함)
                >
                  <span className="mr-[6px]">✅</span>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Section>

        <Divider />

        {/* 근무지역 */}
        <Section title="근무지역">
          <div className="text-[14px] text-[#333] !mt-3">{job.address}</div>
        </Section>

        <Divider />

        {/* 상세요강 */}
        <Section title="상세요강">
          <div className="rounded-[12px] !p-4 border border-[#555]/85 ">
            <p className="text-[14px] text-[#333] leading-6 whitespace-pre-wrap">{job.description}</p>
          </div>
        </Section>
      </div>

      {/* 하단 고정 CTA (센터 고정 + 최대 375px) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white border-t border-[#E5E7EB]">
        <div className="px-4 pt-2 pb-[max(16px,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3">
            {/* 찜하기: 고정폭 + 줄어들지 않게 */}
            <button
              aria-label="찜하기"
              className="w-12 h-12 shrink-0 rounded-[10px] bg-[#729A73] flex items-center justify-center"
            >
              <img src={bmEmpty} alt="" />
            </button>

            {/* 전화/지원: 컨텐츠가 길어도 줄어들도록 min-w-0 */}
            <button className="flex-1 min-w-0 h-12 rounded-[10px] border border-[#729A73] text-[#729A73] font-semibold">
              전화하기
            </button>
            <button className="flex-1 min-w-0 h-12 rounded-[10px] bg-[#729A73] text-white font-semibold">
              지원하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
