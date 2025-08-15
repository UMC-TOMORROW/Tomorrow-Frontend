import { axiosInstance } from "./axios";

export type PostApplicationBody = {
  content: string;
  jobId?: number;
  resumeId?: number;
};

// 스웨거: POST /api/v1/posts/{postId}/applications
export const postApplication = (postId: number, body: PostApplicationBody) =>
  axiosInstance.post(`/api/v1/posts/${postId}/applications`, body, {
    withCredentials: true,
    headers: {
      Accept: "application/json",
      ...getAuthHeader(),
    },
  });

function readCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}
function sanitizeToken(raw: string): string {
  return raw
    .replace(/^Bearer\s+/i, "")
    .replace(/^"|"$/g, "")
    .trim();
}
export function getAuthHeader(): Record<string, string> {
  const rawCookie = readCookie("Authorization") ?? readCookie("accessToken") ?? readCookie("ACCESS_TOKEN") ?? "";
  const rawLS = localStorage.getItem("Authorization") ?? localStorage.getItem("accessToken") ?? "";
  const rawSS = sessionStorage.getItem("Authorization") ?? sessionStorage.getItem("accessToken") ?? "";
  const token = sanitizeToken(rawCookie || rawLS || rawSS);
  return token ? { Authorization: `Bearer ${token}` } : {};
}
