import { create } from "zustand";
import type { Applicant } from "../types/applicant";
import { getApplicantsByPostId } from "../apis/employerMyPage";

interface ApplicantState {
  applicants: Applicant[];
  loading: boolean;
  error: string | null;

  // 서버에서 불러오기
  fetchApplicants: (postId: number, status?: "open" | "closed" | string) => Promise<void>;

  // 로컬 상태만 변경(합/불) — 백엔드 API 생기면 여기만 교체
  setResultLocal: (applicantId: number, result: string) => void;

  // 필요 시 수동 세터
  setApplicants: (list: Applicant[]) => void;
  clear: () => void;
}

export const useApplicantStore = create<ApplicantState>((set, get) => ({
  applicants: [],
  loading: false,
  error: null,

  fetchApplicants: async (postId, status) => {
    set({ loading: true, error: null });
    try {
      const data = await getApplicantsByPostId(postId, status);
      set({ applicants: data });
    } catch (e) {
      console.error("지원자 목록 조회 실패:", e);
      set({ error: "지원자 목록을 불러오지 못했습니다." });
    } finally {
      set({ loading: false });
    }
  },

  setResultLocal: (applicantId, result) => {
    const { applicants } = get();
    set({
      applicants: applicants.map((a) =>
        a.applicantId === applicantId ? { ...a, status: result } : a
      ),
    });
  },

  setApplicants: (list) => set({ applicants: list }),
  clear: () => set({ applicants: [], loading: false, error: null }),
}));
