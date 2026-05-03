import React from 'react';
import styles from './SectionHeading.module.css';

type Props = {
  eyebrow?: string;
  title: string;
};

export default function SectionHeading({eyebrow, title}: Props): JSX.Element {
  return (
    <header className={styles.heading}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 className={styles.title}>{title}</h2>
      <span className={styles.rule} aria-hidden="true" />
    </header>
  );
}
