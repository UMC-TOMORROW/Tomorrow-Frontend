import { useState, useRef } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { patchMyProfile } from "../../apis/mypage";
import { Link, useNavigate } from "react-router-dom";
import type { MemberUpdate } from "../../types/mypage";
import RegionModal from "../../components/Homepage/HomepageModal/RegionModal";

const mapGender = (g?: "남자" | "여자"): "MALE" | "FEMALE" | undefined => {
  if (g === "남자") return "MALE";
  if (g === "여자") return "FEMALE";
  return undefined;
};

const MemberInfo = () => {
  const navigate = useNavigate();

  const [gender, setGender] = useState<"남자" | "여자">();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  // 주소 모달
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

  // 휴대폰 변경 토글
  const [isPhoneEditing, setIsPhoneEditing] = useState(false);
  const [phoneSaving, setPhoneSaving] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);

  const handleSave = async () => {
    if (saving) return;

    const payload: MemberUpdate = {
      email: email || undefined,
      name: name || undefined,
      gender: mapGender(gender),
      ...(phoneNumber ? { phoneNumber } : {}),
      ...(address ? { address } : {}),
    };

    try {
      setSaving(true);
      await patchMyProfile(payload);
      alert("회원 정보가 수정되었습니다.");
      navigate(-1);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "수정 중 오류가 발생했습니다.";
      alert(msg);
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // 휴대폰 변경 버튼: 첫 클릭 → 입력 가능, 두 번째 클릭(완료) → 저장
  const handlePhoneChangeClick = async () => {
    if (!isPhoneEditing) {
      setIsPhoneEditing(true);
      setTimeout(() => phoneInputRef.current?.focus(), 0);
      return;
    }

    // 완료(저장)
    if (phoneSaving) return;
    if (!phoneNumber.trim()) {
      alert("휴대폰 번호를 입력해 주세요.");
      phoneInputRef.current?.focus();
      return;
    }

    try {
      setPhoneSaving(true);
      await patchMyProfile({ phoneNumber });
      alert("휴대폰 번호가 변경되었습니다.");
      setIsPhoneEditing(false);
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : "휴대폰 번호 변경 중 오류가 발생했습니다.";
      alert(msg);
      console.error(e);
    } finally {
      setPhoneSaving(false);
    }
  };

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        <section className="relative flex justify-center items-center h-[52px] border-b border-[#DEDEDE]">
          <Link to="/MyPage" className="absolute left-[15px]">
            <SlArrowLeft />
          </Link>
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
              <p className="text-[12px] text-[#555555D9]">
                카카오 로그인 사용중
              </p>
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
                  readOnly={!isPhoneEditing} // ← 변경 버튼 누르기 전엔 읽기 전용
                />
                <button
                  type="button"
                  className="w-[66px] h-[44px] bg-[#B8CDB9BF] text-[13px]"
                  style={{ borderRadius: "10px" }}
                  onClick={handlePhoneChangeClick}
                  disabled={phoneSaving}
                >
                  {isPhoneEditing ? (phoneSaving ? "저장…" : "완료") : "변경"}
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
                  type="text" // 표준 타입으로 유지
                  placeholder="서울시 OO구"
                  className="flex-1 w-[235px] h-[44px] px-[10px] border border-[#5555558C] text-[13px]"
                  style={{ borderRadius: "10px" }}
                  value={address}
                  readOnly // 직접 타이핑 금지
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
