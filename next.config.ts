import type { NextConfig } from 'next';

const githubPages = process.env.GITHUB_PAGES === 'true';
const basePath = githubPages ? process.env.NEXT_PUBLIC_BASE_PATH || '' : '';
if (basePath && !/^\/[a-zA-Z0-9._-]+$/.test(basePath)) {
  throw new Error('The Pages base path must be empty or a single repository path, e.g. /orbital-days.');
}
const nextConfig: NextConfig = {
  // vinext beta.5's prerender requests omit trailing slashes and fail on their
  // own 308 redirects. build-pages.mjs adds directory indexes after export.
  ...(githubPages ? { output: 'export', trailingSlash: false, basePath, images: { unoptimized: true } } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
export default nextConfig;
