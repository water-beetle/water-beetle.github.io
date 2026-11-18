export const chapterIds = [
  'home',
  'meteor',
  'mining',
  'bench',
  'research',
  'drone',
] as const;
export type ChapterId = (typeof chapterIds)[number];
export function isChapterId(value: unknown): value is ChapterId {
  return (
    typeof value === 'string' &&
    (chapterIds as readonly string[]).includes(value)
  );
}
