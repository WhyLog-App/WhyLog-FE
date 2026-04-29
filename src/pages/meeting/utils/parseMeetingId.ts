export const parseMeetingId = (raw: string | undefined): number | null => {
  if (!raw || !/^\d+$/.test(raw)) return null;
  const num = Number(raw);
  if (!Number.isSafeInteger(num) || num <= 0) return null;
  return num;
};
