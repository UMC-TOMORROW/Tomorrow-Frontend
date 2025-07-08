import './App.css'
import {createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from './pages/NotFoundPage';
import HomeLayout from './layouts/HomeLayout';
import HomePage from './pages/HomePage';

const router = createBrowserRouter([
  {
  path: "/",
  element: <HomeLayout/>,
  errorElement: <NotFoundPage/>,
  children: [
    {index: true, element: <HomePage/>},
  ]
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App