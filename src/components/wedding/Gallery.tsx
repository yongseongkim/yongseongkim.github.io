import React, {useCallback, useState} from 'react';
import SectionHeading from './SectionHeading';
import Skeleton from './Skeleton';
import Lightbox from './Lightbox';
import manifest from './gallery.json';
import styles from './Gallery.module.css';

export type Photo = {thumb: string; full: string};

const photos: Photo[] = manifest as Photo[];
const PLACEHOLDER_COUNT = 18;
const INITIAL_VISIBLE = 9;

export default function Gallery(): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  const isEmpty = photos.length === 0;
  const hasMore = photos.length > INITIAL_VISIBLE && !expanded;
  const visiblePhotos = expanded ? photos : photos.slice(0, INITIAL_VISIBLE);

  const open = useCallback(
    (i: number) => {
      if (isEmpty) return;
      setOpenIndex(i);
    },
    [isEmpty],
  );
  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i == null ? i : (i - 1 + photos.length) % photos.length,
      ),
    [],
  );
  const next = useCallback(
    () =>
      setOpenIndex((i) => (i == null ? i : (i + 1) % photos.length)),
    [],
  );

  return (
    <section className={styles.gallery}>
      <SectionHeading title="갤러리" />

      <div className={styles.grid}>
        {isEmpty
          ? Array.from({length: PLACEHOLDER_COUNT}).map((_, i) => (
              <div key={i} className={styles.tile}>
                <Skeleton aspect="1 / 1" />
              </div>
            ))
          : visiblePhotos.map((photo, i) => (
              <button
                key={photo.thumb}
                type="button"
                className={styles.tile}
                onClick={() => open(i)}
                aria-label={`사진 ${i + 1}`}
              >
                <img
                  src={photo.thumb}
                  alt={`사진 ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
      </div>

      {hasMore && (
        <button
          type="button"
          className={styles.moreBtn}
          onClick={() => setExpanded(true)}
        >
          사진 더보기 (+{photos.length - INITIAL_VISIBLE})
        </button>
      )}

      {openIndex != null && !isEmpty && (
        <Lightbox
          photos={photos}
          index={openIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}
