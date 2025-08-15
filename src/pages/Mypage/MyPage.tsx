import BottomNavbar from "../../components/BottomNavbar";
import Header from "../../components/Header";
import { SlArrowRight } from "react-icons/sl";
import resume from "../../assets/my/resume.png";
import star_filled_black from "../../assets/my/star_filled_black.png";
import { Link, useNavigate } from "react-router-dom";
import { getMe1 } from "../../apis/member";
import { useCallback, useEffect, useState } from "react";
import recommend from "../../assets/recommend.png";
import member from "../../assets/member.png";
import { deactivateMember, getMe } from "../../apis/mypage";
import type { MyInfo } from "../../types/member";
import { getMyInfo } from "../../apis/employerMyPage";

const MyPage = () => {
  const navigate = useNavigate();
  const [showUnregister, setShowUnregister] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const data = await getMyInfo();
        setMyInfo(data);
      } catch (error) {
        console.error("내 정보 불러오기 실패:", error);
      }
    };
    fetchMyInfo();
  }, []);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("memberId");
      navigate("/auth", { replace: true });
    } catch {
      alert("로그아웃 중 문제가 발생했습니다.");
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, navigate]);

  const handleDeactivate = useCallback(async () => {
    if (isDeactivating) return;

    try {
      setIsDeactivating(true);

      const meId = await getMe();
      if (!meId) {
        alert("회원 정보를 찾을 수 없습니다. 다시 로그인 후 이용해 주세요.");
        return;
      }

      const res = await deactivateMember(meId);

      const recoverableUntil = res?.recoverableUntil
        ? new Date(res.recoverableUntil).toLocaleString()
        : "알 수 없음";
      alert(`탈퇴가 접수되었습니다.\n복구 가능 기한: ${recoverableUntil}`);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("memberId");
      setShowUnregister(false);
      navigate("/auth", { replace: true });
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
      alert(
        `탈퇴 처리에 실패했습니다.\n(이미 탈퇴된 계정일 수 있어요)\n${msg}`
      );
      console.error(e);
    } finally {
      setIsDeactivating(false);
    }
  }, [isDeactivating, navigate]);

  const [resumeId, setResumeId] = useState<number | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe1();
        setResumeId(me.resumeId ?? null);
      } catch (e) {
        console.error("resumeId 조회 실패:", e);
      }
    })();
  }, []);

  const handleGoResumeManage = () => {
    if (resumeId == null) {
      navigate(`/MyPage/ResumeManage`);
    } else {
      navigate(`/MyPage/ResumeManage/${resumeId}`);
    }
  };

  return (
    <div className="bg-white" style={{ fontFamily: "Pretendard" }}>
      <Header title="마이페이지" />

      <div className="min-h-screen pb-[100px] overflow-y-auto mt-[50px]">
        <section className="flex items-center justify-between px-[20px] py-[15px] h-[115px] border-b border-[#DEDEDE]">
          <div className="flex items-center gap-4">
            <img src={member} />
            <div>
              <p className="text-[18px]" style={{ fontWeight: 800 }}>
                {myInfo?.name ?? "이름을 등록해주세요"}
              </p>
              <p className="text-[14px]">몸도 마음도 건강한 하루 되세요!</p>
            </div>
          </div>
          <button onClick={() => navigate("/MyPage/MemberInfo")}>
            <SlArrowRight className="w-[15px] h-[15px]" />
          </button>
        </section>

        <section className="flex justify-around h-[100px] border-b border-[#DEDEDE] px-[20px] py-[15px]">
          <div
            //onClick={() => navigate(`/MyPage/ResumeManage/${resumeId}`)}
            onClick={handleGoResumeManage}
            className="flex flex-col items-center justify-center text-[15px] gap-[5px] w-[140px] h-[70px] bg-[#B8CDB9BF] rounded-xl"
          >
            <p>이력서 관리</p>
            <img src={resume} />
          </div>
          <div
            className="flex flex-col items-center justify-center text-[15px] gap-[5px] w-[140px] h-[70px] bg-[#B8CDB9BF] rounded-xl"
            onClick={() => navigate("/MyPage/WorkPreference")}
          >
            <p>내일 추천 관리</p>
            <img src={recommend} />
          </div>
        </section>

        <section className="flex items-center justify-center h-[50px] divide-x border-b border-[#DEDEDE]">
          <div
            onClick={() => navigate("/MyPage/ApplyStatus")}
            className="text-[16px] flex w-1/2 items-center justify-center"
          >
            지원 현황
          </div>
          <div
            onClick={() => navigate("/MyPage/SavedJobs")}
            className="flex w-1/2 items-center justify-center gap-[3px]"
          >
            <img
              src={star_filled_black}
              className="text-[16px] w-[20px] h-[20px]"
            />
            저장
          </div>
        </section>

        <section>
          <div
            className="flex px-[25px] h-[55px] text-[15px] items-center border-b border-[#DEDEDE]"
            style={{ fontWeight: 800 }}
          >
            고객센터
          </div>
          <ul>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#DEDEDE]">
              <span>공지사항</span>
              <SlArrowRight />
            </li>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#DEDEDE]">
              <span>자주 묻는 질문</span>
              <SlArrowRight />
            </li>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#DEDEDE]">
              <span>1:1 문의</span>
              <Link
                to={
                  "https://docs.google.com/forms/d/e/1FAIpQLSd5XMkA34kdag2Vk161Uej2baPBgLrDBEHj96ZHtolI3oVqvA/viewform?pli=1"
                }
              >
                <SlArrowRight className="w-[15px] h-[15px]"/>
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <div
            className="flex px-[25px] h-[55px] mt-[17px] text-[15px] items-center border-b border-[#DEDEDE]"
            style={{ fontWeight: 800 }}
          >
            약관 및 방침
          </div>
          <ul>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#DEDEDE]">
              <span>이용약관</span>
              <Link
                to={
                  "https://lava-scion-9fd.notion.site/244cf0577e4180ee95abf93b26139a51?source=copy_link"
                }
              >
                <SlArrowRight />
              </Link>
            </li>
            <li className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#DEDEDE]">
              <span>개인정보처리방침</span>
              <Link
                to={
                  "https://lava-scion-9fd.notion.site/244cf0577e41803eae07ee61ed293c45?source=copy_link"
                }
              >
                <SlArrowRight />
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <div className="flex justify-center items-center text-[14px] h-[16px] gap-5 my-[70px]">
            <button onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </button>
            <span>|</span>
            <button
              className="text-[#EE0606]"
              onClick={() => setShowUnregister(true)}
            >
              회원 탈퇴
            </button>
          </div>
        </section>

        {showUnregister && (
          <div
            className="fixed inset-0 z-50 flex justify-center items-center bg-[#70707080]/50"
            style={{ borderRadius: "15px" }}
          >
            <div
              className="flex flex-col items-center justify-center text-center w-[330px] bg-[#FFFFFF]"
              style={{ borderRadius: "15px" }}
            >
              <div className="flex flex-col gap-[25px] py-[30px] h-[158px] w-full border-b border-[#729A73]">
                <p
                  className="text-[20px] text-[#729A73]"
                  style={{ fontWeight: 700 }}
                >
                  정말 탈퇴하시겠어요?
                </p>
                <p className="text-[16px]" style={{ fontWeight: 400 }}>
                  탈퇴 시 계정은 14일 동안 유지되며,
                  <br />
                  이후에는 삭제 되어 복구되지 않습니다.
                </p>
              </div>
              <div className="flex items-center justify-center py-[15px] gap-[17px] h-[75px]">
                <button
                  onClick={() => setShowUnregister(false)}
                  className="w-[140px] h-[48px] bg-[#729A73] text-[#FFFFFF] text-[16px]"
                  style={{ borderRadius: "10px" }}
                >
                  취소
                </button>
                <button
                  onClick={handleDeactivate}
                  disabled={isDeactivating}
                  className="w-[140px] h-[48px] border border-[#729A73] text-[#729A73] text-[16px]"
                  style={{ borderRadius: "10px" }}
                >
                  {isDeactivating ? "처리 중..." : "탈퇴"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavbar />
    </div>
  );
};

export default MyPage;
