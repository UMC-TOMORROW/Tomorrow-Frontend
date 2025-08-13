// ===== Applicant(목록) =====
export type ApplicantStatus = "합격" | "불합격" | string;

export interface Applicant {
  applicantId: number;
  userName: string;
  applicationDate: string; // ISO datetime
  status: ApplicantStatus;
  resumeTitle: string;
}

// ===== 공통 Envelope =====
export interface ApiEnvelope<T> {
  timestamp: string;
  code: string;
  message: string;
  result: T;
}

// ===== Resume(상세) =====
// 백엔드 원본 스키마(+ content 포함)
export interface ApplicantResumeRaw {
  applicantId: number;
  status: ApplicantStatus;

  // 서버에서 내려오는 슬래시 구분 문자열
  // 예: "이름/성별/56세/지역/자기소개 ..."
  content?: string | null;

  userProfile: {
    userName: string;
    email: string;
    phoneNumber: string | null;
    profileImageUrl: string | null;
  };
  resumeInfo: {
    resumeContent: string | null;
    portfolioUrl: string | null;
    careers: Array<{
      id: number;
      company: string;
      position: string;   // 예: "단기"
      duration: string;   // 예: "0년"
      description: string;
    }>;
    certifications: Array<{
      certificationName: string | null;
      fileUrl: string | null;
    }>;
  };
}

// content 파싱 결과(프론트 편의)
export interface ParsedApplicantContent {
  name: string | null;
  gender: string | null;
  ageRaw: string | null; // "56세"
  age?: number | null;   // 56
  location: string | null;
  introduction: string | null;
}

// 최종 사용 타입: 원본 + 파싱 결과를 함께 보유
export interface ApplicantResume extends ApplicantResumeRaw {
  parsedContent: ParsedApplicantContent;
}
