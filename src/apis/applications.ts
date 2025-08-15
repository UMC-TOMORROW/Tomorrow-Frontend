import { axiosInstance } from "./axios";
import { ensureAuth, guardHtml, pickResult } from "./httpCommon";

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
function getAuthHeader(): Record<string, string> {
  const rawCookie = readCookie("Authorization") ?? readCookie("accessToken") ?? readCookie("ACCESS_TOKEN") ?? "";
  const rawLS = localStorage.getItem("Authorization") ?? localStorage.getItem("accessToken") ?? "";
  const rawSS = sessionStorage.getItem("Authorization") ?? sessionStorage.getItem("accessToken") ?? "";
  const token = sanitizeToken(rawCookie || rawLS || rawSS);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type PostApplicationBody = {
  content: string;
  resumeId?: number;
};

// POST /api/v1/posts/{postId}/applications
export async function postApplication(postId: number, body: PostApplicationBody) {
  const res = await axiosInstance.post(`/api/v1/posts/${postId}/applications`, body, {
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...getAuthHeader(),
    },
  });
  return res;
}
