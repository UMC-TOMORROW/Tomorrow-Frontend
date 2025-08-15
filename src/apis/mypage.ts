import axios from "axios";
import type {
  ApiResponse,
  ApplicationFilter,
  applyStatus,
  deleteMember,
  Member,
  MemberUpdate,
  reviews,
  savedJobs,
} from "../types/mypage";
import { axiosInstance } from "./axios";

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
  const rawCookie =
    readCookie("Authorization") ??
    readCookie("accessToken") ??
    readCookie("ACCESS_TOKEN") ??
    "";
  const rawLS =
    window.localStorage.getItem("Authorization") ??
    window.localStorage.getItem("accessToken") ??
    "";
  const rawSS =
    window.sessionStorage.getItem("Authorization") ??
    window.sessionStorage.getItem("accessToken") ??
    "";

  const token = sanitizeToken(rawCookie || rawLS || rawSS);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 지원 현황 조회
export const getApplications = async (
  type: ApplicationFilter
): Promise<applyStatus[]> => {
  const res = await axiosInstance.get<ApiResponse<applyStatus[]>>(
    "/api/v1/applications",
    { params: { type } }
  );

  const list = res.data?.result;
  if (!Array.isArray(list)) {
    console.error("Unexpected response shape:", res.data);
    return [];
  }
  return list;
};

// 찜 목록 조회
export const getSavedJobs = async (): Promise<savedJobs[]> => {
  const res = await axiosInstance.get<ApiResponse<savedJobs[]>>(
    "/api/v1/job-bookmarks",
    {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        ...getAuthHeader(),
      },
    }
  );

  const ct = res.headers?.["content-type"];
  if (typeof res.data !== "object" || (ct && ct.includes("text/html"))) {
    throw new Error("로그인이 필요합니다.");
  }

  const list = res.data?.result;
  return Array.isArray(list) ? list : [];
};

type MeRaw = {
  id?: number | string;
  [k: string]: unknown;
};

type MeWrapped = ApiResponse<MeRaw> | MeRaw;

function extractMemberId(data: unknown): string | null {
  if (
    typeof data === "object" &&
    data !== null &&
    "result" in (data as Record<string, unknown>)
  ) {
    const result = (data as { result?: unknown }).result;
    if (
      typeof result === "object" &&
      result !== null &&
      "id" in (result as Record<string, unknown>)
    ) {
      const id = (result as { id?: number | string }).id;
      return id != null ? String(id) : null;
    }
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "id" in (data as Record<string, unknown>)
  ) {
    const id = (data as { id?: number | string }).id;
    return id != null ? String(id) : null;
  }

  return null;
}

export const getMe = async (): Promise<string | null> => {
  try {
    const res = await axiosInstance.get<MeWrapped>("/api/v1/members/me");
    return extractMemberId(res.data);
  } catch {
    return null;
  }
};

// 회원 비활성화(탈퇴)
export const deactivateMember = async (
  memberId: string
): Promise<deleteMember> => {
  if (!memberId) throw new Error("memberId is required");

  const idNum = Number(memberId);
  const idForPath = Number.isFinite(idNum) ? String(idNum) : memberId;

  const url = `/api/v1/members/${encodeURIComponent(idForPath)}/deactivate`;

  try {
    const res = await axiosInstance.patch<ApiResponse<deleteMember>>(
      url,
      {},
      {
        headers: { Accept: "application/json" },
      }
    );
    if (!res?.data?.result) {
      console.error("Unexpected response shape:", res?.data);
      throw new Error("Invalid response from server");
    }
    return res.data.result;
  } catch (e: unknown) {
    let status: number | undefined;
    let data: unknown;
    if (axios.isAxiosError(e)) {
      status = e.response?.status;
      data = e.response?.data;
    }
    console.error("[deactivateMember] failed", { url, status, data });
    throw e instanceof Error ? e : new Error("Request failed");
  }
};

export const postReview = async (reviewData: reviews): Promise<number> => {
  const res = await axiosInstance.post<ApiResponse<{ reviewId: number }>>(
    "/api/v1/reviews",
    reviewData,
    { headers: { Accept: "application/json" } }
  );

  return res.data.result.reviewId;
};

export const putMyProfile = async (body: MemberUpdate): Promise<void> => {
  const payload: Record<string, unknown> = {};
  Object.entries(body).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "")
      payload[k] = v;
  });

  try {
    const res = await axiosInstance.put<ApiResponse<Member | null>>(
      "/api/v1/members/me",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      }
    );

    if (res.status < 200 || res.status >= 300) {
      throw new Error(res.data?.message || "프로필 수정에 실패했습니다.");
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const msg =
        (e.response?.data as Partial<ApiResponse<unknown>> | undefined)
          ?.message ||
        e.message ||
        "프로필 수정에 실패했습니다.";
      throw new Error(msg);
    }
    throw e instanceof Error ? e : new Error("프로필 수정에 실패했습니다.");
  }
};
