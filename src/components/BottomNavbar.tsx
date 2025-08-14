import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import home from "../assets/bottomNavbar/home.png";
import home_selected from "../assets/bottomNavbar/home_selected.png";
import my from "../assets/bottomNavbar/my.png";
import my_selected from "../assets/bottomNavbar/my_selected.png";
import recommend from "../assets/bottomNavbar/recommend.png";
import recommend_selected from "../assets/bottomNavbar/recommend_selected.png";
import talk from "../assets/bottomNavbar/talk.png";
import talk_selected from "../assets/bottomNavbar/talk_selected.png";
import { getMyMemberType } from "../apis/employerMyPage";
import type { MemberType } from "../types/member";

const BottomNavbar = () => {
  const location = useLocation();

  // 기본값을 null로 두고, 실패 시에도 구직자 경로(/MyPage)로 동작하도록 처리
  const [memberType, setMemberType] = useState<MemberType | null>(null);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const t = await getMyMemberType();
        if (!canceled) setMemberType(t);
      } catch {
        if (!canceled) setMemberType(null);
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  const myPagePath = useMemo(() => {
    return memberType === "EMPLOYER" ? "/MyPage/EmployerMyPage" : "/MyPage";
  }, [memberType]);

  const navItems = useMemo(
    () => [
      { icon: home, selectedIcon: home_selected, label: "홈", path: "/" },
      {
        icon: recommend,
        selectedIcon: recommend_selected,
        label: "내일추천",
        path: "/recommendation",
      },
      {
        icon: talk,
        selectedIcon: talk_selected,
        label: "커리어톡",
        path: "/career-talk",
      },
      {
        icon: my,
        selectedIcon: my_selected,
        label: "마이페이지",
        path: myPagePath,
      },
    ],
    [myPagePath]
  );

  const isActivePath = (itemPath: string, label: string) => {
    if (label === "마이페이지") {
      return (
        location.pathname === "/MyPage" ||
        location.pathname.startsWith("/MyPage/")
      );
    }
    return location.pathname === itemPath;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[393px] px-[27px] py-[10px] border-t border-[#DEDEDE] flex justify-between items-center h-[64px] text-[11px] z-50 bg-white">
      <div className="flex w-full justify-between items-center">
        {navItems.map((item, index) => {
          const active = isActivePath(item.path, item.label);

          return (
            <NavLink
              to={item.path}
              key={index}
              className="flex flex-col items-center justify-center text-xs text-[#555555D9] flex-1"
            >
              <img
                src={active ? item.selectedIcon : item.icon}
                alt={item.label}
                className="w-[24px] h-[24px]"
              />
              <span
                className={`h-[21px] mt-[4px] ${
                  active ? "text-[#729A73]" : "text-[#555555D9]"
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavbar;
