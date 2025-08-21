import { axiosInstance } from "./axios";

export type RecoverResult = { status: string; recoveredAt: string };

export async function recoverMember(
  memberId: string | number
): Promise<RecoverResult> {
  const id = String(memberId).trim();
  const { data } = await axiosInstance.patch(
    `/api/v1/members/${encodeURIComponent(id)}/recover`,
    undefined,
    { headers: { Accept: "application/json" } }
  );
  return (data?.result ?? data) as RecoverResult;
}
