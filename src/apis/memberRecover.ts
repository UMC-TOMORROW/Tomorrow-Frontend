import { axiosInstance } from "../apis/axios";

export type RecoverResult = {
  status: string;
  recoveredAt: string;
};

export async function recoverMember(
  memberId: string | number
): Promise<RecoverResult> {
  const id = String(memberId).trim();
  if (!id) throw new Error("memberId가 비어 있습니다.");

  const { data } = await axiosInstance.patch(
    `/members/${encodeURIComponent(id)}/recover`,
    undefined,
    {
      withCredentials: true,
      headers: { Accept: "application/json" },
    }
  );

  return (data?.result ?? data) as RecoverResult;
}
