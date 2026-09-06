/** Prefix local media paths for GitHub project Pages; leave external URLs unchanged. */
export function assetPath(src: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return src.startsWith('/') && !src.startsWith('//') ? basePath + src : src;
}
