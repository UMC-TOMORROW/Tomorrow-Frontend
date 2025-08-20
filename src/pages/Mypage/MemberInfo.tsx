import { useState, useRef, useEffect } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { putMyProfile, type MemberUpdatePayload } from "../../apis/mypage";
import { useNavigate } from "react-router-dom";
import RegionModal from "../../components/Homepage/HomepageModal/RegionModal";
import type { MyInfo } from "../../types/member";
import { getMyInfo } from "../../apis/employerMyPage";

const MemberInfo = () => {
  const navigate = useNavigate();

  const [gender, setGender] = useState<"남자" | "여자">();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isPhoneEditing, setIsPhoneEditing] = useState(false);
  const [phoneSaving, setPhoneSaving] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);

  const mapGenderToKo = (
    g?: "MALE" | "FEMALE" | null
  ): "남자" | "여자" | undefined =>
    g === "MALE" ? "남자" : g === "FEMALE" ? "여자" : undefined;

  const mapGender = (g?: "남자" | "여자"): "MALE" | "FEMALE" | undefined =>
    g === "남자" ? "MALE" : g === "여자" ? "FEMALE" : undefined;

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

  const handleSave = async () => {
    if (saving) return;

    if (!email.trim()) {
      alert("이메일은 필수 입력 항목입니다.");
      return;
    }
    if (!name.trim()) {
      alert("이름은 필수 입력 항목입니다.");
      return;
    }

    try {
      setSaving(true);
      const me = myInfo ?? (await getMyInfo());

      const overrides = {
        email,
        name,
        gender: mapGender(gender),
        phoneNumber,
        address,
      };
      const fullBody = buildFullBody(me, overrides);
      await putMyProfile(fullBody);

      await putMyProfile(fullBody);
      alert("회원 정보가 수정되었습니다.");
      navigate(-1);
    } catch (e) {
      console.error(e);
      alert("수정 중 오류가 발생했습니다.");
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
      const me = myInfo ?? (await getMyInfo());
      const fullBody = buildFullBody(me, { phoneNumber });

      console.log("[PUT /members/me] phone body =", fullBody);

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
        const me = await getMyInfo();
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

  const buildFullBody = (
    me: MyInfo,
    overrides?: Partial<MemberUpdatePayload>
  ): MemberUpdatePayload => {
    const isOnboarded =
      typeof overrides?.isOnboarded === "boolean"
        ? overrides.isOnboarded
        : me.isOnboarded ?? false;

    return {
      email: overrides?.email ?? me.email ?? undefined,
      name: overrides?.name ?? me.name ?? undefined,
      gender:
        overrides?.gender ??
        (me.gender as "MALE" | "FEMALE" | null) ??
        undefined,
      phoneNumber: overrides?.phoneNumber ?? me.phoneNumber ?? undefined,
      address: overrides?.address ?? me.address ?? undefined,
      isOnboarded,
      resumeId: overrides?.resumeId ?? me.resumeId ?? null,
    };
  };

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
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

        <section>
          <p
            className="text-[18px] px-[25px] pt-[30px] pb-[20px]"
            style={{ fontWeight: 800 }}
          >
            기본 정보
          </p>

          <form className="flex flex-col px-[25px] gap-[20px] pb-[30px]">
            {/* 이메일 */}
            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px]" style={{ fontWeight: 600 }}>
                이메일 <span style={{ color: "#EE0606CC" }}>*</span>
              </p>
              <input
                type="text"
                className="w-full h-[42px] px-[5px] border border-[#5555558C] text-[13px]"
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
                className="w-full h-[42px] px-[5px] border border-[#5555558C] text-[13px]"
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
                  onClick={() => setGender("남자")}
                  type="button"
                  className={`w-full h-[42px] text-[14px] ${
                    gender === "남자"
                      ? "bg-[#729A73] text-[#FFFFFF]"
                      : "border border-[#729A73] text-[#555555D9]"
                  }`}
                  style={{ borderRadius: "10px" }}
                >
                  남자
                </button>
                <button
                  onClick={() => setGender("여자")}
                  type="button"
                  className={`w-full h-[42px] text-[14px] ${
                    gender === "여자"
                      ? "bg-[#729A73] text-[#FFFFFF]"
                      : "border border-[#729A73] text-[#555555D9]"
                  }`}
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
                  className="flex-1 w-[235px] h-[44px] px-[10px] border border-[#5555558C] text-[13px]"
                  style={{ borderRadius: "10px" }}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <button
                  type="button"
                  className="w-[66px] h-[44px] bg-[#B8CDB9BF] text-[13px]"
                  style={{ borderRadius: "10px" }}
                  onClick={handlePhoneChangeClick}
                  disabled={phoneSaving}
                >
                  변경
                </button>
              </div>
            </div>

            {/* 주소 (검색 버튼으로만 입력) */}
            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px]" style={{ fontWeight: 600 }}>
                주소
              </p>
              <div className="flex gap-[32px] w-full">
                <input
                  type="text"
                  placeholder="서울시 OO구"
                  className="flex-1 w-[235px] h-[44px] px-[10px] border border-[#5555558C] text-[13px]"
                  style={{ borderRadius: "10px" }}
                  value={address}
                  readOnly
                />
                <button
                  type="button"
                  className="w-[66px] h-[44px] bg-[#B8CDB9BF] text-[13px]"
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
      </div>
    </div>
  );
};

export default MemberInfo;
