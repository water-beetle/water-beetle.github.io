import { args, publishDraft } from './devlog-tools.mjs';
try {
  const options = args(process.argv.slice(2));
  console.log('로컬 공개 데이터 갱신:', await publishDraft(options));
  console.log('검토 후 정적 빌드하세요. Git push·배포는 실행하지 않았습니다.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
