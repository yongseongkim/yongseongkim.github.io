import React, {useEffect, useRef} from 'react';
import Head from '@docusaurus/Head';

import Cover from '@site/src/components/wedding/Cover';
import Greeting from '@site/src/components/wedding/Greeting';
import Gallery from '@site/src/components/wedding/Gallery';
import Venue from '@site/src/components/wedding/Venue';
import Gift from '@site/src/components/wedding/Gift';
import SectionHeading from '@site/src/components/wedding/SectionHeading';

import styles from './styles.module.css';

export default function WeddingPage(): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const targets = root.querySelectorAll<HTMLElement>(`.${styles.reveal}`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealVisible);
            observer.unobserve(entry.target);
          }
        });
      },
      {threshold: 0.12, rootMargin: '0px 0px -40px 0px'},
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Head>
        <html lang="ko" />
        <title>김용성 · 조현수 청첩장</title>
        <meta
          name="description"
          content="2026년 9월 12일 토요일 오후 5시 · 더채플앳청담"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="김용성 · 조현수 청첩장" />
        <meta
          property="og:description"
          content="2026년 9월 12일 토요일 오후 5시 · 더채플앳청담"
        />
        <meta
          property="og:image"
          content="https://yongseongkim.github.io/img/wedding/cover.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1555" />
        <meta property="og:image:alt" content="김용성 · 조현수" />
        <meta
          property="og:url"
          content="https://yongseongkim.github.io/wedding/"
        />
        <meta property="og:locale" content="ko_KR" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="김용성 · 조현수 청첩장" />
        <meta
          name="twitter:description"
          content="2026년 9월 12일 토요일 오후 5시 · 더채플앳청담"
        />
        <meta
          name="twitter:image"
          content="https://yongseongkim.github.io/img/wedding/cover.jpg"
        />

        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </Head>

      <div className={styles.page}>
        <div className={styles.card} ref={rootRef}>
          <div className={styles.reveal}>
            <Cover />
          </div>
          <div className={styles.reveal}>
            <Greeting />
          </div>
          <div className={styles.reveal}>
            <Gallery />
          </div>
          <div className={styles.reveal}>
            <Venue />
          </div>
          <div className={styles.reveal}>
            <Gift />
          </div>
          <div className={styles.reveal}>
            <div className={styles.closing}>
              <SectionHeading title="감사합니다" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
