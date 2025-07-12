import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/HomePage";
import OnboardingScreen from "./pages/Onboarding";
// import SearchPage from "./pages/SearchPage";
import MyPage from "./pages/Mypage/MyPage";
import CareerTalkListPage from "./pages/careerTalk/CareerTalkListPage";
import CareerTalkWritePage from "./pages/careerTalk/CareerTalkWritePage";
import CareerTalkDetailPage from "./pages/careerTalk/CareerTalkDetailPage";
import SearchBarTest from "./pages/SearchBarTest";
import SplashScreenPage from "./pages/SplashScreenPage";
import AuthScreen from "./pages/auth/AuthScreen";

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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
