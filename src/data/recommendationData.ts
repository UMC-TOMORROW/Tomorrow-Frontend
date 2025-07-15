export interface Recommendation {
  id: number;
  title: string;
  companyName: string;
  location: string;
  workPeriod: string;
  workDays: string[];
  salary: number;
  paymentType: "HOURLY" | "DAILY" | "MONTHLY";
  reviewsCount: number;
}

const recommendationData: Recommendation[] = [
  {
    id: 1,
    title: "텃밭관리도우미",
    companyName: "푸른텃밭",
    location: "서울 강동구",
    workPeriod: "3개월 이상",
    workDays: ["시간협의"],
    salary: 12000,
    paymentType: "HOURLY",
    reviewsCount: 5,
  },
  {
    id: 2,
    title: "카페 주말 알바",
    companyName: "카페온더테이블",
    location: "서울 마포구",
    workPeriod: "1개월",
    workDays: ["토", "일"],
    salary: 11000,
    paymentType: "MONTHLY",
    reviewsCount: 12,
  },
  {
    id: 3,
    title: "단기 물류 창고 포장",
    companyName: "이마트물류",
    location: "경기 김포시",
    workPeriod: "2주",
    workDays: ["월", "화", "수", "목", "금"],
    salary: 100000,
    paymentType: "DAILY",
    reviewsCount: 20,
  },
];

export default recommendationData;
