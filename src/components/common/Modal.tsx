// components/common/Modal.tsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

type Variant = "success" | "warning" | "error" | "default";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  message?: string; // 단순 알럿 메시지
  actions?: React.ReactNode; // 하단 버튼(확인 등)
  children?: React.ReactNode; // 커스텀 내용 사용 시
  variant?: Variant; // 색감/아이콘 바뀜
  dismissOnBackdrop?: boolean; // 배경 클릭 닫힘
  dismissOnEsc?: boolean; // ESC 닫힘
};

const palette: Record<Variant, { ring: string; tone: string; icon: string }> = {
  success: { ring: "ring-green-500/30", tone: "text-green-700", icon: "✅" },
  warning: { ring: "ring-yellow-500/30", tone: "text-yellow-700", icon: "⚠️" },
  error: { ring: "ring-red-500/30", tone: "text-red-700", icon: "⛔" },
  default: { ring: "ring-gray-300", tone: "text-[#333]", icon: "ℹ️" },
};

export default function Modal({
  open,
  onClose,
  message,
  actions,
  children,
  variant = "default",
  dismissOnBackdrop = true,
  dismissOnEsc = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissOnEsc) onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, dismissOnEsc]);

  if (!open) return null;

  const { ring, tone, icon } = palette[variant];

  return createPortal(
    <div className="fixed inset-0 z-[1000]" aria-modal="true" role="dialog">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={dismissOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center !p-4">
        <div className={`!mx-4 w-full max-w-sm rounded-[20px] bg-white shadow-xl ring-1 ${ring} outline-none`}>
          <div className=" !py-6 text-center !space-y-4">
            {message && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center text-5xl">
                  <span>{icon}</span>
                </div>
                <p
                  className={`text-[16px] font-semibold ${tone} whitespace-pre-line leading-relaxed break-words`}
                  style={{ wordBreak: "keep-all" }}
                >
                  {message}
                </p>
              </div>
            )}
            {children}
          </div>

          {actions && <div className="px-5 flex items-center justify-center gap-3">{actions}</div>}
        </div>
      </div>
    </div>,
    document.body
  );
}
