import { create } from "zustand";

interface Applicant {
  name: string;
  phone: string;
  info: string;
  comment: string;
  introduction: string;
  career: string;
  license: string;
  result: "합격" | "불합" | "";
}

interface useApplicantStore {
  applicants: Applicant[];
  setResult: (name: string, result: "합격" | "불합") => void;
}

export const useApplicantStore = create<useApplicantStore>((set) => ({
  applicants: [
    {
      name: "이지현",
      phone: "010-1234-5678",
      info: "이지현/여/56세/광진구",
      comment: "성실히 도움이 되도록 노력하겠습니다.",
      introduction:
        "어르신들과 대화하고 도움을 주는 일을 좋아합니다. 책임감 있게 일하며, 시간을 잘 지킵니다.",
      career: "내일 요양센터 2025년/6개월 이하 어르신 돌봄 업무",
      license: "요양보호사 자격증",
      result: "합격",
    },
    {
      name: "김영희",
      phone: "010-1234-5678",
      info: "김영희/여/58세/강남구",
      comment: "경험은 부족하지만 책임감을 가지고 일하겠습니다.",
      introduction:
        "어르신들과 대화하고 도움을 주는 일을 좋아합니다. 책임감 있게 일하며, 시간을 잘 지킵니다.",
      career: "내일 요양센터 2025년/6개월 이하 어르신 돌봄 업무",
      license: "요양보호사 자격증",
      result: "불합",
    },
    {
      name: "김유석",
      phone: "010-1234-5678",
      info: "김유석/남/62세/마포구",
      comment: "성실하게 맡은 일을 수행하겠습니다.",
      introduction:
        "어르신들과 대화하고 도움을 주는 일을 좋아합니다. 책임감 있게 일하며, 시간을 잘 지킵니다.",
      career: "내일 요양센터 2025년/6개월 이하 어르신 돌봄 업무",
      license: "요양보호사 자격증",
      result: "합격",
    },
  ],
  setResult: (name, result) =>
    set((state) => ({
      applicants: state.applicants.map((a) =>
        a.name === name ? { ...a, result } : a
      ),
    })),
}));
