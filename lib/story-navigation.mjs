export const normalizePath = (path) =>
  path.split(/[?#]/)[0].replace(/\/$/, '') || '/';
export const isReaderPath = (path) =>
  /^\/(?:updates|features)\/[^/]+\/?$/.test(path);
export const isArchivePath = (path) => normalizePath(path) === '/updates';
export function isReturnPoint(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.path === 'string' &&
    (value.path === '/' || /^\/updates\/?$/.test(value.path)) &&
    Number.isFinite(value.y) &&
    value.y >= 0 &&
    value.y <= 10000000
  );
}
export function recordOrigin(data, path) {
  if (isArchivePath(path))
    return isReturnPoint(data?.homePoint) ? data.homePoint : null;
  const point = data?.origins?.[normalizePath(path)];
  return isReaderPath(path) && isReturnPoint(point) ? point : null;
}
export function resumePoint(data, path, hash) {
  const point = data?.resume;
  return !hash &&
    isReturnPoint(point) &&
    normalizePath(point.path) === normalizePath(path)
    ? point
    : null;
}
