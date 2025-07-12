import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "../components/splash/SplashScreen";

const SplashScreenPage = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigate("/");
  //   }, 5000); // 2초 후에 온보딩 화면으로 이동
  //   return () => clearTimeout(timer);
  // }, [navigate]);
  // 이펙트 훅을 사용하여 2초 후에 홈 페이지로 이동

  return <SplashScreen />;
};

export default SplashScreenPage;
