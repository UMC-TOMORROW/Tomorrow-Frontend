import { axiosInstance } from "../apis/axios";

export class AuthRequiredError extends Error {
  constructor(msg = "로그인이 필요합니다.") {
    super(msg);
    this.name = "AuthRequiredError";
  }
}

export const redirectToLogin = () => {
  const next = window.location.pathname + window.location.search;
  if (!window.location.pathname.startsWith("/auth")) {
    window.location.assign(`/auth?next=${encodeURIComponent(next)}`);
  }
};

export const isHtmlResponse = (data: any, headers?: any) => {
  const ct = String(headers?.["content-type"] || headers?.["Content-Type"] || "");
  return ct.includes("text/html") || (typeof data === "string" && /<html[\s>]/i.test(data));
};

export const ensureAuth = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/members/me", { withCredentials: true });
    if (isHtmlResponse(res.data, res.headers)) throw new AuthRequiredError();
  } catch (e: any) {
    const status = e?.response?.status;
    const data = e?.response?.data;
    if (status === 401 || status === 403 || isHtmlResponse(data, e?.response?.headers)) {
      redirectToLogin();
      throw new AuthRequiredError();
    }
    throw e;
  }
};

export const guardHtml = (res: any) => {
  if (isHtmlResponse(res?.data, res?.headers)) {
    const err: any = new AuthRequiredError();
    err.response = { status: 401, data: { message: "로그인이 필요합니다." } };
    throw err;
  }
};

export function pickResult<T = any>(res: any): T {
  if (res?.data?.result !== undefined) return res.data.result as T;
  if (res?.data?.data !== undefined) return res.data.data as T;
  return res?.data as T;
}
