'use client';
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { chapterFromHash, chapters, getChapter } from '@/lib/story';
import { isChapterId, type ChapterId } from '@/lib/story-types';
type Frames = Partial<Record<ChapterId, string>>;
type Archive = { filter: string; order: 'newest' | 'oldest'; selected: string };
type ReturnPoint = { path: string; y: number; focusHref?:string;focusLabel?:string;scopeId?:string };
const KEY = 'orbital-play-story-v3';
const normalize = (path: string) =>
  path.split(/[?#]/)[0].replace(/\/$/, '') || '/';
export const isReaderPath = (path: string) =>
  /^\/(?:updates|features)\/[^/]+\/?$/.test(path);
const isArchive = (path: string) => normalize(path) === '/updates';
type StoryState = {
  chapter: ChapterId;
  frames: Frames;
  archive: Archive;
  returnPoint: ReturnPoint | null;
  setChapter: (id: ChapterId) => void;
  setFrame: (id: ChapterId, frame: string) => void;
  setArchive: (value: Partial<Archive>) => void;
  captureReturn: (target: string) => void;
  closeRecord: (fallback?: ChapterId) => void;
  ready: boolean;
};
const Context = createContext<StoryState | null>(null);
export const useStory = () => {
  const value = useContext(Context);
  if (!value) throw Error('Story provider is required');
  return value;
};
function scrollHash() {
  try {
    const element = document.getElementById(
      decodeURIComponent(location.hash.slice(1)),
    );
    if (element) {
      element.scrollIntoView({ behavior: 'instant' });
      return true;
    }
  } catch {}
  return false;
}
function returnFocus(point:ReturnPoint){if(!point.focusHref)return;const scope=point.scopeId?document.getElementById(point.scopeId):document;const link=Array.from((scope||document).querySelectorAll<HTMLAnchorElement>('a[href]')).find(link=>link.getAttribute('href')===point.focusHref&&link.textContent?.trim()===point.focusLabel&&!link.closest('[inert]')&&link.getBoundingClientRect().width>2&&link.getBoundingClientRect().height>2);link?.focus({preventScroll:true})}
function currentPoint(path:string):ReturnPoint{const active=document.activeElement;return{path,y:window.scrollY,...(active instanceof HTMLAnchorElement?{focusHref:active.getAttribute('href')||undefined,focusLabel:active.textContent?.trim(),scopeId:active.closest('[id]')?.id}:{})}}
export function StoryProvider({ children }: { children: ReactNode }) {
  const path = usePathname() || '/';
  const router = useRouter();
  const [chapter, setChapter] = useState<ChapterId>('home');
  const [frames, setFrames] = useState<Frames>({});
  const [archive, setArchiveState] = useState<Archive>({
    filter: '전체',
    order: 'newest',
    selected: '',
  });
  const [returnPoint, setReturnPoint] = useState<ReturnPoint | null>(null);
  const [ready, setReady] = useState(false);
  const previous = useRef(path);
  const restore = useRef<ReturnPoint | null>(null);
  const homePoint = useRef<ReturnPoint | null>(null);
  const explicitHomeHash=useRef(false);
  const origins = useRef(new Map<string, ReturnPoint>());
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (isChapterId(data.chapter)) setChapter(data.chapter);
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
      }
    } catch {}
    const hash = chapterFromHash(location.hash);
    if (hash) setChapter(hash);
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ chapter, frames, archive }));
    } catch {}
  }, [chapter, frames, archive, ready]);
  useLayoutEffect(() => {
    if (previous.current === path) return;
    const prev = previous.current;
    previous.current = path;
    let frame = 0;
    if (path === '/') {
      const point = restore.current || homePoint.current;
      if (point&&(isReaderPath(prev)||isArchive(prev))&&!explicitHomeHash.current) {
        window.scrollTo({top:point.y,behavior:'instant'});
        frame=requestAnimationFrame(()=>{window.scrollTo({top:point.y,behavior:'instant'});returnFocus(point)});
      } else if (location.hash) {
        const id = chapterFromHash(location.hash);
        if (id) setChapter(id);
        scrollHash();
        frame = requestAnimationFrame(scrollHash);
      } else if (point) {
        window.scrollTo({ top: point.y, behavior: 'instant' });
        frame = requestAnimationFrame(() =>
          {window.scrollTo({ top: point.y, behavior: 'instant' });returnFocus(point)},
        );
      }
      restore.current = null;
      explicitHomeHash.current=false;
      setReturnPoint(null);
    } else if (isArchive(path)) {
      const point =
        restore.current || (isReaderPath(prev) ? returnPoint : null);
      if (point && normalize(point.path) === normalize(path)) {
        window.scrollTo({ top: point.y, behavior: 'instant' });
        frame = requestAnimationFrame(() =>
          {window.scrollTo({ top: point.y, behavior: 'instant' });returnFocus(point)},
        );
      }
      restore.current = null;
      setReturnPoint(homePoint.current);
    } else {
      setReturnPoint(origins.current.get(normalize(path)) || null);
      frame = requestAnimationFrame(() => {
        const heading =
          document.querySelector<HTMLElement>('.reader-content h1');
        if (heading) {
          heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        }
      });
    }
    return () => cancelAnimationFrame(frame);
  }, [path]);
  const captureReturn = (target: string) => {
    if(target.startsWith('/#')){explicitHomeHash.current=path!=='/';return}
    let point = returnPoint;
    if (path === '/') {
      point = currentPoint('/');
      homePoint.current = point;
    } else if (isArchive(path)) point = currentPoint(path);
    if (point && isReaderPath(target))
      origins.current.set(normalize(target), point);
    if (point) setReturnPoint(point);
  };
  const closeRecord = (fallback?: ChapterId) => {
    const point = isArchive(path) ? homePoint.current : returnPoint;
    if (point) {
      restore.current = point;
      router.push(point.path, { scroll: false });
    } else router.replace('/#step-' + (fallback || chapter), { scroll: false });
  };
  const state: StoryState = {
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
    <Link
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
          (isReaderPath(href) || isArchive(href) || href.startsWith('/#'))
        )
          story.captureReturn(href);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
