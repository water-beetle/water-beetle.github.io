import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, join, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../dist/client', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.json': 'application/json',
  '.rsc': 'text/x-component',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};
await stat(join(root, 'index.html')).catch(() => {
  throw Error('먼저 npm run build:pages를 실행하세요.');
});
http
  .createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, 'http://localhost').pathname,
      );
      let path = resolve(join(root, pathname));
      if (path !== root && !path.startsWith(root + sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      try {
        if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
      } catch {
        path = join(root, '404.html');
        res.statusCode = 404;
      }
      res.setHeader(
        'Content-Type',
        types[extname(path)] || 'application/octet-stream',
      );
      res.setHeader('Cache-Control', 'no-store');
      res.end(await readFile(path));
    } catch {
      res.writeHead(500);
      res.end('Preview unavailable');
    }
  })
  .listen(port, '127.0.0.1', () =>
    console.log(`ORBITAL FALL preview: http://127.0.0.1:${port}`),
  );
