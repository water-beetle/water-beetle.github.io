'use client';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { chapterFromHash, chapters, getChapter } from '@/lib/story';
import { isChapterId, type ChapterId } from '@/lib/story-types';
import {
  sceneFromHash,
  sceneHref,
  validScene,
  type SceneSelection,
} from '@/lib/world-navigation.mjs';
import {
  isReaderPath,
  isArchivePath,
  normalizePath,
  isReturnPoint,
  recordOrigin,
  resumePoint,
} from '@/lib/story-navigation.mjs';
export { isReaderPath } from '@/lib/story-navigation.mjs';
type Frames = Partial<Record<ChapterId, string>>;
type Archive = { filter: string; order: 'newest' | 'oldest'; selected: string };
type ReturnPoint = {
  path: string;
  y: number;
  focusHref?: string;
  focusLabel?: string;
  scopeId?: string;
  focusId?: string;
};
type StoryState = {
  scene: SceneSelection;
  visit: (value: SceneSelection) => void;
  restoreFocus: () => void;
  chapter: ChapterId;
  frames: Frames;
  archive: Archive;
  returnPoint: ReturnPoint | null;
  setChapter: (id: ChapterId) => void;
  setFrame: (id: ChapterId, frame: string) => void;
  setArchive: (value: Partial<Archive>) => void;
  captureReturn: (target: string, source?: HTMLAnchorElement) => void;
  closeRecord: (fallback?: ChapterId) => void;
  ready: boolean;
};
const KEY = 'orbital-scene-journal-v4';
const Context = createContext<StoryState | null>(null);
export const useStory = () => {
  const value = useContext(Context);
  if (!value) throw Error('Story provider is required');
  return value;
};
function returnFocus(point: ReturnPoint) {
  if (point.focusId) {
    const el = document.getElementById(point.focusId);
    if (
      el &&
      !el.closest('[inert]') &&
      getComputedStyle(el).visibility !== 'hidden' &&
      el.getBoundingClientRect().width > 2
    ) {
      el.focus({ preventScroll: true });
      if (document.activeElement === el) return true;
    }
  }
  if (!point.focusHref) return false;
  const scope = point.scopeId
    ? document.getElementById(point.scopeId)
    : document;
  const link = Array.from(
    (scope || document).querySelectorAll<HTMLAnchorElement>('a[href]'),
  ).find(
    (link) =>
      link.getAttribute('href') === point.focusHref &&
      link.textContent?.trim() === point.focusLabel &&
      !link.closest('[inert]') &&
      getComputedStyle(link).visibility !== 'hidden' &&
      link.getBoundingClientRect().width > 2 &&
      link.getBoundingClientRect().height > 2,
  );
  link?.focus({ preventScroll: true });
  return !!link && document.activeElement === link;
}
function currentPoint(path: string, source?: HTMLAnchorElement): ReturnPoint {
  const active = source || document.activeElement;
  return {
    path,
    y: window.scrollY,
    ...(active instanceof HTMLAnchorElement
      ? {
          focusHref: active.getAttribute('href') || undefined,
          focusLabel: active.textContent?.trim(),
          scopeId: active.closest('[id]')?.id,
          focusId: active.id || undefined,
        }
      : {}),
  };
}
export function StoryProvider({ children }: { children: ReactNode }) {
  const path = usePathname() || '/';
  const [chapter, setChapter] = useState<ChapterId>('home');
  const [scene, setScene] = useState<SceneSelection>({
    scene: 'clearing',
    shot: 'arrival',
  });
  const focusPoint = useRef<ReturnPoint | null>(null);
  const [frames, setFrames] = useState<Frames>({});
  const [archive, setArchiveState] = useState<Archive>({
    filter: '전체',
    order: 'newest',
    selected: '',
  });
  const [returnPoint, setReturnPoint] = useState<ReturnPoint | null>(null);
  const [ready, setReady] = useState(false);
  const homePoint = useRef<ReturnPoint | null>(null);
  const origins = useRef<Record<string, ReturnPoint>>({});
  const resume = useRef<ReturnPoint | null>(null);
  // GitHub Pages returns HTML for RSC headers; native links load its exported
  // documents reliably. Session state keeps the scene and reading origin intact.
  useEffect(() => {
    let data: any = {};
    try {
      data = JSON.parse(sessionStorage.getItem(KEY) || '{}') || {};
    } catch {}
    if (isChapterId(data.chapter)) setChapter(data.chapter);
    const selected =
      sceneFromHash(location.hash) ||
      (validScene(data.scene)
        ? data.scene
        : { scene: 'clearing', shot: 'arrival' });
    setScene(selected);
    if (data.frames && typeof data.frames === 'object') {
      const valid: Frames = {};
      for (const c of chapters)
        if (c.frames.some((f) => f.id === data.frames[c.id]))
          valid[c.id] = data.frames[c.id];
      setFrames(valid);
    }
    if (
      data.archive &&
      typeof data.archive.filter === 'string' &&
      (data.archive.order === 'newest' || data.archive.order === 'oldest')
    )
      setArchiveState({
        filter: data.archive.filter,
        order: data.archive.order,
        selected:
          typeof data.archive.selected === 'string'
            ? data.archive.selected
            : '',
      });
    if (isReturnPoint(data.homePoint))
      homePoint.current = data.homePoint as ReturnPoint;
    if (data.origins && typeof data.origins === 'object')
      for (const [key, point] of Object.entries(data.origins))
        if (isReaderPath(key) && isReturnPoint(point))
          origins.current[key] = point as ReturnPoint;
    setReturnPoint(recordOrigin(data, path) as ReturnPoint | null);
    const hash = chapterFromHash(location.hash);
    if (hash) setChapter(hash);
    const point = resumePoint(data, path, location.hash) as ReturnPoint | null;
    focusPoint.current = point;
    delete data.resume;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(data));
    } catch {}
    let frame = 0;
    if (point) {
      frame = requestAnimationFrame(() => {
        window.scrollTo({ top: point.y, behavior: 'instant' });
        returnFocus(point);
        setReady(true);
      });
    } else setReady(true);
    return () => cancelAnimationFrame(frame);
  }, []);
  const persist = () => {
    try {
      sessionStorage.setItem(
        KEY,
        JSON.stringify({
          chapter,
          scene,
          frames,
          archive,
          homePoint: homePoint.current,
          origins: origins.current,
          resume: resume.current,
        }),
      );
    } catch {}
  };
  useEffect(() => {
    if (ready) persist();
  }, [chapter, frames, archive, scene, ready]);
  useEffect(() => {
    if (!ready || path !== '/') return;
    if (!location.hash || !sceneFromHash(location.hash))
      history.replaceState(null, '', sceneHref(scene));
    const follow = () => {
      setScene(
        sceneFromHash(location.hash) || { scene: 'clearing', shot: 'arrival' },
      );
      focusPoint.current = null;
      requestAnimationFrame(() =>
        document
          .getElementById('place-heading')
          ?.focus({ preventScroll: true }),
      );
    };
    window.addEventListener('hashchange', follow);
    window.addEventListener('popstate', follow);
    return () => {
      window.removeEventListener('hashchange', follow);
      window.removeEventListener('popstate', follow);
    };
  }, [ready, path]);
  const captureReturn = (target: string, source?: HTMLAnchorElement) => {
    if (target.startsWith('/#')) {
      resume.current = null;
      persist();
      return;
    }
    let point = returnPoint;
    if (path === '/') {
      point = currentPoint('/', source);
      homePoint.current = point;
    } else if (isArchivePath(path)) point = currentPoint(path, source);
    if (point && isReaderPath(target))
      origins.current[normalizePath(target)] = point;
    persist();
  };
  const closeRecord = (fallback?: ChapterId) => {
    const point = isArchivePath(path) ? homePoint.current : returnPoint;
    resume.current = point;
    persist();
    window.location.assign(
      point ? point.path : '/#step-' + (fallback || chapter),
    );
  };
  const state: StoryState = {
    scene,
    visit: (value) => {
      if (!validScene(value)) return;
      if (scene.scene === value.scene && scene.shot === value.shot) return;
      history.pushState(null, '', sceneHref(value));
      setScene(value);
      focusPoint.current = null;
      requestAnimationFrame(() =>
        document
          .getElementById('place-heading')
          ?.focus({ preventScroll: true }),
      );
    },
    restoreFocus: () => {
      if (focusPoint.current && returnFocus(focusPoint.current)) {
        focusPoint.current = null;
      }
    },
    chapter,
    frames,
    archive,
    ready,
    returnPoint,
    setChapter,
    setFrame: (id, frame) => {
      if (getChapter(id).frames.some((f) => f.id === frame))
        setFrames((v) => ({ ...v, [id]: frame }));
    },
    setArchive: (value) => setArchiveState((v) => ({ ...v, ...value })),
    captureReturn,
    closeRecord,
  };
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export function StoryLink({
  href,
  children,
  onClick,
  ...props
}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
}) {
  const story = useStory();
  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (
          !event.defaultPrevented &&
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.altKey &&
          !event.shiftKey &&
          (isReaderPath(href) || isArchivePath(href) || href.startsWith('/#'))
        )
          story.captureReturn(href, event.currentTarget);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
