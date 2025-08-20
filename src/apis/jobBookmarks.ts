import { axiosInstance } from "./axios";

function extractId(it: any): number | null {
  const cands = [
    it?.jobId,
    it?.postId,
    it?.id,
    it?.job?.id,
    it?.job?.jobId,
    it?.post?.id,
  ];
  for (const c of cands) {
    const n = Number(c);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function pickCursorIds(d: any): number[] | null {
  const arr = d?.result?.bookmarks;
  if (!Array.isArray(arr)) return null;
  return arr
    .map((it: any) =>
      Number.isFinite(Number(it?.jobId)) ? Number(it.jobId) : extractId(it)
    )
    .filter((n: any): n is number => Number.isFinite(n));
}

function pickArrayFallback(d: any): any[] {
  if (Array.isArray(d?.result?.content)) return d.result.content;
  if (Array.isArray(d?.result?.list)) return d.result.list;
  if (Array.isArray(d?.result)) return d.result;
  if (Array.isArray(d?.data?.content)) return d.data.content;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d)) return d;
  return [];
}

export async function fetchBookmarkedJobIds(): Promise<number[]> {
  const ids: number[] = [];
  let cursor: number | null = null;
  let guard = 0;

  while (guard < 50) {
    guard += 1;

    const res: { data: unknown } = await axiosInstance.get<unknown>(
      "/api/v1/job-bookmarks",
      {
        params: cursor != null ? { cursor, size: 200 } : { size: 200 },
      }
    );

    const data: any = res.data;

    const chunk = pickCursorIds(data);
    if (chunk && chunk.length >= 0) {
      ids.push(...chunk);

      const hasNext: boolean = Boolean(data?.result?.hasNext);

      const nextCursorRaw: number | string | null | undefined =
        data?.result?.lastCursor;
      const nextCursor: number | null =
        (typeof nextCursorRaw === "number" ||
          typeof nextCursorRaw === "string") &&
        Number.isFinite(Number(nextCursorRaw))
          ? Number(nextCursorRaw)
          : null;

      if (hasNext && nextCursor !== null) {
        cursor = nextCursor;
        continue;
      }
      break;
    }

    const arr = pickArrayFallback(data);
    if (arr.length > 0) {
      ids.push(
        ...arr.map(extractId).filter((n): n is number => Number.isFinite(n))
      );
    }
    break;
  }

  return Array.from(new Set(ids));
}

export async function getIsBookmarked(jobId: number): Promise<boolean> {
  const ids = await fetchBookmarkedJobIds();
  return ids.includes(jobId);
}

export const addJobBookmark = (jobId: number) =>
  axiosInstance.post(`/api/v1/job-bookmarks/${jobId}`);

export const deleteJobBookmark = (jobId: number) =>
  axiosInstance.delete(`/api/v1/job-bookmarks/${jobId}`);
