export interface CareerTalk {
  id: number;
  category: string;
  title: string;
  content: string | null;
  chatroomId: number;
  createdAt: string;
  author: boolean;
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

export interface GetCareerTalkDetailResponse {
  timestamp: string;
  code: string;
  message: string;
  result: CareerTalk;
}

export interface PostCareerTalkRequest {
  category: string;
  title: string;
  content: string;
}

export interface PostCareerTalkResponse {
  timestamp: string;
  code: string;
  message: string;
  result: {
    id: number;
  };
}
