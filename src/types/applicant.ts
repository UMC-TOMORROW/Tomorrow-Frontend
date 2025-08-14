export type ApplicantStatus = "합격" | "불합격" | string;

export interface Applicant {
  applicantId: number;
  applicationId: number; 
  resumeId: number;    
  userName: string;
  phoneNumber: string | null;
  applicationDate: string;    // ISO datetime
  status: ApplicantStatus;
  content?: string | null;     // 목록에서도 슬래시 구분 문자열 제공
}

export interface ParsedApplicantContent {
  name: string | null;
  gender: string | null;
  ageRaw: string | null; // "56세"
  age?: number | null;   // 56
  location: string | null;
  introduction: string | null;
}

// ===== Resume(상세) =====
// 백엔드 원본 스키마(+ content 포함)
export interface ApplicantResumeRaw {
  applicantId: number;
  applicationId: number; // ✅ 신규
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

// 최종 사용 타입: 원본 + 파싱 결과를 함께 보유
export interface ApplicantResume extends ApplicantResumeRaw {
  parsedContent: ParsedApplicantContent;
}

// 지원서 상태 업데이트(서버 요청/응답) 타입
export type ApplicationDecisionCode = "ACCEPTED" | "REJECTED";

export interface UpdateApplicationStatusResult {
  applicationId: number;
  status: ApplicationDecisionCode;
}
