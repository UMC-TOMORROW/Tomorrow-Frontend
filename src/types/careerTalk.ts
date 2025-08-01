export interface CareerTalk {
  id: number;
  category: string;
  title: string;
  content: string | null;
  createdAt: string;
}

export interface GetCareerTalksResponse {
  timestamp: string;
  code: string;
  message: string;
  result: {
    careertalkList: CareerTalk[];
    hasNext: boolean;
  };
}
