'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Expand,
  MapPin,
  Plus,
  RotateCw,
  X,
} from 'lucide-react';
import { Lightbox } from '@astryxdesign/core/Lightbox';
import {
  arrival,
  worldScene,
  worldScenes,
  worldShot,
  type WorldPhoto,
  type WorldTarget,
} from '@/lib/world';
import {
  coverPoint,
  sceneHref,
  type SceneSelection,
} from '@/lib/world-navigation.mjs';
import { StoryLink, useStory } from './story-context';

export function PlaceLink({
  to,
  children,
  onClick,
  ...props
}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: SceneSelection;
}) {
  const story = useStory();
  return (
    <a
      {...props}
      href={sceneHref(to)}
      onClick={(event) => {
        onClick?.(event);
        if (
          !event.defaultPrevented &&
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        ) {
          event.preventDefault();
          story.visit(to);
        }
      }}
    >
      {children}
    </a>
  );
}

function usePortrait() {
  const [portrait, setPortrait] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(max-width:700px)');
    const update = () => setPortrait(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return portrait;
}

const NO_TARGETS: WorldTarget[] = [];
function WorldImage({
  photo,
  targets = NO_TARGETS,
  onReady,
  onPoint,
  onFailure,
}: {
  photo: WorldPhoto;
  targets?: WorldTarget[];
  onReady?: () => void;
  onPoint?: (points: { id: string; x: number; y: number }[]) => void;
  onFailure?: (value: boolean) => void;
}) {
  const viewport = useRef<HTMLDivElement>(null),
    image = useRef<HTMLImageElement>(null);
  const portrait = usePortrait(),
    reduced = useReducedMotion();
  const desired = portrait && photo.portrait ? photo.portrait : photo.src;
  const [shown, setShown] = useState(desired),
    [waiting, setWaiting] = useState(true),
    [failed, setFailed] = useState(false),
    [retry, setRetry] = useState(0);
  const desiredRef = useRef(desired);
  desiredRef.current = desired;
  const position = () => {
    if (!targets.length) return;
    const img = image.current,
      box = viewport.current;
    if (!img?.naturalWidth || !box) return;
    const bounds = box.getBoundingClientRect();
    onPoint?.(
      targets.map((t) => ({
        id: t.id,
        ...coverPoint(
          portrait && t.mobile ? t.mobile : t,
          { width: img.naturalWidth, height: img.naturalHeight },
          { width: bounds.width, height: bounds.height },
        ),
      })),
    );
  };
  useEffect(() => {
    let cancelled = false;
    setWaiting(true);
    setFailed(false);
    onFailure?.(false);
    const next = new Image();
    next.src = desired;
    const finish = () => {
      if (!cancelled) {
        setShown(desired);
        setWaiting(false);
        setFailed(false);
      }
    };
    next.onload = () => {
      if (next.decode) next.decode().then(finish, finish);
      else finish();
    };
    next.onerror = () => {
      if (!cancelled) {
        setWaiting(false);
        setFailed(true);
        onFailure?.(true);
      }
    };
    // Handle already cached photos without relying on the load event timing.
    if (next.complete && next.naturalWidth) finish();
    return () => {
      cancelled = true;
      next.onload = null;
      next.onerror = null;
    };
  }, [desired, retry]);
  useEffect(() => {
    const observer = new ResizeObserver(position);
    if (viewport.current) observer.observe(viewport.current);
    return () => observer.disconnect();
  }, [shown, targets, portrait]);
  useEffect(() => {
    if (!waiting && !failed && shown === desired) {
      position();
      onReady?.();
    }
  }, [shown, waiting, failed, desired, portrait]);
  return (
    <div className="world-media" ref={viewport} aria-busy={waiting}>
      <motion.img
        ref={image}
        key={shown + ':' + retry}
        src={shown}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        fetchPriority="high"
        draggable={false}
        initial={{ opacity: reduced ? 1 : 0.7, scale: reduced ? 1 : 1.025 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        onLoad={() => {
          position();
          if (shown === desiredRef.current) onReady?.();
        }}
        onError={() => {
          setFailed(true);
          setWaiting(false);
          onFailure?.(true);
        }}
      />
      {(waiting || failed) && (
        <div className="world-image-status" role="status">
          {failed ? (
            <>
              <span>장면을 불러오지 못했습니다.</span>
              <button onClick={() => setRetry((n) => n + 1)}>
                <RotateCw size={15} /> 다시 불러오기
              </button>
              <a href={desired} target="_blank" rel="noopener noreferrer">
                사진 열기 ↗
              </a>
            </>
          ) : (
            <span>다음 장소를 불러오는 중…</span>
          )}
        </div>
      )}
    </div>
  );
}

export function WorldBackdrop() {
  const story = useStory();
  const photo = worldShot(story.scene).photo;
  return (
    <aside className="world-backdrop" aria-hidden="true" inert>
      <img src={photo.src} alt="" />
      <div />
    </aside>
  );
}

export function WorldExplorer() {
  const story = useStory();
  const scene = worldScene(story.scene.scene),
    shot = worldShot(story.scene);
  const index = scene.shots.indexOf(shot),
    hub = scene.id === 'clearing';
  const [displayed, setDisplayed] = useState(''),
    [points, setPoints] = useState<{ id: string; x: number; y: number }[]>([]),
    [open, setOpen] = useState(false),
    [failed, setFailed] = useState(false);
  const key = scene.id + ':' + shot.id;
  const ready = displayed === key && !failed;
  const next =
    index < scene.shots.length - 1
      ? {
          label: scene.shots[index + 1].name,
          to: { scene: scene.id, shot: scene.shots[index + 1].id },
        }
      : scene.next;
  useEffect(() => {
    const neighbors = [
      scene.shots[index + 1]?.photo,
      ...(shot.targets || [])
        .filter((t) => t.to)
        .map((t) => worldShot(t.to!).photo),
    ]
      .filter(Boolean)
      .slice(0, 3);
    neighbors.forEach((p) => {
      const img = new Image();
      img.src =
        (matchMedia('(max-width:700px)').matches && p!.portrait) || p!.src;
    });
  }, [key]);
  const onReady = () => {
    setDisplayed(key);
    requestAnimationFrame(story.restoreFocus);
  };
  return (
    <section
      className={
        'world-explorer ' +
        (hub ? 'at-arrival' : 'at-place') +
        ((shot.targets?.length || 0) > 0 ? ' has-targets' : ' is-process')
      }
      id="scene-viewer"
      aria-label="실제 게임 장면 탐색"
      data-world-scene={scene.id}
    >
      <WorldImage
        photo={shot.photo}
        targets={shot.targets}
        onReady={onReady}
        onPoint={setPoints}
        onFailure={setFailed}
      />
      <div className="world-shade" aria-hidden="true" />
      <div className="world-heading" key={scene.id}>
        <p className="world-coordinate">
          <span className="world-coordinate-dot" /> {scene.english}
        </p>
        <h2 id="place-heading" tabIndex={-1}>
          {scene.title.split('\n').map((line, i) => (
            <span key={line}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h2>
        <p className="world-intro">{scene.intro}</p>
      </div>
      {shot.targets?.map((target) => {
        const point = points.find((p) => p.id === target.id);
        const style = {
          left: point?.x ?? 0,
          top: point?.y ?? 0,
        } as CSSProperties;
        const classes =
          'world-spot ' +
          (target.labelPosition
            ? 'label-' + target.labelPosition
            : target.x > 73
              ? 'label-left'
              : '') +
          (!ready || !point ? ' awaiting-photo' : '');
        const body = (
          <>
            <span className="spot-reticle" aria-hidden="true">
              <Plus size={15} />
            </span>
            <span className="spot-leader" aria-hidden="true" />
            <span className="spot-copy">
              <strong>{target.label}</strong>
              <span>
                {target.hint} <ArrowUpRight size={12} />
              </span>
            </span>
          </>
        );
        return target.to ? (
          <PlaceLink
            key={target.id}
            id={target.id}
            to={target.to}
            className={classes}
            style={style}
            tabIndex={ready ? 0 : -1}
            aria-hidden={!ready}
          >
            {body}
          </PlaceLink>
        ) : (
          <StoryLink
            key={target.id}
            id={target.id}
            href={target.href!}
            className={classes}
            style={style}
            tabIndex={ready ? 0 : -1}
            aria-hidden={!ready}
          >
            {body}
          </StoryLink>
        );
      })}
      <div className="world-caption" key={key}>
        <p className="world-shot-name">
          <span>{String(index + 1).padStart(2, '0')}</span> {shot.name}
        </p>
        <p>{shot.note}</p>
        {!hub && (
          <StoryLink
            id="scene-record-link"
            className="world-record"
            href={scene.record}
          >
            {scene.recordLabel}
            <ArrowUpRight size={14} />
          </StoryLink>
        )}
        {scene.id === 'home' && (
          <PlaceLink
            to={{ scene: 'computer', shot: 'desk' }}
            className="world-record home-computer-link"
          >
            집 안 컴퓨터로
            <ArrowRight size={14} />
          </PlaceLink>
        )}
      </div>
      <div className="world-bottom">
        <div className="world-location">
          {!hub ? (
            <PlaceLink
              to={
                index > 0
                  ? { scene: scene.id, shot: scene.shots[index - 1].id }
                  : scene.parent
              }
              className="world-back"
            >
              <ArrowLeft size={17} />
              <span>{index > 0 ? '앞 장면' : '돌아가기'}</span>
            </PlaceLink>
          ) : (
            <span className="world-explore-hint">
              <MapPin size={15} /> 이름을 눌러 탐색
            </span>
          )}
          <span className="location-divider" />
          <details className="place-picker">
            <summary>
              {scene.name}
              <span>⌃</span>
            </summary>
            <nav aria-label="장소 바로 가기">
              {worldScenes.map((s) => (
                <PlaceLink
                  key={s.id}
                  to={{ scene: s.id, shot: s.shots[0].id }}
                  onClick={(e) =>
                    e.currentTarget.closest('details')?.removeAttribute('open')
                  }
                  aria-current={s.id === scene.id ? 'location' : undefined}
                >
                  {s.name}
                  <ArrowUpRight size={13} />
                </PlaceLink>
              ))}
            </nav>
          </details>
        </div>
        {next && (
          <PlaceLink to={next.to} className="world-next">
            <span>{next.label}</span>
            <ArrowRight size={18} />
          </PlaceLink>
        )}
        <button
          className="world-expand"
          aria-label="실제 게임 사진 크게 보기"
          onClick={() => setOpen(true)}
        >
          <Expand size={17} />
        </button>
      </div>
      <span className="world-source">ACTUAL GAME CAPTURE · 개발 중인 화면</span>
      <Lightbox
        isOpen={open}
        onOpenChange={setOpen}
        media={[
          {
            src: shot.photo.src,
            alt: shot.photo.alt,
            caption: shot.photo.caption,
          },
        ]}
        index={0}
        hasZoom
        aria-label="실제 게임 사진 크게 보기"
      />
    </section>
  );
}
