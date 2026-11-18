'use client';
import { useEffect, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Expand,
  Plus,
  ArrowUpRight,
  RotateCw,
  Mouse,
  ChevronDown,
} from 'lucide-react';
import { Lightbox } from '@astryxdesign/core/Lightbox';
import { chapters, frameFor, getChapter, type StoryChapter } from '@/lib/story';
import { media, devlogs, updateHref, type MediaKey } from '@/lib/devlogs';
import { features, type FeatureMedia } from '@/lib/features';
import { usePathname } from 'next/navigation';
import { StoryLink, useStory } from './story-context';
export function SceneImage({
  mediaKey,
  photo,
  eager = false,
  onDisplayed,
  children,
}: {
  mediaKey?: MediaKey;
  photo?: FeatureMedia;
  eager?: boolean;
  onDisplayed?: (src: string) => void;
  children?: React.ReactNode;
}) {
  const expected = photo || media[mediaKey!];
  const [shown, setShown] = useState(expected);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (expected.src === shown.src && !retry) {
      onDisplayed?.(shown.src);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    const image = new window.Image();
    image.src = expected.src;
    const finish = () => {
      if (!cancelled) {
        setShown(expected);
        setLoading(false);
        setFailed(false);
        onDisplayed?.(expected.src);
      }
    };
    image.onload = () => {
      if (image.decode) image.decode().then(finish, finish);
      else finish();
    };
    image.onerror = () => {
      if (!cancelled) {
        setLoading(false);
        setFailed(true);
      }
    };
    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [expected.src, retry]);
  return (
    <div
      className="scene-image"
      style={
        {
          aspectRatio: `${shown.width}/${shown.height}`,
          '--shot-ratio': shown.width / shown.height,
        } as CSSProperties
      }
      aria-busy={loading}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={shown.src + ':' + retry}
          src={shown.src}
          alt={shown.alt}
          width={shown.width}
          height={shown.height}
          fetchPriority={eager ? 'high' : 'auto'}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => {setLoading(false);setFailed(true)}}
          onLoad={() => {if(shown.src===expected.src){setLoading(false);setFailed(false);onDisplayed?.(shown.src)}}}
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: reduced ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.32 }}
        />
      </AnimatePresence>
      {!loading && !failed && shown.src === expected.src && children}
      {loading && (
        <span className="image-status" role="status">
          다음 장면을 불러오는 중
        </span>
      )}
      {failed && (
        <div className="image-status image-error" role="status">
          <span>이미지를 불러오지 못했습니다.{shown.src!==expected.src?' 이전 장면을 유지합니다.':''}</span>
          <button onClick={() => setRetry((v) => v + 1)}>
            <RotateCw size={14} />
            다시 시도
          </button>
          <a href={expected.src} target="_blank" rel="noopener noreferrer">
            원본 열기 ↗
          </a>
        </div>
      )}
    </div>
  );
}
export function StoryStage() {
  const path = usePathname() || '/';
  const home = path === '/';
  const story = useStory();
  const chapter = getChapter(story.chapter);
  const selected = frameFor(chapter.id, story.frames);
  const [notes, setNotes] = useState(true);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const articleSlug = path.match(/^\/updates\/([^/]+)/)?.[1];
  const featureSlug = path.match(/^\/features\/([^/]+)/)?.[1];
  // Direct links use the record's own capture; in-site reading retains its starting scene.
  const feature = features.find((f) => f.slug === featureSlug);
  const recordCover = feature?.media[feature.cover];
  const record = devlogs.find((entry) => entry.slug === articleSlug);
  const key =
    home || story.returnPoint
      ? selected.media
      : record?.cover || selected.media;
  const photo = recordCover && !story.returnPoint ? recordCover : media[key];
  const [displayedPhoto,setDisplayedPhoto]=useState<FeatureMedia>(photo);
  useEffect(() => {
    if (!home) return;
    const index = chapters.findIndex((c) => c.id === chapter.id);
    const next = chapters[index + 1];
    if (!next) return;
    const image = new window.Image();
    image.src = media[next.frames[0].media].src;
    return () => {
      image.onload = null;
    };
  }, [chapter.id, home]);
  return (
    <aside
      id="scene-viewer"
      className={home ? 'story-stage' : 'story-stage is-background'}
      aria-hidden={!home}
      inert={!home}
      aria-label="실제 플레이 장면"
    >
      <div
        className="scene-wash"
        style={{ backgroundImage: `url("${photo.src}")` }}
      />
      <div className="scene-viewport">
        <div className="scene-head">
          <span>
            <i /> IN-GAME CAPTURE
          </span>
          <span>ORBITAL FALL / PLAY JOURNAL</span>
          <span>{chapter.number} — 06</span>
        </div>
        <figure className="scene-figure">
          <div className="scene-screen">
            <SceneImage
              mediaKey={key}
              photo={
                recordCover && !story.returnPoint ? recordCover : undefined
              }
              eager={chapter.id === 'home'}
              onDisplayed={src=>setDisplayedPhoto(Object.values(media).find(item=>item.src===src)||(recordCover?.src===src?recordCover:photo))}
            >
              {home && notes && selected.hotspot && (
                <button
                  className="scene-hotspot"
                  style={{
                    left: selected.hotspot.x + '%',
                    top: selected.hotspot.y + '%',
                  }}
                  onClick={() =>
                    story.setFrame(chapter.id, selected.hotspot!.target)
                  }
                  aria-label={selected.hotspot.label}
                >
                  <Plus size={17} />
                  <span>{selected.hotspot.label}</span>
                </button>
              )}
            </SceneImage>
          </div>
          <figcaption className="scene-source">
            <span>{displayedPhoto.caption}</span>
            {home && (
              <div>
                <button onClick={() => setNotes(!notes)} aria-pressed={notes}>
                  주석 {notes ? '켜짐' : '꺼짐'}
                </button>
                <button onClick={() => setOpen(true)}>
                  <Expand size={13} />
                  원본 보기
                </button>
              </div>
            )}
          </figcaption>
        </figure>
        {home && (
          <>
            <div
              className="frame-strip"
              aria-label={chapter.short + ' 과정 화면'}
            >
              {chapter.frames.map((frame, i) => (
                <button
                  key={frame.id}
                  onClick={() => story.setFrame(chapter.id, frame.id)}
                  aria-pressed={frame.id === selected.id}
                  className={
                    frame.id === selected.id
                      ? 'frame-button selected'
                      : 'frame-button'
                  }
                >
                  <img
                    src={media[frame.media].thumbnail}
                    alt=""
                    width={100}
                    height={56}
                    loading="lazy"
                  />
                  <span>
                    <small>{String(i + 1).padStart(2, '0')}</small>
                    {frame.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="scene-caption">
              <div className="scene-title">
                <span className="chapter-number">{chapter.number}</span>
                <div>
                  <p className="overline">{chapter.eyebrow}</p>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={chapter.id}
                      className="chapter-title"
                      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: reduced ? 1 : 0, y: 0 }}
                      transition={{ duration: reduced ? 0 : 0.15 }}
                    >
                      {chapter.title}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
              <div className="scene-copy">
                <p aria-live="polite">{selected.note}</p>
                <span className="scene-fact">{chapter.fact}</span>
                <StoryLink
                  className="story-link"
                  href={updateHref(chapter.article)}
                >
                  이 장면의 개발 기록 <ArrowUpRight size={16} />
                </StoryLink>
              </div>
            </div>
            <p className="scroll-cue">
              <Mouse size={13} />
              <span>
                {chapter.id === 'home'
                  ? '스크롤해서 실제 진행을 따라가세요'
                  : '아래로 스크롤하면 다음 장면으로 이어집니다'}
              </span>
              <ChevronDown size={13} />
            </p>
          </>
        )}
      </div>
      {home && (
        <Lightbox
          isOpen={open}
          onOpenChange={setOpen}
          media={chapter.frames.map((f) => ({
            src: media[f.media].src,
            alt: media[f.media].alt,
            caption: media[f.media].caption,
          }))}
          index={chapter.frames.findIndex((f) => f.id === selected.id)}
          onIndexChange={(i) =>
            story.setFrame(chapter.id, chapter.frames[i].id)
          }
          hasZoom
          aria-label="실제 게임 화면 원본"
        />
      )}
    </aside>
  );
}
export function ChapterNav() {
  const story = useStory();
  return (
    <nav className="chapter-rail" aria-label="플레이 장면 바로 가기">
      <span className="rail-label">THE FIRST STEPS</span>
      <div>
        {chapters.map((c) => (
          <a
            href={'/#step-' + c.id}
            key={c.id}
            onClick={() => story.setChapter(c.id)}
            aria-current={story.chapter === c.id ? 'step' : undefined}
          >
            <span>{c.number}</span>
            {c.short}
            <i />
          </a>
        ))}
      </div>
      <span className="rail-total">
        {getChapter(story.chapter).number} / 06
      </span>
    </nav>
  );
}
export function MobileChapter({ chapter }: { chapter: StoryChapter }) {
  const story = useStory();
  const selected = frameFor(chapter.id, story.frames);
  const [open, setOpen] = useState(false);
  const select = (id: string) => {
    story.setChapter(chapter.id);
    story.setFrame(chapter.id, id);
  };
  return (
    <div className="mobile-chapter">
      <header>
        <span className="chapter-number">{chapter.number} / 06</span>
        <p className="overline">{chapter.eyebrow}</p>
        <h2>{chapter.title}</h2>
      </header>
      <figure>
        <SceneImage mediaKey={selected.media} eager={chapter.id === 'home'} />
        <figcaption>{media[selected.media].caption}</figcaption>
      </figure>
      <div className="frame-strip" aria-label={chapter.short + ' 과정 화면'}>
        {chapter.frames.map((frame) => (
          <button
            key={frame.id}
            className={
              selected.id === frame.id
                ? 'frame-button selected'
                : 'frame-button'
            }
            aria-pressed={selected.id === frame.id}
            onClick={() => select(frame.id)}
          >
            <img
              src={media[frame.media].thumbnail}
              width={100}
              height={56}
              alt=""
              loading="lazy"
            />
            <span>{frame.label}</span>
          </button>
        ))}
      </div>
      <button
        className="mobile-expand story-link"
        onClick={() => setOpen(true)}
      >
        <Expand size={13} />
        원본 크게 보기
      </button>
      <p className="mobile-description">{chapter.description}</p>
      <p className="mobile-fact">{chapter.fact}</p>
      <StoryLink className="story-link" href={updateHref(chapter.article)}>
        이 장면의 개발 기록 <ArrowUpRight size={15} />
      </StoryLink>
      <Lightbox
        isOpen={open}
        onOpenChange={setOpen}
        media={chapter.frames.map((f) => ({
          src: media[f.media].src,
          alt: media[f.media].alt,
          caption: media[f.media].caption,
        }))}
        index={chapter.frames.findIndex((f) => f.id === selected.id)}
        onIndexChange={(i) => select(chapter.frames[i].id)}
        hasZoom
        aria-label={chapter.short + ' 실제 화면 원본'}
      />
    </div>
  );
}
