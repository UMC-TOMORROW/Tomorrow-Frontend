import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/HomePage";
import OnboardingScreen from "./pages/Onboarding";
// import SearchPage from "./pages/SearchPage";
import MyPage from "./pages/Mypage/MyPage";
import CareerTalkListPage from "./pages/careerTalk/CareerTalkListPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "onboarding", element: <OnboardingScreen /> },
      // { path: "search", element: <SearchPage /> },
      {path: 'careertalk', element: <CareerTalkListPage/>},
      { path: "MyPage", element: <MyPage /> }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
