import React from 'react';
import SectionHeading from './SectionHeading';
import NaverMap from './NaverMap';
import styles from './Venue.module.css';

const VENUE_NAME = '더채플앳청담';
const ROAD_ADDRESS = '서울 강남구 선릉로 757';
const OLD_ADDRESS = '(지번) 강남구 논현동 94-9';
const NAVER_MAP_URL = 'https://naver.me/5ne4oSX1';
const KAKAO_MAP_URL = `https://map.kakao.com/link/map/${encodeURIComponent(
  VENUE_NAME,
)},37.5222098,127.038892`;
const LAT = 37.5222098;
const LNG = 127.038892;

function PinIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function Venue(): JSX.Element {
  return (
    <section className={styles.venue}>
      <SectionHeading title="오시는 길" />

      <div className={styles.info}>
        <h3 className={styles.name}>{VENUE_NAME}</h3>
        <p className={styles.address}>{ROAD_ADDRESS}</p>
        <p className={styles.addressSub}>{OLD_ADDRESS}</p>
      </div>

      <NaverMap lat={LAT} lng={LNG} zoom={16} title={VENUE_NAME} />

      <div className={styles.mapButtons}>
        <a
          href={NAVER_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.naverCta}
          aria-label="네이버 지도에서 열기"
        >
          <span className={styles.ctaIcon}>
            <PinIcon />
          </span>
          <span>네이버 지도</span>
        </a>
        <a
          href={KAKAO_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.kakaoCta}
          aria-label="카카오 지도에서 열기"
        >
          <span className={styles.ctaIcon}>
            <PinIcon />
          </span>
          <span>카카오 지도</span>
        </a>
      </div>

      <details className={styles.directions} open>
        <summary>교통 및 주차 안내</summary>
        <ul>
          <li>
            <strong>지하철</strong>
            <span>
              강남구청역 (7호선 · 수인분당선)
              <br />
              압구정로데오역 (수인분당선)
            </span>
          </li>
          <li>
            <strong>버스</strong>
            <span>
              영동고교앞 정류장 하차 후 도보 약 2분
              <br />
              간선 301 · 351 · 472 / 지선 3011 · 4412
            </span>
          </li>
          <li>
            <strong>주차</strong>
            <span>내부 200대 · 외부 300대 · 1시간 30분 무료</span>
          </li>
        </ul>
        <p className={styles.notice}>
          예식장 주변 주차가 혼잡하오니
          <br />
          가급적 대중교통을 이용해 주시면 감사하겠습니다.
        </p>
      </details>
    </section>
  );
}
