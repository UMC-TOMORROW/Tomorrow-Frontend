import axios from "axios";

export type RecoverResult = {
  status: string;
  recoveredAt: string;
};

export async function recoverMember(memberId: number): Promise<RecoverResult> {
  const { data } = await axios.patch(`/api/v1/members/${memberId}/recover`);
  return data?.result as RecoverResult;
}
