export interface PostCertificateRequest {
  file: string;
}

export interface PostCertificateResponse {
  timestamp: string;
  code: string;
  message: string;
  result: {
    id: number;
    fileUrl: string;
  };
}
