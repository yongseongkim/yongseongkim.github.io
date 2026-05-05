import React, {useCallback, useRef, useState} from 'react';
import SectionHeading from './SectionHeading';
import styles from './Gift.module.css';

type Person = {
  role: string;
  name: string;
  phone?: string;
  bank?: string;
  accountNumber?: string;
};

const people: Person[] = [
  {
    role: '신랑',
    name: '김용성',
    phone: '010-7461-0520',
    bank: '토스뱅크',
    accountNumber: '1000-0007-3206',
  },
  {
    role: '신부',
    name: '조현수',
    phone: '010-5461-4626',
    bank: '국민은행',
    accountNumber: '378801-01-122436',
  },
];

function PhoneIcon(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0 1 22 16.92Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MessageIcon(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(ta);
  }
}

export default function Gift(): JSX.Element {
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
    <section className={styles.gift}>
      <SectionHeading title="마음 전하기" />

      <ul className={styles.list}>
          {people.map((p, idx) => {
            const key = `${p.role}-${idx}`;
            const tel = p.phone ? p.phone.replace(/-/g, '') : '';
            const hasAccount = Boolean(p.bank && p.accountNumber);
            const copied = copiedKey === key;
            return (
              <li key={key} className={styles.card}>
                <div className={styles.head}>
                  <span className={styles.role}>{p.role}</span>
                  <span className={styles.name}>{p.name}</span>
                  <div className={styles.actions}>
                    {p.phone && (
                      <>
                        <a
                          className={styles.iconBtn}
                          href={`tel:${tel}`}
                          aria-label={`${p.role} 전화`}
                        >
                          <PhoneIcon />
                        </a>
                        <a
                          className={styles.iconBtn}
                          href={`sms:${tel}`}
                          aria-label={`${p.role} 메시지`}
                        >
                          <MessageIcon />
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {hasAccount && (
                  <div className={styles.account}>
                    <span className={styles.bank}>{p.bank}</span>
                    <span className={styles.number}>{p.accountNumber}</span>
                    <button
                      type="button"
                      className={`${styles.copyBtn} ${
                        copied ? styles.copyBtnDone : ''
                      }`}
                      onClick={() =>
                        handleCopy(
                          key,
                          `${p.bank} ${p.accountNumber} ${p.name}`,
                        )
                      }
                      aria-live="polite"
                    >
                      {copied ? '복사됨' : '복사'}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
      </ul>
    </section>
  );
}
