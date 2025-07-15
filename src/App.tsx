import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/HomePage";
import MyPage from "./pages/Mypage/MyPage";
import ApplicantDetail from "./pages/Mypage/ApplicantDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    path: "/MyPage",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [{ index: true, element: <MyPage /> }],
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
