import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cli = join(dirname(fileURLToPath(import.meta.resolve('vinext'))), 'cli.js');
// This repository is a user site: water-beetle.github.io, served at the domain root.
if (process.argv.length > 2 || process.env.NEXT_PUBLIC_BASE_PATH) {
  throw new Error('This blog is configured for the root address water-beetle.github.io; do not set a repository subpath.');
}
const result = spawnSync(process.execPath, [cli, 'build'], {
  cwd: project,
  stdio: 'inherit',
  env: { ...process.env, GITHUB_PAGES: 'true', NEXT_PUBLIC_BASE_PATH: '' },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
const output = join(project, 'dist', 'client');
if (!existsSync(join(output, 'index.html'))) throw new Error('Static export is missing dist/client/index.html.');
// Preserve vinext's flat HTML/RSC output and provide GitHub Pages directory
// indexes for the public /optimization/ and /optimization/slug/ URLs. Take a
// snapshot first so newly copied indexes are never traversed recursively.
const exportedHtml = readdirSync(output, { recursive: true }).filter(file =>
  typeof file === 'string' && file.endsWith('.html') && !['index.html', '404.html'].includes(file.split(/[\\/]/).at(-1)));
for (const file of exportedHtml) {
  const directory = join(output, file.slice(0, -'.html'.length));
  mkdirSync(directory, { recursive: true });
  copyFileSync(join(output, file), join(directory, 'index.html'));
}
writeFileSync(join(output, '.nojekyll'), '');
console.log('GitHub Pages files: ' + output);
