export type ApplicantStatus = string;

export interface Applicant {
  applicantId: number;
  userName: string;
  applicationDate: string;
  status: ApplicantStatus;
  resumeTitle: string;
}

export interface ApiEnvelope<T> {
  timestamp: string;
  code: string;
  message: string;
  result: T;
}

export interface ApplicantResume {
  applicantId: number;
  status: string;
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
      position: string;  
      duration: string; 
      description: string;
    }>;
    certifications: Array<{
      certificationName: string | null;
      fileUrl: string | null;
    }>;
  };
}

export interface ApiEnvelope<T> {
  timestamp: string;
  code: string;
  message: string;
  result: T;
}