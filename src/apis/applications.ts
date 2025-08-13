// /apis/applications.ts
import { axiosInstance } from "./axios";
import type { RawAxiosRequestHeaders } from "axios";

// 간단 쿠키 리더 (js-cookie 없이 동작)
function getCookie(name: string): string | null {
  const hit = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
  return hit ? decodeURIComponent(hit.split("=")[1]) : null;
}

export interface PostApplicationBody {
  content: string;
  jobId: number;
  resumeId?: number; // 저장된 이력서가 있을 때만
}

/**
 * 지원 생성
 * - 성공 시 서버의 result.id(number)를 반환
 * - 전역 axios 설정은 건드리지 않고, 이 요청에만 Authorization 헤더를 추가
 */
export async function postApplication(body: PostApplicationBody): Promise<number> {
  const token = getCookie("accessToken"); // 팀에서 쓰는 쿠키 키명에 맞춰 수정 가능
  const headers: RawAxiosRequestHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const { data } = await axiosInstance.post("/api/v1/applications", body, { headers });
  // 응답 스키마 예: { code:"COMMON201", result: { id: "1" } }
  const id = data?.result?.id;
  return typeof id === "string" ? Number(id) : (id as number);
}
