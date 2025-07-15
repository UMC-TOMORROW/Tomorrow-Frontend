import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/HomePage";
import OnboardingScreen from "./pages/Onboarding";
// import SearchPage from "./pages/SearchPage";
import MyPage from "./pages/Mypage/MyPage";
<<<<<<< HEAD
import ApplicantDetail from "./pages/Mypage/ApplicantDetail";
=======
import CareerTalkListPage from "./pages/careerTalk/CareerTalkListPage";
import CareerTalkWritePage from "./pages/careerTalk/CareerTalkWritePage";
import CareerTalkDetailPage from "./pages/careerTalk/CareerTalkDetailPage";
import SearchBarTest from "./pages/SearchBarTest";
import RecommendationPage from "./pages/RecommendationPage";
import SplashScreenPage from "./pages/SplashScreenPage";
import AuthScreen from "./pages/auth/AuthScreen";
>>>>>>> develop

const router = createBrowserRouter([
  {
    path: "/splash",
    element: <SplashScreenPage />,
  },
  {
    path: "/auth",
    element: <AuthScreen />,
  },
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "onboarding", element: <OnboardingScreen /> },
      // { path: "search", element: <SearchPage /> },
      { path: "search-test", element: <SearchBarTest /> },
      { path: "career-talk", element: <CareerTalkListPage /> },
      { path: "career-talk/write", element: <CareerTalkWritePage /> },
      { path: "career-talk/:id", element: <CareerTalkDetailPage /> },
      { path: "MyPage", element: <MyPage /> },
      { path: "recommendation", element: <RecommendationPage /> },
    ],      
  },
  {
    path: "/MyPage/ApplicantList",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [{ index: true, element: <ApplicantDetail /> }],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
