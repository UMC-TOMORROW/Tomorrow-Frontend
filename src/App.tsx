import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
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
import JobDetailPage from "./pages/job/JobDetailPage";
import ChatPage from "./pages/careerTalk/ChatPage";
import JobReviewPage from "./pages/job/JobReviewPage";
import { getMyInfo } from "./apis/employerMyPage";
import MemberRecover from "./pages/auth/MemberRecover";

/* ───────────────── 헬퍼 ───────────────── */
type MeShape = {
  id?: number | null;
  isOnboarded?: boolean | null;
  inOnboarded?: boolean | null;
  [k: string]: any;
};

const getMeOrNull = async (): Promise<MeShape | null> => {
  try {
    const me = await getMyInfo();
    return me ?? null;
  } catch {
    return null;
  }
};

// 온보딩 완료 여부를 일관되게 계산
const isOnboardedBool = (me?: MeShape | null) =>
  Boolean(me && (me.isOnboarded ?? me.inOnboarded ?? false));

/* ───────────────── 라우트 보호 로더 ───────────────── */

// 인증 필요
const requireAuthLoader = async () => {
  const me = await getMeOrNull();
  if (!me?.id) throw redirect("/auth");
  return null;
};

// 로그인/스플래시: 로그인 상태면 홈 또는 user-info로
const requireAnonLoader = async () => {
  const me = await getMeOrNull();
  if (!me) return null; // 비로그인 그대로 접근
  if (!isOnboardedBool(me)) throw redirect("/auth/user-info");
  throw redirect("/");
};

// 회원정보 입력(온보딩 전)만 접근 허용
const requireUserInfoLoader = async () => {
  const me = await getMeOrNull();
  if (!me) throw redirect("/auth");
  if (isOnboardedBool(me)) throw redirect("/");
  return null;
};

// 온보딩 화면: 로그인 必, 온보딩 전만 접근 허용
const requireNeedsOnboardingLoader = async () => {
  const me = await getMeOrNull();
  if (!me) throw redirect("/auth");
  if (isOnboardedBool(me)) throw redirect("/");
  return null;
};

const router = createBrowserRouter([
  // 1) 스플래시/로그인
  { path: "/splash", element: <SplashScreenPage />, loader: requireAnonLoader },
  { path: "/auth", element: <AuthScreen />, loader: requireAnonLoader },
  {
    path: "/auth/user-info",
    element: <UserInfoForm />,
    loader: requireUserInfoLoader, // ← 회원정보 입력(온보딩 전)
  },

  // 회원 복구
  // {
  //   path: "/auth/recover",
  //   element: <MemberRecover />,
  //   loader: async () => {
  //     const me = await getMeOrNull();
  //     if (!me) throw redirect("/auth");
  //     if (me.status !== "INACTIVE") throw redirect("/");
  //     return null;
  //   },
  // },

  // 2) 메인 섹션
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        loader: async () => {
          const me = await getMeOrNull();
          if (!me) throw redirect("/splash");
          if (!isOnboardedBool(me)) throw redirect("/auth/user-info");
          return null;
        },
        element: <HomePage />,
      },

      // 온보딩: 로그인 + 온보딩 전 상태만
      {
        path: "onboarding",
        element: <OnboardingScreen />,
        loader: requireNeedsOnboardingLoader,
      },

      { path: "search", element: <SearchPage /> },
      { path: "career-talk", element: <CareerTalkListPage /> },

      // 작성/채팅 등 보호 라우트
      {
        path: "career-talk/write",
        element: <CareerTalkWritePage />,
        loader: requireAuthLoader,
      },
      { path: "career-talk/:id", element: <CareerTalkDetailPage /> },
      {
        path: "career-talk/edit/:id",
        element: <CareerTalkWritePage />,
        loader: requireAuthLoader,
      },
      {
        path: "career-talk/chat",
        element: <ChatPage />,
        loader: requireAuthLoader,
      },

      { path: "MyPage", element: <MyPage />, loader: requireAuthLoader },
      {
        path: "recommendation",
        element: <RecommendationPage />,
        loader: requireAuthLoader,
      },

      // 글 등록 플로우 보호
      { path: "post", element: <JobPostForm />, loader: requireAuthLoader },
      {
        path: "/post/business",
        element: <BusinessStep />,
        loader: requireAuthLoader,
      },
      {
        path: "/post/personal",
        element: <PersonalStep />,
        loader: requireAuthLoader,
      },

      { path: "jobs/:jobId", element: <JobDetailPage /> },
      { path: "jobs/:jobId/reviews", element: <JobReviewPage /> },
    ],
  },

  // 3) 마이페이지 섹션(전부 보호)
  {
    path: "/MyPage",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    loader: requireAuthLoader, // 부모에서 한 번에 보호
    children: [
      { index: true, element: <MyPage /> },
      { path: "EmployerMyPage", element: <EmployerMyPage /> },
      { path: "ResumeManage", element: <ResumeManage /> },
      { path: "ResumeManage/:resumeId", element: <ResumeManage /> },
      { path: "MemberInfo", element: <MemberInfo /> },
      { path: "ApplyStatus", element: <ApplyStatus /> },
      { path: "ManageMyJobs", element: <ManageMyJobs /> },
      { path: "ReviewWritting/:postId", element: <ReviewWritting /> },
      { path: "SavedJobs", element: <SavedJobs /> },
      { path: "ApplicantList", element: <ApplicantList /> },
      { path: "ApplicantDetail", element: <ApplicantDetail /> },
      { path: "WorkPreference", element: <WorkPreference /> },
      { path: "recover", element: <MemberRecover /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
