import BottomNavbar from "../../components/BottomNavbar";
import Header from "../../components/Header";
import { SlArrowRight } from "react-icons/sl";
import resume from "../../assets/my/resume.png";
import suitcase from "../../assets/my/suitcase.png";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import member from "../../assets/member.png";
import type { MyInfo } from "../../types/member";
import { getMyInfo, updateProfileImage } from "../../apis/employerMyPage";
import { deactivateMember, getMe } from "../../apis/mypage";

const EmployerMyPage = () => {
  const navigate = useNavigate();

  const [showUnregister, setShowUnregister] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 파일 인풋 참조
  const fileRef = useRef<HTMLInputElement | null>(null);

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

  // 프로필 이미지 src 계산( null/빈값 → 기본 이미지 )
  const profileSrc = useMemo(() => {
    const url = myInfo?.profileImageUrl?.trim();
    return url ? url : member;
  }, [myInfo?.profileImageUrl]);

  const handleClickProfile = useCallback(() => {
    if (isUploading) return;
    fileRef.current?.click();
  }, [isUploading]);

  const handleChangeProfileFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setIsUploading(true);
        const uploadedUrl = await updateProfileImage(file);

        // 바로 UI 반영 (state 내 profileImageUrl 교체)
        setMyInfo((prev) =>
          prev ? { ...prev, profileImageUrl: uploadedUrl } : prev
        );
      } catch (err) {
        console.error(err);
        alert("프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      } finally {
        // 같은 파일 재선택 가능하도록 value 리셋
        if (fileRef.current) fileRef.current.value = "";
        setIsUploading(false);
      }
    },
    []
  );

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      // 필요하면 여기서 서버 로그아웃 API 호출(postLogout)도 추가 가능
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

      // 토큰 제거 & 이동
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

  return (
    <div className="bg-white" style={{ fontFamily: "Pretendard" }}>
      <Header title="마이페이지" />

      <div className="min-h-screen pb-[100px] overflow-y-auto mt-[50px]">
        {/* 프로필 영역 */}
        <section className="flex items-center justify-between px-[20px] py-[15px] h-[115px] border-b border-[#DEDEDE]">
          <div className="flex items-center gap-4">
            {/* 프로필 이미지 */}
            <button
              type="button"
              onClick={handleClickProfile}
              className="relative w-[60px] h-[60px] rounded-full overflow-hidden shrink-0 focus:outline-none"
              aria-label="프로필 이미지 수정"
              title="프로필 이미지 수정"
            >
              <img
                src={profileSrc}
                alt="프로필 이미지"
                className="w-full h-full object-cover"
              />
            </button>

            {/* 숨김 파일 입력 */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChangeProfileFile}
            />

            <div>
              <p className="text-[18px]" style={{ fontWeight: 800 }}>
                {myInfo?.name ?? "이름을 등록해주세요"}
              </p>
              <p className="text-[13px]">
                서로를 이어주는 내일, 지금 시작해보세요
              </p>
            </div>
          </div>

          <button onClick={() => navigate("/MyPage/MemberInfo")}>
            <SlArrowRight className="w-[15px] h-[15px]" />
          </button>
        </section>

        {/* 바로가기 카드 */}
        <section className="flex justify-around h-[100px] border-b border-[#DEDEDE] px-[20px] py-[15px] mb-[30px]">
          <div
            onClick={() => navigate("/MyPage/ManageMyJobs")}
            className="flex flex-col items-center justify-center text-[15px] gap-[5px] w-[140px] h-[70px] bg-[#B8CDB9BF] rounded-xl cursor-pointer"
          >
            <p>공고 관리</p>
            <img src={resume} />
          </div>
          <div
            className="flex flex-col items-center justify-center text-[15px] gap-[5px] w-[140px] h-[70px] bg-[#B8CDB9BF] rounded-xl cursor-pointer"
            onClick={() => navigate("/post")}
          >
            <p>일자리 등록</p>
            <img src={suitcase} />
          </div>
        </section>

        {/* 사업자 정보 */}
        <section>
          <div
            className="flex px-[25px] h-[55px] mt-[10px] text-[15px] items-center border-b border-[#DEDEDE]"
            style={{ fontWeight: 800 }}
          >
            사업자 정보
          </div>
          <ul>
            <li
              onClick={() => navigate("/post/business")}
              className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#DEDEDE] cursor-pointer"
            >
              <span>사업자 정보 등록</span>
              <SlArrowRight />
            </li>
          </ul>
        </section>

        {/* 고객센터 */}
        <section>
          <div
            className="flex px-[25px] h-[55px] mt-[10px] text-[15px] items-center border-b border-[#DEDEDE]"
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
            <li
              onClick={() =>
                window.open(
                  "https://docs.google.com/forms/d/e/1FAIpQLSd5XMkA34kdag2Vk161Uej2baPBgLrDBEHj96ZHtolI3oVqvA/viewform?pli=1",
                  "_blank"
                )
              }
              className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#DEDEDE] cursor-pointer"
            >
              <span>1:1 문의</span>
              <button>
                <SlArrowRight className="w-[15px] h-[15px]" />
              </button>
            </li>
          </ul>
        </section>

        {/* 약관 */}
        <section>
          <div
            className="flex px-[25px] h-[55px] mt-[10px] text-[15px] items-center border-b border-[#DEDEDE]"
            style={{ fontWeight: 800 }}
          >
            약관 및 방침
          </div>
          <ul>
            <li
              onClick={() =>
                window.open(
                  "https://lava-scion-9fd.notion.site/244cf0577e4180128dc9df50ee9b73e6?source=copy_link",
                  "_blank"
                )
              }
              className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#DEDEDE] cursor-pointer"
            >
              <span>이용약관</span>
              <SlArrowRight />
            </li>
            <li
              onClick={() =>
                window.open(
                  "https://lava-scion-9fd.notion.site/244cf0577e4180658616e53b81ba4a5e?source=copy_link",
                  "_blank"
                )
              }
              className="flex h-[50px] px-[25px] text-[15px] items-center justify-between border-b border-[#DEDEDE] cursor-pointer"
            >
              <span>개인정보처리방침</span>
              <SlArrowRight />
            </li>
          </ul>
        </section>

        {/* 로그아웃/탈퇴 */}
        <section>
          <div className="flex justify-center items-center text-[14px] h-[16px] gap-5 my-[70px]">
            <button
              className="cursor-pointer"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </button>
            <span>|</span>
            <button
              className="text-[#EE0606] cursor-pointer"
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

export default EmployerMyPage;
