import { spawnSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
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
writeFileSync(join(output, '.nojekyll'), '');
console.log('GitHub Pages files: ' + output);
