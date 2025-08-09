import type {
  ApiResponse,
  ApplicationFilter,
  applyStatus,
} from "../types/mypage";
import { axiosInstance } from "./axios";

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
