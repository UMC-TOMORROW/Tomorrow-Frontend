import type { ParsedApplicantContent } from "../types/applicant";

/**
 * "이름/성별/나이/지역/자기소개" 형식의 문자열을 안전하게 파싱한다.
 * 예: "이지현/여/56세/광진구/도움이 되도록 성실히 하겠습니다."
 */
export function parseApplicantContent(content?: string | null): ParsedApplicantContent {
  if (!content || typeof content !== "string") {
    return { name: null, gender: null, ageRaw: null, age: null, location: null, introduction: null };
  }

  // 슬래시 기준 분리 + 좌우 공백 제거
  const parts = content.split("/").map(s => s.trim());

  const [name, gender, ageRaw, location, introduction] = [
    parts[0] ?? null,
    parts[1] ?? null,
    parts[2] ?? null,
    parts[3] ?? null,
    // 자기소개에 슬래시가 더 있을 수 있으니 나머지를 다시 합침
    parts.length > 5 ? parts.slice(4).join(" / ") : (parts[4] ?? null),
  ];

  // "56세" → 56 같은 숫자 추출 시도
  let age: number | null = null;
  if (ageRaw) {
    const m = ageRaw.match(/\d+/);
    if (m) age = Number(m[0]);
  }

  return { name, gender, ageRaw, age: Number.isFinite(age) ? age : null, location, introduction };
}
