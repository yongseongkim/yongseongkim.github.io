import React, {useEffect, useRef, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './NaverMap.module.css';

type Props = {
  lat: number;
  lng: number;
  zoom?: number;
  title?: string;
};

const SCRIPT_ID = 'naver-maps-sdk';

function loadScript(clientId: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('SSR'));
  }
  const w = window as unknown as {naver?: {maps?: unknown}};
  if (w.naver && w.naver.maps) {
    return Promise.resolve();
  }
  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('script error')));
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('script error'));
    document.head.appendChild(script);
  });
}

export default function NaverMap({lat, lng, zoom = 16, title}: Props): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const {siteConfig} = useDocusaurusContext();
  const clientId =
    (siteConfig.customFields?.naverMapsClientId as string | undefined) ?? '';
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!clientId || clientId === 'REPLACE_WITH_NAVER_MAPS_CLIENT_ID') {
      setStatus('error');
      return;
    }
    let cancelled = false;
    loadScript(clientId)
      .then(() => {
        if (cancelled || !ref.current) return;
        const naver = (window as unknown as {naver: any}).naver;
        if (!naver?.maps) {
          setStatus('error');
          return;
        }
        const position = new naver.maps.LatLng(lat, lng);
        const map = new naver.maps.Map(ref.current, {
          center: position,
          zoom,
          zoomControl: true,
          zoomControlOptions: {
            position: naver.maps.Position.TOP_RIGHT,
            style: naver.maps.ZoomControlStyle.SMALL,
          },
          draggable: false,
          pinchZoom: false,
          scrollWheel: false,
          keyboardShortcuts: false,
          disableDoubleTapZoom: true,
          disableDoubleClickZoom: true,
          disableTwoFingerTapZoom: true,
          scaleControl: false,
          logoControl: true,
          mapDataControl: false,
        });
        // eslint-disable-next-line no-new
        new naver.maps.Marker({position, map, title});
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [clientId, lat, lng, zoom, title]);

  return (
    <div className={styles.wrapper}>
      <div ref={ref} className={styles.map} />
      {status === 'loading' && (
        <div className={styles.overlay}>지도 불러오는 중…</div>
      )}
      {status === 'error' && (
        <div className={styles.overlay}>
          Naver Maps API 키가 아직 설정되지 않았습니다.
        </div>
      )}
    </div>
  );
}
