import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import type {Photo} from './Gallery';
import styles from './Lightbox.module.css';

type Props = {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: Props): JSX.Element | null {
  const touchStartX = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current == null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) onNext();
      else onPrev();
    },
    [onPrev, onNext],
  );

  const photo = photos[index];

  if (!mounted || typeof document === 'undefined') return null;

  const view = (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="갤러리"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        type="button"
        className={`${styles.nav} ${styles.prev}`}
        aria-label="이전"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
      >
        ‹
      </button>

      <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.full}
          alt={`사진 ${index + 1}`}
          className={styles.image}
        />
      </div>

      <button
        type="button"
        className={`${styles.nav} ${styles.next}`}
        aria-label="다음"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
      >
        ›
      </button>

      <div className={styles.bottomBar}>
        <span className={styles.counter}>
          {index + 1} / {photos.length}
        </span>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );

  return createPortal(view, document.body);
}
