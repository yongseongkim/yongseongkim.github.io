import React from 'react';
import FlowerCanvas from './FlowerCanvas';
import styles from './Cover.module.css';

export default function Cover(): JSX.Element {
  return (
    <section className={styles.cover}>
      <div className={styles.photo}>
        <img
          src="/img/wedding/cover.webp"
          alt="조현수 · 김용성"
          width={1200}
          height={1600}
        />
        <FlowerCanvas />
      </div>

      <div className={styles.namesKo}>
        <span>조현수</span>
        <span className={styles.dot}>·</span>
        <span>김용성</span>
      </div>

      <div className={styles.meta}>
        <p className={styles.date}>2026년 9월 12일 토요일 오후 5시</p>
        <p className={styles.venue}>더채플앳청담</p>
      </div>
    </section>
  );
}
