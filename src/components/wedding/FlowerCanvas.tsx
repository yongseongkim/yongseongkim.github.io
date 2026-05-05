import React, {useEffect, useRef} from 'react';
import styles from './FlowerCanvas.module.css';

type Petal = {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  tilt: number;
  vtilt: number;
  wobblePhase: number;
  vwobble: number;
  variant: number;
};

// Petal density: count = floor(width * height * DENSITY).
// At 440x570 (mobile cover) ≈ 45 petals; at 1200x800 ≈ 175.
const DENSITY = 0.00018;

const COLORS = [
  '#ffffff',
  '#fff7e8',
  '#fff0d8',
];

// Single sakura petal: rounded base, tapered top with a soft V notch.
// Variant 0: standard. 1: slightly wider. 2: narrower/longer.
function makePetalSprite(color: string, variant: number): HTMLCanvasElement {
  const SIZE = 64;
  const c = document.createElement('canvas');
  c.width = SIZE;
  c.height = SIZE;
  const ctx = c.getContext('2d')!;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  ctx.translate(cx, cy);

  const widthRatio = variant === 1 ? 0.62 : variant === 2 ? 0.46 : 0.54;
  const heightRatio = variant === 2 ? 0.92 : 0.84;
  const w = SIZE * widthRatio;
  const h = SIZE * heightRatio;

  // Soft outer glow (under-fill)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  drawPetalPath(ctx, w * 1.08, h * 1.04);
  ctx.fill();

  ctx.fillStyle = color;
  drawPetalPath(ctx, w, h);
  ctx.fill();

  // Subtle blush near base (gives depth)
  const grad = ctx.createLinearGradient(0, h / 2, 0, -h / 2);
  grad.addColorStop(0, 'rgba(255, 220, 220, 0.35)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  grad.addColorStop(1, 'rgba(255, 235, 200, 0.25)');
  ctx.fillStyle = grad;
  drawPetalPath(ctx, w, h);
  ctx.fill();

  return c;
}

function drawPetalPath(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): void {
  const halfW = w / 2;
  const halfH = h / 2;
  ctx.beginPath();
  // Bottom center (base)
  ctx.moveTo(0, halfH);
  // Right side: curve out then up to right tip
  ctx.bezierCurveTo(
    halfW * 1.05,
    halfH * 0.3,
    halfW * 0.95,
    -halfH * 0.55,
    halfW * 0.22,
    -halfH,
  );
  // V notch across the top tip
  ctx.quadraticCurveTo(0, -halfH * 0.78, -halfW * 0.22, -halfH);
  // Left side: mirror back to base
  ctx.bezierCurveTo(
    -halfW * 0.95,
    -halfH * 0.55,
    -halfW * 1.05,
    halfH * 0.3,
    0,
    halfH,
  );
  ctx.closePath();
}

export default function FlowerCanvas(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // 4 petal variants: 3 colors × shape variants for visible variety.
    const sprites: HTMLCanvasElement[] = [
      makePetalSprite(COLORS[0], 0),
      makePetalSprite(COLORS[0], 1),
      makePetalSprite(COLORS[1], 2),
      makePetalSprite(COLORS[2], 0),
    ];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let petals: Petal[] = [];
    let raf = 0;
    let visible = true;

    function spawn(p: Petal, fresh: boolean) {
      if (fresh) {
        // Half spawn from top edge, half from right edge — petals drift
        // toward bottom-left, so right-edge spawns keep the right/bottom
        // area populated rather than a one-way left-fed stream.
        if (Math.random() < 0.5) {
          p.x = Math.random() * width;
          p.y = -20 - Math.random() * 40;
        } else {
          p.x = width + 20 + Math.random() * 40;
          p.y = Math.random() * height * 0.85;
        }
      } else {
        p.x = Math.random() * width;
        p.y = Math.random() * height;
      }
      p.size = 6 + Math.random() * 8;
      p.vx = -(0.15 + Math.random() * 0.5);
      p.vy = 0.22 + Math.random() * 0.7;
      p.rot = Math.random() * Math.PI * 2;
      p.vrot = (Math.random() - 0.5) * 0.025;
      p.tilt = Math.random() * Math.PI * 2;
      p.vtilt = 0.012 + Math.random() * 0.025;
      p.wobblePhase = Math.random() * Math.PI * 2;
      p.vwobble = 0.012 + Math.random() * 0.025;
      p.variant = Math.floor(Math.random() * sprites.length);
    }

    function init() {
      const target = Math.max(20, Math.floor(width * height * DENSITY));
      petals = [];
      for (let i = 0; i < target; i++) {
        const p = {} as Petal;
        spawn(p, false);
        petals.push(p);
      }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(p: Petal) {
      const sprite = sprites[p.variant];
      const scaleY = Math.cos(p.tilt) * 0.7 + 0.3;
      const wobbleX = Math.sin(p.wobblePhase) * 0.6;
      ctx.save();
      ctx.translate(p.x + wobbleX, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, scaleY);
      ctx.drawImage(sprite, -p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);
      for (const p of petals) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        p.tilt += p.vtilt;
        p.wobblePhase += p.vwobble;
        if (p.y - p.size > height || p.x + p.size < 0) {
          spawn(p, true);
        }
        draw(p);
      }
      raf = requestAnimationFrame(tick);
    }

    function start() {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function onVisibility() {
      if (document.hidden) stop();
      else if (visible) start();
    }

    resize();
    init();
    start();

    const onResize = () => {
      resize();
      init();
    };
    window.addEventListener('resize', onResize, {passive: true});
    document.addEventListener('visibilitychange', onVisibility);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !document.hidden) start();
          else stop();
        },
        {threshold: 0},
      );
      observer.observe(canvas);
    }

    return () => {
      stop();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      observer?.disconnect();
    };
  }, []);

  return (
    <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
  );
}
