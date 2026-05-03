import React from 'react';
import styles from './Cover.module.css';

export default function Cover(): JSX.Element {
  return (
    <section className={styles.cover}>
      <div className={styles.photo}>
        <img
          src="/img/wedding/cover.webp"
          alt="김용성 · 조현수"
          width={1200}
          height={1555}
        />
      </div>

      <div className={styles.namesKo}>
        <span>김용성</span>
        <span className={styles.dot}>·</span>
        <span>조현수</span>
      </div>

      <div className={styles.meta}>
        <p className={styles.date}>2026년 9월 12일 토요일 오후 5시</p>
        <p className={styles.venue}>더채플앳청담</p>
      </div>
    </section>
  );
}
