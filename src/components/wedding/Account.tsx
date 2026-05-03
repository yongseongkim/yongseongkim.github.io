import React, {useCallback, useRef, useState} from 'react';
import SectionHeading from './SectionHeading';
import styles from './Account.module.css';

type Entry = {
  role: string;
  name: string;
  bank: string;
  number: string;
};

const groups: {title: string; entries: Entry[]}[] = [
  {
    title: '신랑측',
    entries: [
      {role: '신랑', name: '김용성', bank: '토스뱅크', number: '1000-0007-3206'},
    ],
  },
  {
    title: '신부측',
    entries: [
      {role: '신부', name: '조현수', bank: '은행명', number: '000-0000-0000-00'},
    ],
  },
];

async function writeClipboard(value: string): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // fall through to legacy path
    }
  }
  if (typeof document === 'undefined') return false;
  const ta = document.createElement('textarea');
  ta.value = value;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    const ok = document.execCommand('copy');
    return ok;
  } catch {
    return false;
  } finally {
    document.body.removeChild(ta);
  }
}

export default function Account(): JSX.Element {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(async (key: string, value: string) => {
    const ok = await writeClipboard(value);
    if (!ok) return;
    setCopiedKey(key);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopiedKey(null), 1600);
  }, []);

  return (
    <section className={styles.account}>
      <SectionHeading title="마음 전하실 곳" />

      <p className={styles.note}>
        참석이 어려워 직접 축하를 전하지 못하는 분들을 위해
        <br />
        계좌번호를 기재하였습니다.
      </p>

      <div className={styles.groups}>
        {groups.map((g) => (
          <div key={g.title} className={styles.group}>
            <h3 className={styles.groupTitle}>{g.title}</h3>
            <ul className={styles.list}>
              {g.entries.map((e, idx) => {
                const key = `${g.title}-${idx}`;
                const copied = copiedKey === key;
                return (
                  <li key={key} className={styles.row}>
                    <div className={styles.rowHead}>
                      <span className={styles.role}>{e.role}</span>
                      <span className={styles.name}>{e.name}</span>
                    </div>
                    <div className={styles.rowBody}>
                      <span className={styles.bank}>{e.bank}</span>
                      <span className={styles.number}>{e.number}</span>
                      <button
                        type="button"
                        className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`}
                        onClick={() => handleCopy(key, `${e.bank} ${e.number} ${e.name}`)}
                        aria-live="polite"
                      >
                        {copied ? '복사됨' : '복사'}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
