import { useEffect, useRef, useState } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

import RegionModal from "../../components/Homepage/HomepageModal/RegionModal";
import { putMyProfile } from "../../apis/mypage";
import { getMyInfo } from "../../apis/employerMyPage";
import type { MyInfo } from "../../types/member";
import palette from "../../styles/theme";

export default function UserInfoForm() {
  const navigate = useNavigate();
  const [introOpen, setIntroOpen] = useState(true);

  const [gender, setGender] = useState<"남자" | "여자">();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [saving, setSaving] = useState(false);
  const [phoneSaving, setPhoneSaving] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isPhoneEditing, setIsPhoneEditing] = useState(false);

  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);

  const mapGenderToKo = (
    g?: "MALE" | "FEMALE" | null
  ): "남자" | "여자" | undefined =>
    g === "MALE" ? "남자" : g === "FEMALE" ? "여자" : undefined;

  const mapGender = (g?: "남자" | "여자"): "MALE" | "FEMALE" | undefined => {
    if (g === "남자") return "MALE";
    if (g === "여자") return "FEMALE";
    return undefined;
  };

  const getProviderLabel = (p?: string | null) => {
    if (!p) return null;
    const providerKo: Record<"NAVER" | "GOOGLE" | "KAKAO", string> = {
      NAVER: "네이버",
      GOOGLE: "구글",
      KAKAO: "카카오",
    };
    const key = p.toUpperCase() as keyof typeof providerKo;
    return providerKo[key] ?? null;
  };

  const normalizeMe = (me: any) => ({
    ...me,
    isOnboarded:
      typeof me?.isOnboarded === "boolean"
        ? me.isOnboarded
        : typeof me?.inOnboarded === "boolean"
        ? me.inOnboarded
        : false,
  });

  const buildFullBody = (me: any, overrides?: Partial<any>) => {
    const rawProviderUserId =
      overrides?.providerUserId ?? me.providerUserId ?? me.providerUseId ?? "";
    const providerUserId = String(rawProviderUserId);

    const isOnboarded =
      typeof overrides?.isOnboarded === "boolean"
        ? overrides!.isOnboarded
        : typeof me.isOnboarded === "boolean"
        ? me.isOnboarded
        : typeof me.inOnboarded === "boolean"
        ? me.inOnboarded
        : false;

    const status = overrides?.status ?? me.status ?? "ACTIVE";

    return {
      id: me.id,
      username: me.username,

      status,
      isOnboarded,
      provider: me.provider,
      providerUserId,
      resumeId: me.resumeId,

      email: overrides?.email ?? me.email,
      name: overrides?.name ?? me.name,
      gender: overrides?.gender ?? me.gender,
      phoneNumber: overrides?.phoneNumber ?? me.phoneNumber,
      address: overrides?.address ?? me.address,

      createdAt: me.createdAt,
      updatedAt: me.updatedAt,
    };
  };

  const handleSave = async () => {
    if (introOpen) {
      setIntroOpen(false);
      return;
    }

    const emailTrim = email.trim();
    const nameTrim = name.trim();
    const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailTrim) {
      alert("이메일은 필수 입력 항목입니다.");
      return;
    }
    if (!emailLike.test(emailTrim)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }
    if (!nameTrim) {
      alert("이름은 필수 입력 항목입니다.");
      return;
    }

    try {
      setSaving(true);

      // 최소 필드만 전송 + 온보딩 진입을 위해 isOnboarded:false 포함
      await putMyProfile({
        email: emailTrim,
        name: nameTrim,
        gender: mapGender(gender),
        phoneNumber: phoneNumber || undefined,
        address: address || undefined,
        isOnboarded: false,
      });

      try {
        sessionStorage.setItem("allowOnboarding", "1");
      } catch {
        //
      }

      alert("회원 정보가 저장되었습니다.");
      navigate("/onboarding", { replace: true });
    } catch (e) {
      console.error(e);
      alert((e as Error).message || "저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhoneChangeClick = async () => {
    if (!isPhoneEditing) {
      setIsPhoneEditing(true);
      setTimeout(() => phoneInputRef.current?.focus(), 0);
      return;
    }
    if (phoneSaving) return;
    if (!phoneNumber.trim()) {
      alert("휴대폰 번호를 입력해 주세요.");
      phoneInputRef.current?.focus();
      return;
    }
    try {
      setPhoneSaving(true);
      const raw = myInfo ?? (await getMyInfo());
      const me = normalizeMe(raw);
      const fullBody = buildFullBody(me, { phoneNumber });
      await putMyProfile(fullBody);
      alert("휴대폰 번호가 변경되었습니다.");
      setIsPhoneEditing(false);
    } catch (e) {
      console.error(e);
      alert("휴대폰 번호 변경 중 오류가 발생했습니다.");
    } finally {
      setPhoneSaving(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const raw = await getMyInfo();
        const me = normalizeMe(raw);
        setMyInfo(me);
        setEmail(me.email ?? "");
        setName(me.name ?? "");
        setGender(mapGenderToKo(me.gender as "MALE" | "FEMALE" | null));
        setPhoneNumber(me.phoneNumber ?? "");
        setAddress(me.address ?? "");
      } catch (e) {
        console.error("내 정보 불러오기 실패:", e);
      }
    })();
  }, []);

  const allDisabled = saving || introOpen;

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen relative">
        {/* 헤더 */}
        <section className="relative flex justify-center items-center h-[52px] border-b border-[#DEDEDE]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-[15px]"
          >
            <SlArrowLeft />
          </button>
          <div className="text-[20px]" style={{ fontWeight: 600 }}>
            회원 정보
          </div>
        </section>

        {/* 폼 */}
        <section aria-hidden={introOpen}>
          <p
            className="text-[18px] px-[25px] pt-[30px] pb-[20px]"
            style={{ fontWeight: 800 }}
          >
            기본 정보
          </p>

          <form
            className="flex flex-col px-[25px] gap-[20px] pb-[30px]"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* 이메일 */}
            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px]" style={{ fontWeight: 600 }}>
                이메일 <span style={{ color: "#EE0606CC" }}>*</span>
              </p>
              <input
                type="email"
                required
                disabled={allDisabled}
                className="w-full h-[42px] px-[5px] border border-[#5555558C] text-[13px] disabled:bg-[#F5F5F5]"
                style={{ borderRadius: "10px" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {(() => {
                const label = getProviderLabel(myInfo?.provider);
                return label ? (
                  <p className="text-[12px] text-[#555555D9]">
                    {label} 로그인 사용 중
                  </p>
                ) : null;
              })()}
            </div>

            {/* 이름 */}
            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px]" style={{ fontWeight: 600 }}>
                이름 <span style={{ color: "#EE0606CC" }}>*</span>
              </p>
              <input
                type="text"
                required
                disabled={allDisabled}
                className="w-full h-[42px] px-[5px] border border-[#5555558C] text-[13px] disabled:bg-[#F5F5F5]"
                style={{ borderRadius: "10px" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 성별 */}
            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px]" style={{ fontWeight: 600 }}>
                성별
              </p>
              <div className="flex gap-[14px] w-full">
                <button
                  type="button"
                  disabled={allDisabled}
                  onClick={() => setGender("남자")}
                  className={`w-full h-[42px] text-[14px] ${
                    gender === "남자"
                      ? "bg-[#729A73] text-[#FFFFFF]"
                      : "border border-[#729A73] text-[#555555D9]"
                  } disabled:opacity-60`}
                  style={{ borderRadius: "10px" }}
                >
                  남자
                </button>
                <button
                  type="button"
                  disabled={allDisabled}
                  onClick={() => setGender("여자")}
                  className={`w-full h-[42px] text-[14px] ${
                    gender === "여자"
                      ? "bg-[#729A73] text-[#FFFFFF]"
                      : "border border-[#729A73] text-[#555555D9]"
                  } disabled:opacity-60`}
                  style={{ borderRadius: "10px" }}
                >
                  여자
                </button>
              </div>
            </div>

            {/* 휴대폰 */}
            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px]" style={{ fontWeight: 600 }}>
                휴대폰
              </p>
              <div className="flex gap-[32px] w-full">
                <input
                  ref={phoneInputRef}
                  type="tel"
                  placeholder="010-1234-5678"
                  disabled={saving || phoneSaving || introOpen}
                  className="flex-1 w-[235px] h-[44px] px-[10px] border border-[#5555558C] text-[13px] disabled:bg-[#F5F5F5]"
                  style={{ borderRadius: "10px" }}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <button
                  type="button"
                  disabled={saving || phoneSaving || introOpen}
                  className="w-[66px] h-[44px] bg-[#B8CDB9BF] text-[13px] disabled:opacity-60"
                  style={{ borderRadius: "10px" }}
                  onClick={handlePhoneChangeClick}
                >
                  변경
                </button>
              </div>
            </div>

            {/* 주소 */}
            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px]" style={{ fontWeight: 600 }}>
                주소
              </p>
              <div className="flex gap-[32px] w-full">
                <input
                  type="text"
                  placeholder="서울시 OO구"
                  disabled={true}
                  className="flex-1 w-[235px] h-[44px] px-[10px] border border-[#5555558C] text-[13px] disabled:bg-[#F5F5F5]"
                  style={{ borderRadius: "10px" }}
                  value={address}
                  readOnly
                />
                <button
                  type="button"
                  disabled={saving || introOpen}
                  className="w-[66px] h-[44px] bg-[#B8CDB9BF] text-[13px] disabled:opacity-60"
                  style={{ borderRadius: "10px" }}
                  onClick={() => setIsRegionModalOpen(true)}
                >
                  검색
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="flex justify-center items-center">
          <button
            className="text-[#FFFFFF] text-[16px] w-[333px] h-[50px] bg-[#729A73]"
            style={{ fontWeight: 600, borderRadius: "10px" }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "저장 중..." : "수정 완료"}
          </button>
        </section>

        {/* 주소 선택 모달 */}
        <RegionModal
          isOpen={isRegionModalOpen}
          onClose={() => setIsRegionModalOpen(false)}
          onSubmit={(regions: string[]) => {
            const display =
              regions.length === 0 ? "서울시 전체" : `서울시 ${regions[0]}`;
            setAddress(display);
            setIsRegionModalOpen(false);
          }}
        />

        {introOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000]/30">
            <div className="w-[330px] h-[237px] bg-white rounded-[10px] shadow-xl flex flex-col px-6 py-5">
              {/* 제목 */}
              <p
                className="!mt-5 text-[20px] font-extrabold text-center"
                style={{
                  fontFamily: "Pretendard",
                  color: palette.primary.primary,
                }}
              >
                필수 동의 및 정보 입력이 필요해요.
              </p>

              {/* 본문 */}
              <p
                className="text-[16px] text-center leading-6 text-[#333] flex-1 flex items-center justify-center"
                style={{ fontFamily: "Pretendard" }}
              >
                지원 완료를 위해 이메일 수신 동의와
                <br />
                필수 항목(이름, 이메일)을 입력해주세요.
              </p>

              {/* 구분선 + 버튼 */}
              <div className="!mb-4 w-full">
                <div className="w-full border-t border-[#DEDEDE] !mb-4"></div>
                <button
                  className="w-[280px] h-[48px] rounded-[10px] !text-white text-[16px] font-semibold mx-auto block"
                  style={{
                    fontFamily: "Pretendard",
                    background: palette.primary.primary,
                  }}
                  onClick={() => setIntroOpen(false)}
                  autoFocus
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
