import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/HomePage";
import OnboardingScreen from "./pages/Onboarding";
// import SearchPage from "./pages/SearchPage";
import MyPage from "./pages/Mypage/MyPage";
import ResumeManage from "./pages/Mypage/ResumeManage";
import CareerTalkListPage from "./pages/careerTalk/CareerTalkListPage";
import CareerTalkWritePage from "./pages/careerTalk/CareerTalkWritePage";
import CareerTalkDetailPage from "./pages/careerTalk/CareerTalkDetailPage";
import SearchBarTest from "./pages/SearchBarTest";
import RecommendationPage from "./pages/RecommendationPage";
import SplashScreenPage from "./pages/SplashScreenPage";
import AuthScreen from "./pages/auth/AuthScreen";
import MemberInfo from "./pages/Mypage/MemberInfo";
import ApplyStatus from "./pages/Mypage/ApplyStatus";
import ManageMyJobs from "./pages/Mypage/ManageMyJobs";
import ReviewWritting from "./pages/Mypage/ReviewWritting";
import SavedJobs from "./pages/Mypage/SavedJobs";
import ApplicantList from "./pages/Mypage/ApplicantList";
import ApplicantDetail from "./pages/Mypage/ApplicantDetail";
import EmployerMyPage from "./pages/Mypage/EmployerMyPage";
import SearchPage from "./pages/SearchPage";
import UserInfoForm from "./pages/auth/UserInfoForm";
import JobPostForm from "./pages/post/JobPostPage";
import BusinessStep from "./components/jobPost/BusinessStep";
import PersonalStep from "./components/jobPost/PerSonalStep";
import WorkPreference from "./pages/Mypage/WorkPreference";
import ChatPage from "./pages/careerTalk/ChatPage";

const router = createBrowserRouter([
  { path: "/splash", element: <SplashScreenPage /> }, // 1) 스플래시
  { path: "/auth", element: <AuthScreen /> }, // 2) 로그인
  { path: "/auth/user-info", element: <UserInfoForm /> }, // 3) 회원정보 입력
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "onboarding", element: <OnboardingScreen /> },
      { path: "search", element: <SearchPage /> },
      { path: "search-test", element: <SearchBarTest /> },
      { path: "career-talk", element: <CareerTalkListPage /> },
      { path: "career-talk/write", element: <CareerTalkWritePage /> },
      { path: "career-talk/:id", element: <CareerTalkDetailPage /> },
      { path: "career-talk/edit/:id", element: <CareerTalkWritePage /> },
      { path: "career-talk/chat", element: <ChatPage /> },
      { path: "MyPage", element: <MyPage /> },
      { path: "recommendation", element: <RecommendationPage /> },
      { path: "post", element: <JobPostForm /> },
      { path: "/post/business", element: <BusinessStep /> },
      { path: "/post/personal", element: <PersonalStep /> },
    ],
  },
  {
    path: "/MyPage",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <MyPage /> },
      { path: "EmployerMyPage", element: <EmployerMyPage /> },
      { path: "ResumeManage", element: <ResumeManage /> },
      { path: "ResumeManage/:resumeId", element: <ResumeManage /> },
      { path: "MemberInfo", element: <MemberInfo /> },
      { path: "ApplyStatus", element: <ApplyStatus /> },
      { path: "ManageMyJobs", element: <ManageMyJobs /> },
      { path: "ReviewWritting", element: <ReviewWritting /> },
      { path: "SavedJobs", element: <SavedJobs /> },
      { path: "ApplicantList", element: <ApplicantList /> },
      { path: "ApplicantDetail", element: <ApplicantDetail /> },
      { path: "WorkPreference", element: <WorkPreference /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
