import { args, makeDraft } from './devlog-tools.mjs';
const options = args(process.argv.slice(2));
if (!options.source || !options.slug) {
  console.error(
    'npm run devlog:draft -- --source <Comet 검증 폴더> --slug <영문 이름> [--title 제목]',
  );
  process.exit(1);
}
try {
  console.log('로컬 검토용 초안:', await makeDraft(options));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
