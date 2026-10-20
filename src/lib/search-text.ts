/**
 * Chuẩn hóa không dấu cho tìm kiếm: "lập trình" → "lap trinh", "Đường" → "duong".
 * Mỗi ký tự được chuẩn hóa riêng và giữ nguyên độ dài, nên vị trí trong chuỗi đã
 * chuẩn hóa dùng được để tô đậm trực tiếp trên chuỗi gốc (đã NFC).
 */
function foldChar(char: string): string {
  if (char === "đ" || char === "Đ") return "d";
  const folded = char.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  return folded.length === char.length ? folded : char;
}

export function foldText(text: string): string {
  let result = "";
  for (const char of text.normalize("NFC")) result += foldChar(char);
  return result;
}
