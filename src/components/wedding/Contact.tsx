import React from "react";
import SectionHeading from "./SectionHeading";
import styles from "./Contact.module.css";

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

type Row = {
  role: string;
  name: string;
  phone?: string;
};

const rows: { title: string; people: Row[] }[] = [
  {
    title: "신랑측",
    people: [
      { role: "신랑", name: "김용성", phone: "010-7461-0520" },
      { role: "어머니", name: "신금채", phone: "010-2727-2221" },
    ],
  },
  {
    title: "신부측",
    people: [
      { role: "신부", name: "조현수", phone: "010-5461-4626" },
      { role: "아버지", name: "이름" },
      { role: "어머니", name: "이름" },
    ],
  },
];

export default function Contact(): JSX.Element {
  return (
    <section className={styles.contact}>
      <SectionHeading title="연락하기" />

      <div className={styles.groups}>
        {rows.map((group) => (
          <div key={group.title} className={styles.group}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <ul className={styles.list}>
              {group.people.map((p) => {
                const tel = p.phone ? p.phone.replace(/-/g, "") : "";
                return (
                  <li key={p.role} className={styles.row}>
                    <span className={styles.role}>{p.role}</span>
                    <span className={styles.name}>{p.name}</span>
                    <div className={styles.actions}>
                      {p.phone ? (
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
                      ) : null}
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
