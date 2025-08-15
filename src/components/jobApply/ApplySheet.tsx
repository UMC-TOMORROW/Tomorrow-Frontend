import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title?: string;
  content: string;
  setContent: (v: string) => void;

  // 체크박스 제어
  attachChecked: boolean;
  onToggleAttach: (checked: boolean) => void;

  // 제출 제어
  canSubmit: boolean; // 부모에서 계산: attachChecked && !submitting
  submitting?: boolean;

  onClose: () => void;
  onSubmit: () => void;
};

export default function ApplySheet({
  open,
  title = "지원하기",
  content,
  setContent,
  attachChecked,
  onToggleAttach,
  canSubmit,
  submitting = false,
  onClose,
  onSubmit,
}: Props) {
  const backdropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => open && e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] bg-black/30 flex items-end"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div
        className="w-[95%] max-w-[375px] mx-auto bg-white rounded-2xl shadow-2xl !mb-5"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        {/* 헤더 */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center !px-4 !py-2 border-b border-[#EAEAEA] bg-[#B8CDB9] rounded-t-2xl">
          <span />
          <h2 className="justify-self-center text-[18px] !font-bold text-[#333333]">{title}</h2>
          <button onClick={onClose} className="justify-self-end w-9 h-9 rounded-lg hover:bg-black/5" aria-label="닫기">
            ×
          </button>
        </div>

        {/* 바디 */}
        <div className="!px-4 !py-3 !space-y-3">
          <div className="!space-y-2">
            <p className="text-[16px] text-[#333] !font-semibold">기본 정보</p>
            <p className="text-[16px] text-[#333]">이름 / 성별 / 나이 / 거주지 / 지원 동기 및 각오</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-[#DEDEDE] !p-3 text-[14px] outline-none focus:border-[#729A73]"
              placeholder="예) 홍길동 / 남 / 26 / 관악구 · 성실히 임하겠습니다."
            />
          </div>

          <label className="flex items-center gap-2 text-[14px] text-[#333] select-none">
            <input
              type="checkbox"
              className="w-5 h-5 accent-[#729A73]"
              checked={attachChecked}
              onChange={(e) => onToggleAttach(e.target.checked)}
            />
            이력서 첨부하기
          </label>
        </div>

        {/* 푸터 */}
        <div className="!px-4 pt-2 pb-4 grid grid-cols-2 gap-3">
          <button onClick={onClose} className="h-12 rounded-[10px] border border-[#D1D5DB] text-[#333] font-semibold">
            이전
          </button>
          <button
            onClick={onSubmit}
            disabled={!canSubmit || submitting}
            className={`h-12 rounded-[10px] font-semibold text-white ${
              !canSubmit || submitting ? "bg-[#C9C9C9] cursor-not-allowed" : "bg-[#729A73]"
            }`}
          >
            {submitting ? "처리 중..." : "지원하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
