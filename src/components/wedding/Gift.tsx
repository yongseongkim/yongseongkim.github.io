import React, {useCallback, useRef, useState} from "react";
import SectionHeading from "./SectionHeading";
import styles from "./Gift.module.css";

type Person = {
  role: string;
  name: string;
  phone?: string;
  bank?: string;
  accountNumber?: string;
};

type Side = {
  main: Person;
  parents: Person[];
};

const sides: Side[] = [
  {
    main: {
      role: "신부",
      name: "조현수",
      phone: "010-5461-4626",
      bank: "국민은행",
      accountNumber: "378801-01-122436",
    },
    parents: [
      {role: "아버지", name: "조영상"},
      {role: "어머니", name: "김선희"},
    ],
  },
  {
    main: {
      role: "신랑",
      name: "김용성",
      phone: "010-7461-0520",
      bank: "토스뱅크",
      accountNumber: "1000-0007-3206",
    },
    parents: [{role: "어머니", name: "신금채", phone: "010-2727-2221"}],
  },
];

function PhoneIcon(): JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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
  if (typeof navigator === "undefined") return false;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // fall through to legacy path
    }
  }
  if (typeof document === "undefined") return false;
  const ta = document.createElement("textarea");
  ta.value = value;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(ta);
  }
}

type RowProps = {
  person: Person;
  rowKey: string;
  copied: boolean;
  onCopy: (key: string, value: string) => void;
  variant?: "main" | "parent";
};

function PersonRow({
  person,
  rowKey,
  copied,
  onCopy,
  variant = "main",
}: RowProps): JSX.Element {
  const tel = person.phone ? person.phone.replace(/-/g, "") : "";
  const hasAccount = Boolean(person.bank && person.accountNumber);
  const isParent = variant === "parent";
  return (
    <div className={isParent ? styles.parentBlock : styles.mainBlock}>
      <div className={styles.head}>
        <span className={styles.role}>{person.role}</span>
        <span className={styles.name}>{person.name}</span>
        <div className={styles.actions}>
          {person.phone && (
            <>
              <a
                className={styles.iconBtn}
                href={`tel:${tel}`}
                aria-label={`${person.role} 전화`}
              >
                <PhoneIcon />
              </a>
              <a
                className={styles.iconBtn}
                href={`sms:${tel}`}
                aria-label={`${person.role} 메시지`}
              >
                <MessageIcon />
              </a>
            </>
          )}
        </div>
      </div>
      {hasAccount && (
        <div className={styles.account}>
          <span className={styles.bank}>{person.bank}</span>
          <span className={styles.number}>{person.accountNumber}</span>
          <button
            type="button"
            className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ""}`}
            onClick={() =>
              onCopy(
                rowKey,
                `${person.bank} ${person.accountNumber} ${person.name}`,
              )
            }
            aria-live="polite"
          >
            {copied ? "복사됨" : "복사"}
          </button>
        </div>
      )}
    </div>
  );
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

      <p className={styles.note}>
        함께하지 못하시더라도
        <br />
        따뜻한 축하의 연락만으로도
        <br />
        저희에게는 큰 기쁨이 됩니다.
        <br />
        전해주시는 마음 감사히 간직하겠습니다.
      </p>

      <ul className={styles.list}>
        {sides.map((side, sideIdx) => {
          const mainKey = `main-${sideIdx}`;
          return (
            <li key={mainKey} className={styles.card}>
              <PersonRow
                person={side.main}
                rowKey={mainKey}
                copied={copiedKey === mainKey}
                onCopy={handleCopy}
              />

              {side.parents.length > 0 && (
                <div className={styles.parentList}>
                  {side.parents.map((parent, parentIdx) => {
                    const key = `parent-${sideIdx}-${parentIdx}`;
                    return (
                      <PersonRow
                        key={key}
                        person={parent}
                        rowKey={key}
                        copied={copiedKey === key}
                        onCopy={handleCopy}
                        variant="parent"
                      />
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
