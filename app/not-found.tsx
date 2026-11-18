import { SiteShell } from '@/components/site-chrome';
export default function NotFound() {
  return (
    <SiteShell>
      <section className="section updates-page">
        <p className="eyebrow">SIGNAL NOT FOUND · 404</p>
        <h1>잠시 궤도를 벗어났네요.</h1>
        <p className="page-description">
          이 주소에는 기록이 없습니다.
          <br />
          새로운 플레이 과정과 개발 기록에서 이야기를 이어보세요.
        </p>
        <p style={{ marginTop: 32 }}>
          <a className="text-link" href="/">
            처음으로 돌아가기 ↗
          </a>
        </p>
      </section>
    </SiteShell>
  );
}
