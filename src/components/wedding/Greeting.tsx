import React from "react";
import SectionHeading from "./SectionHeading";
import styles from "./Greeting.module.css";

export default function Greeting(): JSX.Element {
  return (
    <section className={styles.greeting}>
      <SectionHeading title="모시는 글" />

      <div className={styles.body}>
        <p>
          서로 다른 길을 걸어온 두 사람이
          <br />
          이제 한 길을 함께 걷고자 합니다.
        </p>
        <p>
          귀한 걸음으로 축복해 주시면
          <br />
          더없는 기쁨으로 간직하겠습니다.
        </p>
      </div>

      <div className={styles.signature}>
        <div className={styles.sigRow}>
          <span className={styles.sigParents}>
            <span className={styles.deceased}>故</span> 김한수 · 신금채
          </span>
          <span className={styles.sigLabel}>의 아들</span>
          <span className={styles.sigName}>김용성</span>
        </div>
        <div className={styles.sigRow}>
          <span className={styles.sigParents}>아버지 · 어머니</span>
          <span className={styles.sigLabel}>의 딸</span>
          <span className={styles.sigName}>조현수</span>
        </div>
      </div>
    </section>
  );
}
