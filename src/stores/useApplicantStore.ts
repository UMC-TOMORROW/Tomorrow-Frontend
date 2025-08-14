import { create } from "zustand";
import type { Applicant, ApplicationDecisionCode } from "../types/applicant";
import { getApplicantsByPostId, updateApplicationStatus as updateStatusApi } from "../apis/employerMyPage";

const DECISION_TO_UI: Record<ApplicationDecisionCode, string> = {
  ACCEPTED: "합격",
  REJECTED: "불합격",
};

interface ApplicantState {
  applicants: Applicant[];
  loading: boolean;
  error: string | null;

  fetchApplicants: (postId: number, status?: "open" | "closed" | string) => Promise<void>;

  // 로컬 변경(그대로 둠)
  setResultLocal: (applicationId: number, result: string) => void;

  updateApplicationStatus: (
    jobId: number,
    applicationId: number,
    decision: ApplicationDecisionCode
  ) => Promise<void>;

  setApplicants: (list: Applicant[]) => void;
  clear: () => void;
}

export const useApplicantStore = create<ApplicantState>((set, get) => ({
  applicants: [],
  loading: false,
  error: null,

  async fetchApplicants(postId, status) {
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

  setResultLocal(applicationId, result) {
    const { applicants } = get();
    set({
      applicants: applicants.map((a) =>
        a.applicationId === applicationId ? { ...a, status: result } : a
      ),
    });
  },

  async updateApplicationStatus(jobId, applicationId, decision) {
    const prev = get().applicants;
    const optimistic = DECISION_TO_UI[decision];

    // 낙관적 반영
    set({
      applicants: prev.map((a) =>
        a.applicationId === applicationId ? { ...a, status: optimistic } : a
      ),
    });

    try {
      const res = await updateStatusApi(jobId, applicationId, decision);
      const confirmed = DECISION_TO_UI[res.status];
      set({
        applicants: get().applicants.map((a) =>
          a.applicationId === applicationId ? { ...a, status: confirmed } : a
        ),
      });
    } catch (e) {
      console.error("지원서 상태 업데이트 실패:", e);
      // 롤백
      set({ applicants: prev });
      throw e;
    }
  },

  setApplicants(list) {
    set({ applicants: list });
  },

  clear() {
    set({ applicants: [], loading: false, error: null });
  },
}));
