// src/apis/applications.ts
import { axiosInstance } from "../apis/axios";

export type MyApplication = {
  jobId: number;
  status: string;
  postTitle?: string;
  company?: string;
  date?: string;
};

export class AuthRequiredError extends Error {
  constructor(msg = "로그인이 필요합니다.") {
    super(msg);
    this.name = "AuthRequiredError";
  }
}
// 전체/합격만 필터: type=all | pass
export async function listMyApplications(type: "all" | "pass" = "all"): Promise<MyApplication[]> {
  const { data } = await axiosInstance.get("/api/v1/applications", { params: { type } });
  const arr = Array.isArray(data?.result) ? data.result : data?.result ? [data.result] : [];
  return arr.map((r: any) => ({
    jobId: Number(r.jobId),
    status: String(r.status ?? ""),
    postTitle: r.postTitle,
    company: r.company,
    date: r.date,
  }));
}
// 내가 지원한 공고들의 jobId만 뽑기
export async function fetchAppliedJobIdsFromServer(): Promise<number[]> {
  const apps = await listMyApplications("all");
  return apps.map((a) => Number(a.jobId)).filter((n) => Number.isFinite(n));
}

const isHtmlResponse = (data: any, headers?: any) => {
  const ct = String(headers?.["content-type"] || headers?.["Content-Type"] || "");
  return ct.includes("text/html") || (typeof data === "string" && /<html[\s>]/i.test(data));
};
const guardHtml = (res: any) => {
  const loc = String(res?.headers?.location || res?.headers?.Location || "");
  if (loc.includes("/login") || isHtmlResponse(res?.data, res?.headers)) {
    const err: any = new AuthRequiredError();
    err.response = res;
    throw err;
  }
};
export type CreateApplicationBody = { content: string; resumeId?: number };

/** 지원하기: POST /api/v1/jobs/{jobId}/applications */
export async function createApplication(jobId: number, body: CreateApplicationBody) {
  const res = await axiosInstance.post(`/api/v1/jobs/${jobId}/applications`, body, {
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    validateStatus: () => true, // 400/302도 잡아서 직접 판단
  });

  // 302 로그인 리다이렉트 / HTML 응답 → 인증 필요
  guardHtml(res);

  // 성공: 2xx + JSON
  const status = res.status;
  const ct = String(res.headers?.["content-type"] || "");
  if (status < 200 || status >= 300 || !ct.includes("application/json")) {
    const e: any = new Error(res?.data?.message || `지원 실패 (status=${status}, ct=${ct || "-"})`);
    e.response = res;
    throw e;
  }

  return res.data?.result ?? res.data?.data ?? res.data;
}
