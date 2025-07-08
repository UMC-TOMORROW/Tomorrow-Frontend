import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import ApplyStatus from "./pages/ApplyStatus";
import ApplyStatusPassed from "./pages/ApplyStatusPassed";
import ReviewWritting from "./pages/ReviewWritting";

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
    path: "/MyPage/ApplyStatus",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [{ index: true, element: <ApplyStatus /> }],
  },
  {
    path: "/MyPage/ApplyStatusPassed",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [{ index: true, element: <ApplyStatusPassed /> }],
  },
  {
    path: "/MyPage/ReviewWritting",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [{ index: true, element: <ReviewWritting /> }],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
