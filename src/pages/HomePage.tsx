import { useNavigate } from "react-router-dom";
import BottomNavbar from "../components/common/BottomNavbar";
import Header from "../components/common/Header";
import SearchBar from "../components/common/SearchBar";
import HomepageTopBar from "../components/Homepage/HomepageTopBar";
import JobCard from "../components/Homepage/JobCard";
import palette from "../styles/theme";

const dummyJobs = [
  {
    company: "(주) 내일",
    title: "사무 보조 (문서 스캔 및 정리)",
    tags: ["앉아서 근무 중심", "반복 손작업 포함"],
    duration: "시간협의, 3개월 이상",
    review: "후기 3건",
    location: "서울 강남구",
    wage: "11,000원",
  },
  {
    company: "내일도서관",
    title: "도서 정리 및 대출 보조",
    tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
    duration: "시간협의, 6개월 이상",
    review: "후기 15건",
    location: "서울 서초구",
    wage: "11,000원",
  },
  {
    company: "내일텃밭",
    title: "텃밭 관리 도우미",
    tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
    duration: "시간협의, 3개월 이상",
    review: "",
    location: "서울 강서구",
    wage: "13,000원",
  },
  {
    company: "내일복지센터",
    title: "조리 보조 (단체 급식 준비)",
    tags: ["서서 근무 중심", "손이나 팔을 자주 사용하는 작업"],
    duration: "시간협의, 1개월~3개월",
    review: "",
    location: "서울 강동구",
    wage: "13,000원",
  },
  {
    company: "내일복지센터",
    title: "조리 보조 (단체 급식 준비)",
    tags: ["서서 근무 중심", "손이나 팔을 자주 사용하는 작업"],
    duration: "시간협의, 1개월~3개월",
    review: "",
    location: "서울 강동구",
    wage: "13,000원",
  },
  {
    company: "내일복지센터",
    title: "조리 보조 (단체 급식 준비)",
    tags: ["서서 근무 중심", "손이나 팔을 자주 사용하는 작업"],
    duration: "시간협의, 1개월~3개월",
    review: "",
    location: "서울 강동구",
    wage: "13,000원",
  },
  {
    company: "내일복지센터",
    title: "조리 보조 (단체 급식 준비)",
    tags: ["서서 근무 중심", "손이나 팔을 자주 사용하는 작업"],
    duration: "시간협의, 1개월~3개월",
    review: "",
    location: "서울 강동구",
    wage: "13,000원",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-[50px] pb-[64px] min-h-screen font-[Pretendard]">
      <Header title="내일" />

      <HomepageTopBar />

      <div
        className="w-full my-6"
        style={{ height: "1px", backgroundColor: palette.gray.default }}
      />
      <div className="h-[7px]" />

      {/* 검색바 */}
      <div
        onClick={() => navigate("/search")}
        className="flex justify-center py-4 cursor-pointer"
      >
        <SearchBar />
      </div>

      <div className="h-[7px]" />
      <div
        className="w-full my-6"
        style={{ height: "1px", backgroundColor: palette.gray.default }}
      />

      <div className="bg-white max-w-[393px] mx-auto">
        {/* 100건 + 버튼 영역 */}
        <div
          className="flex justify-between items-center"
          style={{ height: "25px" }}
        >
          <span
            className="!ml-7"
            style={{
              fontSize: "12px",
              color: "#555555D9",
              fontFamily: "Pretendard",
            }}
          >
            100건
          </span>

          <button
            className="bg-[#5555558C] w-[75px] h-[21px] !text-white mt-[2px] mb-[2px] mr-[15px]"
            style={{
              fontSize: "12px",
              fontFamily: "Pretendard",
              borderRadius: "7px",
            }}
          >
            일자리 등록
          </button>
        </div>

        {/* 하단 구분선 */}
        <div
          className="w-full"
          style={{ height: "1px", backgroundColor: palette.gray.default }}
        />
      </div>

      {/* 일자리 리스트 */}
      {dummyJobs.map((job, index) => (
        <JobCard key={index} {...job} />
      ))}

      <BottomNavbar />
    </div>
  );
  return <div>HomePage</div>;
};

export default HomePage;
