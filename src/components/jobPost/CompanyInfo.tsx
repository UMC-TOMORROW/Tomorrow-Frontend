import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

declare global {
  interface Window {
    kakao: any;
    daum: any;
  }
}

type Props = {
  companyName: string;
  location: string; // 주소(장소)
  latitude?: number;
  longitude?: number;
  alwaysHiring: boolean; // 상시모집 (UI에 노출은 안 하지만 상태는 유지)
  isActive: boolean; // 활성화 (UI에 노출은 안 하지만 상태는 유지)
  onChange: (v: {
    companyName: string;
    location: string;
    latitude?: number;
    longitude?: number;
    alwaysHiring: boolean;
    isActive: boolean;
  }) => void;
  // onSearchClick?: () => void; // (옵션) 주소검색 연동용
};

const KAKAO_KEY = import.meta.env.VITE_KAKAO_APP_KEY as string;

// 카카오맵 SDK(services) 로더 – 중복 로드 방지
const ensureKakao = () =>
  new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.kakao?.maps) return resolve();

    const existed = document.querySelector('script[data-kakao-sdk="1"]') as HTMLScriptElement | null;
    if (existed) {
      const wait = () => (window.kakao?.maps ? resolve() : setTimeout(wait, 50));
      return wait();
    }

    if (!KAKAO_KEY) return reject(new Error("VITE_KAKAO_APP_KEY가 설정되지 않았습니다."));

    const s = document.createElement("script");
    s.setAttribute("data-kakao-sdk", "1");
    s.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services&autoload=false`;
    s.onload = () => window.kakao.maps.load(() => resolve());
    s.onerror = () => reject(new Error("카카오 SDK 로드 실패"));
    document.head.appendChild(s);
  });

// 다음 우편번호 로더 – 중복 로드 방지
const ensureDaumPostcode = () =>
  new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.daum?.Postcode) return resolve();
    const existed = document.querySelector('script[data-daum-postcode="1"]');
    if (existed) return resolve();

    const s = document.createElement("script");
    s.setAttribute("data-daum-postcode", "1");
    s.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Daum Postcode 로드 실패"));
    document.head.appendChild(s);
  });

function AddressSearchModal({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (v: { address: string; lat?: number; lng?: number }) => void;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    let canceled = false;

    (async () => {
      try {
        await Promise.all([ensureKakao(), ensureDaumPostcode()]);
      } catch (err: any) {
        alert(err?.message ?? "지도 스크립트를 불러오지 못했습니다.");
        onClose();
        return;
      }
      if (canceled || !boxRef.current) return;

      boxRef.current.innerHTML = "";

      const pc = new window.daum.Postcode({
        oncomplete: (data: any) => {
          const addr = data.roadAddress || data.jibunAddress || "";
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(addr, (result: any, status: any) => {
            let lat: number | undefined, lng: number | undefined;
            if (status === window.kakao.maps.services.Status.OK && result?.[0]) {
              lat = parseFloat(result[0].y);
              lng = parseFloat(result[0].x);
            }
            onPick({ address: addr, lat, lng });
            onClose();
          });
        },
        onresize: (size: any) => {
          if (boxRef.current) boxRef.current.style.height = size.height + "px";
        },
        width: "100%",
        height: "100%",
      });

      pc.embed(boxRef.current, { autoClose: true });
    })();

    return () => {
      canceled = true;
    };
  }, [open, onClose, onPick]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/40 flex items-center justify-center">
      <div className="w-[360px] max-w-[95vw] h-[420px] bg-white rounded-[12px] shadow-lg overflow-hidden relative">
        <button className="absolute right-3 top-3 text-xl leading-none" onClick={onClose} aria-label="닫기">
          ✕
        </button>
        <div ref={boxRef} className="w-full h-full" />
      </div>
    </div>
  );
}

export default function CompanyInfo({
  companyName,
  location,
  latitude,
  longitude,
  alwaysHiring,
  isActive,
  onChange,
}: Props) {
  // const handleSearch = () => {
  //   console.log("[CompanyInfo] 주소 검색 버튼 클릭");
  //   if (onSearchClick) return onSearchClick();
  //   alert("주소 검색 기능은 추후 구현 예정입니다.");
  // };

  const [addrOpen, setAddrOpen] = useState(false); // 주소 검색 모달 상태
  const emit = (next: Partial<Props>) => {
    onChange({
      companyName: next.companyName ?? companyName,
      location: next.location ?? location,
      latitude: next.latitude ?? latitude,
      longitude: next.longitude ?? longitude,
      alwaysHiring: next.alwaysHiring ?? alwaysHiring,
      isActive: next.isActive ?? isActive,
    });
  }; // 주소 검색 후 선택된 값 처리

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <h2
          style={{ marginBottom: "20px", fontWeight: "700" }}
          className="text-[18px] text-[#333] leading-[100%] font-pretendard"
        >
          업체 정보를 알려주세요.
        </h2>

        <p className="font-semibold text-[#333] !mb-2">업체명</p>
        <input
          type="text"
          placeholder="예) 내일"
          value={companyName}
          onChange={(e) => {
            const next = { companyName: e.target.value, location, alwaysHiring, isActive };
            console.log("[CompanyInfo] 업체명 변경:", next.companyName);
            onChange(next);
          }}
          className="w-full h-[44px] border border-[#DEDEDE] rounded-[8px] px-3 text-sm text-[#333] !px-3"
        />
      </div>

      <div className="relative">
        <p className="font-semibold text-[#333] !mb-2">장소</p>
        <input
          type="text"
          placeholder="주소를 검색해보세요."
          value={location}
          onChange={(e) => emit({ location: e.target.value })}
          className="w-full h-[44px] border border-[#DEDEDE] rounded-[8px] px-3 pr-10 text-sm text-[#333] !px-3"
        />
        <button
          type="button"
          onClick={() => setAddrOpen(true)}
          className="absolute top-[70%] right-3 -translate-y-1/2 text-[#707070]"
          aria-label="주소 검색"
          title="주소 검색"
        >
          <Search size={18} />
        </button>

        <AddressSearchModal
          open={addrOpen}
          onClose={() => setAddrOpen(false)}
          onPick={({ address, lat, lng }) => emit({ location: address, latitude: lat, longitude: lng })}
        />
      </div>
    </div>
  );
}
