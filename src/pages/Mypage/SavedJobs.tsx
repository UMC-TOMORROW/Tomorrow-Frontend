import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";
import JobCard from "../../components/Homepage/JobCard";
import { getSavedJobs } from "../../apis/mypage";
import { getJobDetail } from "../../apis/jobs";
import { axiosInstance } from "../../apis/axios";
import type { BookmarkItem } from "../../types/mypage";
import type { PaymentType } from "../../types/homepage";

const asPaymentType = (v: any): PaymentType => {
  if (v === "HOURLY" || v === "DAILY" || v === "MONTHLY" || v === "PER_TASK")
    return v;
  return "HOURLY";
};

const isTrueLike = (v: unknown) =>
  v === true ||
  v === 1 ||
  v === "1" ||
  v === "true" ||
  v === "TRUE" ||
  v === "y" ||
  v === "Y" ||
  v === "yes" ||
  v === "YES";

const isPlainObject = (v: unknown): v is Record<string, any> =>
  !!v && typeof v === "object" && !Array.isArray(v);

const getPath = (obj: unknown, path: (string | number)[]) => {
  let cur: any = obj;
  for (const key of path) {
    if (!isPlainObject(cur) && typeof cur !== "object") return undefined;
    cur = cur?.[key as any];
    if (cur == null) return undefined;
  }
  return cur;
};

const extractEnv = (d: any): Record<string, boolean> | undefined => {
  if (!d) return undefined;

  const rawCandidates: any[] = [
    d.workEnvironment,
    d.work_environment,
    d.environment,
    getPath(d, ["work", "environment"]),
    getPath(d, ["work", "workEnvironment"]),
    getPath(d, ["job", "workEnvironment"]),
    getPath(d, ["job", "environment"]),
    getPath(d, ["data", "workEnvironment"]),
    getPath(d, ["data", "environment"]),
    getPath(d, ["details", "workEnvironment"]),
    getPath(d, ["details", "environment"]),
    getPath(d, ["workInfo", "workEnvironment"]),
    getPath(d, ["work_info", "work_environment"]),
  ].filter((x) => x != null);

  const toRecord = (src: any): Record<string, boolean> | undefined => {
    if (isPlainObject(src)) {
      const out: Record<string, boolean> = {};
      Object.entries(src).forEach(([k, v]) => {
        if (typeof v === "boolean") out[k] = v;
        else if (typeof v === "string" || typeof v === "number")
          out[k] = isTrueLike(v);
      });
      return Object.keys(out).length ? out : undefined;
    }
    if (Array.isArray(src) && src.every((x) => typeof x === "string")) {
      const out: Record<string, boolean> = {};
      (src as string[]).forEach((k) => (out[k] = true));
      return Object.keys(out).length ? out : undefined;
    }
    if (Array.isArray(src) && src.every((x) => isPlainObject(x))) {
      const out: Record<string, boolean> = {};
      (src as Record<string, any>[]).forEach((row) => {
        const k = (row.key ?? row.name ?? row.id ?? row.code) as
          | string
          | undefined;
        const v = row.value ?? row.enabled ?? row.checked ?? row.flag;
        if (typeof k === "string") out[k] = isTrueLike(v);
      });
      return Object.keys(out).length ? out : undefined;
    }
    return undefined;
  };

  for (const cand of rawCandidates) {
    const rec = toRecord(cand);
    if (rec) return rec;
  }

  const scanOnce = (obj: any, out: Record<string, boolean>) => {
    if (!isPlainObject(obj)) return;
    Object.entries(obj).forEach(([k, v]) => {
      if (/^can[A-Z]/.test(k) || /^can_/.test(k)) out[k] = isTrueLike(v);
      if (isPlainObject(v)) {
        Object.entries(v).forEach(([kk, vv]) => {
          if (/^can[A-Z]/.test(kk) || /^can_/.test(kk))
            out[kk] = isTrueLike(vv);
        });
      }
    });
  };

  const out: Record<string, boolean> = {};
  scanOnce(d, out);
  ["data", "details", "job", "work", "workInfo", "work_info"].forEach((k) =>
    scanOnce(d?.[k], out)
  );
  return Object.keys(out).length ? out : undefined;
};

type JobDetailForCard = {
  jobId: number;
  title: string;
  companyName: string;
  location?: string;
  salary?: number;
  jobImageUrl?: string | null;
  isTimeNegotiable?: boolean;
  workPeriod?: string;
  workEnvironment?: Record<string, boolean> | null;
  paymentType?: PaymentType | string;
};

const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobMap, setJobMap] = useState<Record<number, JobDetailForCard>>({});
  const [reviewCounts, setReviewCounts] = useState<Record<number, number>>({}); // ⬅️ 추가

  // 1) 찜 목록
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const list = await getSavedJobs();
        setSavedJobs(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("저장한 공고 불러오기 실패:", e);
        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // 2) 상세 병렬 조회
  useEffect(() => {
    const fetchDetails = async () => {
      const missing = savedJobs
        .map((b) => Number(b.jobId))
        .filter((id) => Number.isFinite(id) && jobMap[id] == null);

      if (missing.length === 0) return;

      try {
        const results = await Promise.allSettled(
          missing.map(async (id) => {
            const d: any = await getJobDetail(id);

            const parsedId =
              typeof d?.jobId === "number" ? d.jobId : Number(d?.jobId);
            const safeJobId = Number.isFinite(parsedId) ? parsedId : id;

            const envObj = extractEnv(d);
            const workPeriod = d?.workPeriod ?? d?.work_period;

            const detail: JobDetailForCard = {
              jobId: safeJobId,
              title: d?.title ?? "",
              companyName: d?.companyName ?? d?.company_name ?? "",
              location: d?.location ?? "",
              salary:
                typeof d?.salary === "number"
                  ? d.salary
                  : Number(d?.salary) || 0,
              jobImageUrl: d?.jobImageUrl ?? d?.job_image_url ?? null,
              isTimeNegotiable: Boolean(
                d?.isTimeNegotiable ?? d?.is_time_negotiable
              ),
              workPeriod,
              workEnvironment: envObj,
              paymentType: asPaymentType(
                d?.paymentType ?? d?.payment_type ?? "HOURLY"
              ),
            };

            return detail;
          })
        );

        const next: Record<number, JobDetailForCard> = {};
        results.forEach((r) => {
          if (r.status === "fulfilled") next[r.value.jobId] = r.value;
        });
        if (Object.keys(next).length)
          setJobMap((prev) => ({ ...prev, ...next }));
      } catch (e) {
        console.error("상세 조회 실패:", e);
      }
    };

    if (savedJobs.length > 0) fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedJobs]);

  useEffect(() => {
    if (savedJobs.length === 0) {
      setReviewCounts({});
      return;
    }

    let alive = true;

    (async () => {
      try {
        const targets = savedJobs
          .map((b) => Number(b.jobId))
          .filter((id) => Number.isFinite(id));

        const base = { ...reviewCounts };
        const tasks = targets.map(async (id) => {
          // 이미 있으면 재요청 생략 (원하면 주석 처리)
          if (base[id] != null) return;
          try {
            const { data } = await axiosInstance.get(`/api/v1/reviews/${id}`);
            const arr = Array.isArray(data?.result) ? data.result : [];
            base[id] = arr.length;
          } catch {
            if (base[id] == null) base[id] = 0;
          }
        });

        await Promise.all(tasks);
        if (alive) setReviewCounts(base);
      } catch {
        // 전체 실패해도 무시
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedJobs]);

  const countText = useMemo(
    () => (loading ? "로딩 중..." : `${savedJobs.length}건`),
    [loading, savedJobs.length]
  );

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        {/* 헤더 */}
        <section className="relative flex justify-center items-center h-[52px] border-b border-[#DEDEDE]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-[15px]"
            aria-label="뒤로가기"
          >
            <SlArrowLeft />
          </button>
          <div
            className="flex justify-center items-center text-[20px] h-[52px]"
            style={{ fontWeight: 700 }}
          >
            저장
          </div>
        </section>

        {/* 건수 */}
        <div className="flex items-center text-[12px] pl-[20px] h-[34px] border-b border-[#DEDEDE]">
          {countText}
        </div>

        {/* 리스트 */}
        <div className="bg-white">
          {savedJobs.map((bm) => {
            const d = jobMap[Number(bm.jobId)];

            if (!d) {
              // skeleton
              return (
                <section
                  key={bm.id}
                  className="px-[20px] py-[12px] border-b border-[#BFBFBF8C]"
                >
                  <div className="animate-pulse flex justify-between items-center">
                    <div className="flex-1 pr-4">
                      <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-20" />
                    </div>
                    <div className="w-[79px] h-[79px] bg-gray-200 rounded" />
                  </div>
                </section>
              );
            }

            return (
              <section key={bm.id} className="px-[0px]">
                <JobCard
                  jobId={d.jobId}
                  company={d.companyName}
                  title={d.title}
                  reviewCount={reviewCounts[d.jobId] ?? 0} // ⬅️ 숫자로 전달
                  location={d.location ?? ""}
                  wage={`${(d.salary ?? 0).toLocaleString()}원`}
                  image={d.jobImageUrl ?? ""}
                  isTime={Boolean(d.isTimeNegotiable)}
                  workPeriod={d.workPeriod}
                  environment={
                    isPlainObject(d?.workEnvironment)
                      ? (d.workEnvironment as Record<string, boolean>)
                      : undefined
                  }
                  paymentType={asPaymentType(d.paymentType ?? "HOURLY")}
                />
              </section>
            );
          })}

          {!loading && savedJobs.length === 0 && (
            <p className="text-center mt-8 text-sm text-gray-500">
              저장한 공고가 없습니다.
            </p>
          )}
        </div>

        <div className="h-[63px]" />
      </div>
    </div>
  );
};

export default SavedJobs;
