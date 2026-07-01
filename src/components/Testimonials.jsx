import React, { useEffect, useRef, useState } from 'react';
import './Testimonials.css';

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const iconProps = { viewBox:'0 0 20 20', fill:'none', xmlns:'http://www.w3.org/2000/svg' };
const IconStar = () => (
  <svg {...iconProps}>
    <path d="M10 2.5l2.06 4.17 4.6.67-3.33 3.24.79 4.58L10 12.77 5.88 15.16l.79-4.58L3.34 7.34l4.6-.67L10 2.5z"
      stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
);
const IconShield = () => (
  <svg {...iconProps}>
    <path d="M10 2.5 3.5 5v4.5c0 3.8 2.8 7.1 6.5 7.8 3.7-.7 6.5-4 6.5-7.8V5L10 2.5z"
      stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M7.5 10l2 2 3-3" stroke="currentColor" strokeWidth="1.3"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Content ───────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: '"We used to lose warm leads in the gap between inbound inquiry and follow-up. Remiliux turned that gap into a controlled system."',
    name: 'Marcus Hale',
    role: 'Founder, Hale Capital Homes',
  },
  {
    quote: '"The accountability layer changed our culture. Managers now know exactly which conversations are moving deals and which reps need coaching."',
    name: 'Danielle Brooks',
    role: 'VP of Acquisitions, Summit Property Group',
  },
  {
    quote: '"It feels built for serious operators. The workflow automation, call visibility, and reporting are at the level we expect from enterprise software."',
    name: 'Ethan Ruiz',
    role: 'CEO, Northline Wholesaling',
  },
];

// ── Easing helpers ─────────────────────────────────────────────────────────
const easeInOut  = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
const easeOut    = t => 1 - Math.pow(1-t, 3);
const easeIn     = t => t * t * t;
const clamp01    = n => Math.max(0, Math.min(1, n));
const band       = (p, s, e) => clamp01((p-s)/(e-s));

// ── Phase timing (0 → 1) ───────────────────────────────────────────────────
// Phase 0: TeamPerformance parallax push-up + this section's bg fades in.
const TP_SLIDE_S = 0.00, TP_SLIDE_E = 0.18;
// Phase 1: Staggered card compress → circle (3 cards, each takes COMPRESS_DUR).
const COMPRESS_S = 0.08, COMPRESS_STAGGER = 0.06, COMPRESS_DUR = 0.10;
const COMPRESS_E = COMPRESS_S + 2*COMPRESS_STAGGER + COMPRESS_DUR; // ~0.30
// Phase 2: Snake path (all 3 circles travel, beads on string).
const SNAKE_S = COMPRESS_E - 0.02, SNAKE_E = 0.72;
// Phase 3: Circles arrive and expand back into testimonial cards.
const EXPAND_S = 0.68, EXPAND_E = 0.86;
// Phase 4: CTA dark card fades + slides in from below.
const CTA_S = 0.83, CTA_E = 0.97;
// Header text fades in during the snake phase.
const HEADER_S = COMPRESS_S, HEADER_E = SNAKE_S + 0.10;

// ── Catmull-Rom spline sampler ─────────────────────────────────────────────
// Bead offset: how far behind each circle lags on the shared path.
const BEAD_OFFSET = 0.33;

function catmullRomSeg(p0, p1, p2, p3, t) {
  const t2 = t*t, t3 = t*t*t;
  return {
    x: 0.5*((2*p1.x)+(-p0.x+p2.x)*t+(2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+(-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
    y: 0.5*((2*p1.y)+(-p0.y+p2.y)*t+(2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+(-p0.y+3*p1.y-3*p2.y+p3.y)*t3),
  };
}

function samplePath(waypoints, t) {
  const n = waypoints.length - 1;
  const seg = Math.min(Math.floor(t * n), n - 1);
  const lt = t * n - seg;
  const p0 = waypoints[Math.max(0, seg-1)];
  const p1 = waypoints[seg];
  const p2 = waypoints[Math.min(n, seg+1)];
  const p3 = waypoints[Math.min(n, seg+2)];
  return catmullRomSeg(p0, p1, p2, p3, lt);
}

// Build waypoints from container dimensions.
// All positions are absolute px (not normalized), computed from SW/SH.
function buildWaypoints(SW, SH, circleSize) {
  const COLS = 3;
  const GAP  = 20;
  const cardW = (SW - (COLS-1)*GAP) / COLS;
  const cardH = SH * 0.36; // cards occupy ~36% of stage height
  const cardY = SH * 0.22; // card top starts at 22% of stage
  // Card centers (start positions for compress)
  const startCenters = Array.from({length:3}, (_,i) => ({
    x: i*(cardW+GAP) + cardW/2,
    y: cardY + cardH/2,
  }));
  // Final grid positions (where circles expand back into cards)
  // Same layout, same Y (the "destination" is the same 3-column grid)
  const finalCenters = startCenters; // circles return to same positions

  const half = circleSize / 2;
  const W = SW, H = SH;
  // Snake path waypoints (absolute px)
  return [
    { x: startCenters[0].x, y: startCenters[0].y },        // W0 card1 start
    { x: startCenters[1].x, y: startCenters[1].y },        // W1 card2 start
    { x: startCenters[2].x, y: startCenters[2].y },        // W2 card3 start
    { x: W * 0.92,           y: H * 0.50 },                // W3 curve down right
    { x: W * 0.50,           y: H * 0.56 },                // W4 midpoint left sweep
    { x: W * 0.08,           y: H * 0.62 },                // W5 curve down left
    { x: finalCenters[0].x,  y: finalCenters[0].y },       // W6 card1 final
    { x: finalCenters[1].x,  y: finalCenters[1].y },       // W7 card2 final
    { x: finalCenters[2].x,  y: finalCenters[2].y },       // W8 card3 final
  ];
}

// ── Component ─────────────────────────────────────────────────────────────
const NAVBAR_H = 70;
const CIRCLE_SIZE = 56; // px diameter of compressed circle

export default function Testimonials() {
  const wrapRef  = useRef(null);
  const stageRef = useRef(null);
  const [progress, setProgress]   = useState(0);
  const [stageSize, setStageSize] = useState({ w: 1200, h: 600 });

  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const vh   = window.innerHeight;
      const p    = clamp01(-rect.top / (rect.height - vh));
      setProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onScroll, { passive:true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!stageRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      if (width > 0) setStageSize({ w: width, h: height });
    });
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);

  const { w: SW, h: SH } = stageSize;

  // ── Phase 0: TeamPerformance parallax push ─────────────────────────────
  const tpSlide = easeInOut(band(progress, TP_SLIDE_S, TP_SLIDE_E));
  // TP slides up: translateY(0) → translateY(-(100vh - NAVBAR_H))
  const tpTranslateY = -tpSlide * (window.innerHeight - NAVBAR_H);
  // Section background fades in over same span
  const bgOpacity = easeOut(band(progress, TP_SLIDE_S, TP_SLIDE_E + 0.06));

  // ── Phase 1: Card compress → circle ───────────────────────────────────
  const compressTs = TESTIMONIALS.map((_, i) =>
    easeInOut(band(progress, COMPRESS_S + i*COMPRESS_STAGGER, COMPRESS_S + i*COMPRESS_STAGGER + COMPRESS_DUR))
  );

  // Header text
  const headerT = easeOut(band(progress, HEADER_S, HEADER_E));

  // ── Phase 2: Snake path ────────────────────────────────────────────────
  const snakeProgress = easeInOut(band(progress, SNAKE_S, SNAKE_E));
  const waypoints = buildWaypoints(SW, SH, CIRCLE_SIZE);

  // ── Phase 3: Expand circle → card ─────────────────────────────────────
  const expandT = easeInOut(band(progress, EXPAND_S, EXPAND_E));
  // Content inside card fades in as it expands
  const cardContentT = easeOut(band(progress, EXPAND_S + 0.06, EXPAND_E));

  // ── Phase 4: CTA dark card ─────────────────────────────────────────────
  const ctaT = easeOut(band(progress, CTA_S, CTA_E));

  // ── Card geometry ──────────────────────────────────────────────────────
  const COLS = 3;
  const GAP  = 20;
  const cardW = (SW - (COLS-1)*GAP) / COLS;
  const cardH = SH * 0.36;
  const cardY = SH * 0.22;

  // Per-circle: compute current position, size, borderRadius
  const circles = TESTIMONIALS.map((_, i) => {
    const compress = compressTs[i];
    // Bead position on snake path
    const beadT   = clamp01(snakeProgress - i * BEAD_OFFSET);
    const snakePt = samplePath(waypoints, beadT);
    // Start center (before any animation: card center in layout)
    const startX  = i*(cardW+GAP) + cardW/2;
    const startY  = cardY + cardH/2;
    // Compress phase: card center → circle center (same position, size shrinks)
    const cx = startX + (snakePt.x - startX) * compress;
    const cy = startY + (snakePt.y - startY) * compress;
    // Final card position for expand phase
    const finalX = startX; // same as start (returns to grid)
    const finalY = startY;
    // During expand, move from snakePt toward final position
    const ex = snakePt.x + (finalX - snakePt.x) * expandT;
    const ey = snakePt.y + (finalY - snakePt.y) * expandT;
    // Combined position: compress then snake then expand
    // ex/ey are continuous: when expandT=0, ex=snakePt.x which equals
    // cx when compress=1 (snake phase). So we can always use ex/ey.
    // Only fall back to cx/cy before compress reaches 1 (no snake yet).
    const px = compress < 1 ? cx : ex;
    const py = compress < 1 ? cy : ey;
    // Size: card → circle → card
    const fullW = cardW, fullH = cardH;
    const cw = fullW + (CIRCLE_SIZE - fullW) * compress * (1 - expandT);
    const ch = fullH + (CIRCLE_SIZE - fullH) * compress * (1 - expandT);
    // Border radius: card (16px) → circle (50%) → card (16px)
    const circleProgress = compress * (1 - expandT);
    const br = 16 + (Math.min(cw,ch)/2 - 16) * circleProgress;
    // Opacity: card content fades out during compress, fades in on expand
    const contentOpacity = Math.max(0, (1 - compress * 2)) + cardContentT * compress;
    return { px, py, cw, ch, br, contentOpacity };
  });

  return (
    <div className="ts" ref={wrapRef}>
      <div className="ts__sticky" style={{ background: `rgba(194,164,129,${bgOpacity})` }}>

        {/* TeamPerformance clone layer — slides upward to reveal this section */}
        {/* This is a blank cover that starts opaque (tan bg matching TP's bg) and
            slides up, creating the illusion that TP is being pushed off screen */}
        <div className="ts__tp-cover" style={{
          transform: `translateY(${tpTranslateY}px)`,
          opacity: 1 - tpSlide,
        }} />

        {/* ── Header ── */}
        <div className="ts__header" style={{
          opacity: headerT,
          transform: `translateY(${(1-headerT)*24}px)`,
        }}>
          <div className="ts__eyebrow">Proof of Scale</div>
          <h2 className="ts__headline">Built to sound like the room<br />you want to sell into.</h2>
          <p className="ts__body">
            Investor-focused credibility needs sharp positioning and believable proof.
            These testimonials are written with acquisition, follow-up, and management
            realities in mind.
          </p>
        </div>

        {/* ── Stage: circles + cards live here ── */}
        <div className="ts__stage" ref={stageRef}>
          {circles.map(({ px, py, cw, ch, br, contentOpacity }, i) => {
            const t = TESTIMONIALS[i];
            return (
              <div
                key={i}
                className="ts__card"
                style={{
                  left: px - cw/2,
                  top:  py - ch/2,
                  width: cw,
                  height: ch,
                  borderRadius: br,
                }}
              >
                <div className="ts__card-inner" style={{ opacity: contentOpacity }}>
                  <div className="ts__star"><IconStar /></div>
                  <p className="ts__quote">{t.quote}</p>
                  <div className="ts__divider" />
                  <div className="ts__name">{t.name}</div>
                  <div className="ts__role">{t.role}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CTA dark card ── */}
        <div className="ts__cta-wrap" style={{
          opacity: ctaT,
          transform: `translateY(${(1-ctaT)*40}px)`,
          pointerEvents: ctaT > 0.5 ? 'auto' : 'none',
        }}>
          <div className="ts__cta">
            <div className="ts__cta-glow" />
            <div className="ts__cta-eyebrow">Private Demo</div>
            <h2 className="ts__cta-headline">
              Stop losing deals to<br />poor follow-up.
            </h2>
            <p className="ts__cta-body">
              Remiliux is built to capture, sequence, and close —
              manage every opportunity with enterprise-grade precision.
            </p>
            <div className="ts__cta-actions">
              <button className="ts__cta-btn">Schedule A Private Demo →</button>
              <div className="ts__cta-input">
                <span className="ts__cta-input-icon"><IconShield /></span>
                <input type="email" placeholder="Your work email" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
