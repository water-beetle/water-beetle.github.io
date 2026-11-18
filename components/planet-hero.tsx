'use client';
import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
const Scene = lazy(() => import('./planet-scene'));
class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function PlanetHero() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReduced(media.matches);
      setEnabled(
        !media.matches &&
          innerWidth >= 768 &&
          'WebGL2RenderingContext' in window,
      );
    };
    update();
    media.addEventListener('change', update);
    const io = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (ref.current) io.observe(ref.current);
    const hide = () => setHidden(document.hidden);
    hide();
    document.addEventListener('visibilitychange', hide);
    return () => {
      media.removeEventListener('change', update);
      io.disconnect();
      document.removeEventListener('visibilitychange', hide);
    };
  }, []);
  return (
    <div className="planet-stage" ref={ref}>
      <img
        className="planet-poster"
        src="/images/orbital-planet.svg"
        alt=""
        width={660}
        height={660}
        aria-hidden="true"
      />
      {enabled && !failed && (
        <SceneBoundary onError={() => setFailed(true)}>
          <Suspense fallback={null}>
            <Scene active={visible && !hidden} />
          </Suspense>
        </SceneBoundary>
      )}
      <div className="orbit-ring" />
      <span className="orbital-coordinates" aria-hidden="true">
        ILLUSTRATED HOME WORLD
        <br />A NEW BEGINNING
      </span>
      <a className="planet-marker marker-home" href="#step-home">
        <span />
        01<span>집에서 시작</span>
      </a>
      <a className="planet-marker marker-mining" href="#step-mining">
        <span />
        02<span>첫 운석 채굴</span>
      </a>
      <a className="planet-marker marker-bench" href="#step-bench">
        <span />
        03<span>첫 제작대</span>
      </a>
      <div className="planet-hint">
        {!enabled && !failed && !reduced ? (
          <button onClick={() => setEnabled(true)}>3D 행성 켜기 ↗</button>
        ) : enabled && !failed ? (
          <span>드래그해서 행성을 돌려보세요</span>
        ) : (
          <span>작은 행성에서 시작되는 이야기</span>
        )}
      </div>
    </div>
  );
}
