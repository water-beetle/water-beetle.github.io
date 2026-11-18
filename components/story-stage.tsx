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

import { media, devlogs, updateHref, type MediaKey } from '@/lib/devlogs';
import { features, type FeatureMedia } from '@/lib/features';

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
          onError={() => {
            setLoading(false);
            setFailed(true);
          }}
          onLoad={() => {
            if (shown.src === expected.src) {
              setLoading(false);
              setFailed(false);
              onDisplayed?.(shown.src);
            }
          }}
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
          <span>
            이미지를 불러오지 못했습니다.
            {shown.src !== expected.src ? ' 이전 장면을 유지합니다.' : ''}
          </span>
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
