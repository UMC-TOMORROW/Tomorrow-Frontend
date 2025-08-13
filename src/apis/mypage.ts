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

/* ---------- 간단 유틸: 쿠키에서 Authorization 값을 읽어서 헤더로 넣기 ---------- */
function readCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}
function getAuthHeader(): Record<string, string> {
  const raw = readCookie("Authorization"); // 쿠키 이름 그대로 사용
  if (!raw) return {};
  const bearer = raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`;
  return { Authorization: bearer };
}
/* ------------------------------------------------------------------------- */

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

// 찜 목록 조회 (헤더만 추가)
export const getSavedJobs = async (): Promise<savedJobs[]> => {
  const res = await axiosInstance.get<ApiResponse<savedJobs[]>>(
    "/api/v1/saved-posts",
    { headers: getAuthHeader() } // ⬅️ 추가
  );

  const list = res.data?.result;
  if (!Array.isArray(list)) {
    console.error("Unexpected response shape:", res.data);
    return [];
  }
  return list;
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

  // ⬇️ 백틱으로 수정
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
    reviewData
  );

  return res.data.result.reviewId;
};

export const patchMyProfile = async (body: MemberUpdate): Promise<void> => {
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
