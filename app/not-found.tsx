import { SiteShell, BackHome } from '@/components/site-chrome';
export default function NotFound() {
  return (
    <SiteShell>
      <div className="not-found">
        <p className="overline">RECORD NOT FOUND / 404</p>
        <h1>아직 없는 장면입니다.</h1>
        <p>주소를 확인하거나 첫 플레이 과정으로 돌아가세요.</p>
        <BackHome />
      </div>
    </SiteShell>
  );
}
