// /apis/resumes.ts
import { axiosInstance } from "./axios";
import type { RawAxiosRequestHeaders } from "axios";

// 간단 쿠키 리더
function getCookie(name: string): string | null {
  const hit = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
  return hit ? decodeURIComponent(hit.split("=")[1]) : null;
}

// 응답에서 resumeId 최대한 뽑아내기(백엔드 포맷 다양성 대응)
function extractResumeId(data: any): number | null {
  const r = data?.result ?? data;
  if (!r) return null;
  if (typeof r.resumeId === "number") return r.resumeId;
  if (typeof r.id === "number") return r.id;
  if (Array.isArray(r) && r.length) {
    if (typeof r[0]?.resumeId === "number") return r[0].resumeId;
    if (typeof r[0]?.id === "number") return r[0].id;
  }
  return null;
}

export interface ResumeSummary {
  hasResume: boolean;
  resumeId: number | null;
}

/**
 * 이력서 요약 조회
 * - 성공: { hasResume: true, resumeId }
 * - 없음(RESUME404/HTTP 404): { hasResume: false, resumeId: null }
 * - 그 외 에러: throw
 */
export async function getResumeSummary(): Promise<ResumeSummary> {
  const token = getCookie("accessToken"); // 팀 쿠키 키명에 맞게 조정
  const headers: RawAxiosRequestHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const { data } = await axiosInstance.get("/api/v1/resumes/summary", { headers });
    const resumeId = extractResumeId(data);
    return { hasResume: resumeId != null, resumeId };
  } catch (e: any) {
    const status = e?.response?.status;
    const code = e?.response?.data?.code;
    if (status === 404 || code === "RESUME404") {
      return { hasResume: false, resumeId: null };
    }
    throw e;
  }
}
