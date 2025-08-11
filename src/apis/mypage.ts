import axios from "axios";
import type {
  ApiResponse,
  ApplicationFilter,
  applyStatus,
  deleteMember,
  savedJobs,
} from "../types/mypage";
import { axiosInstance } from "./axios";

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
    "/api/v1/saved-posts"
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
