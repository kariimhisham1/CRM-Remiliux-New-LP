import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Testimonials.css';

// ── Inline SVGs ───────────────────────────────────────────────────────────────
const svgProps = { viewBox:'0 0 20 20', fill:'none', xmlns:'http://www.w3.org/2000/svg' };
const IconStar = () => (
  <svg {...svgProps}>
    <path d="M10 2.5l2.06 4.17 4.6.67-3.33 3.24.79 4.58L10 12.77 5.88 15.16l.79-4.58L3.34 7.34l4.6-.67L10 2.5z"
      stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
);
const IconShield = () => (
  <svg {...svgProps}>
    <path d="M10 2.5 3.5 5v4.5c0 3.8 2.8 7.1 6.5 7.8 3.7-.7 6.5-4 6.5-7.8V5L10 2.5z"
      stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M7.5 10l2 2 3-3" stroke="currentColor" strokeWidth="1.3"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconClock = () => (
  <svg {...svgProps}>
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M10 6.2V10l3 1.8" stroke="currentColor" strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconPhone = () => (
  <svg {...svgProps}>
    <path d="M5.5 3.5h2.2l1 3.3-1.6 1.4a8.5 8.5 0 0 0 4.2 4.2l1.4-1.6 3.3 1v2.2c0 .9-.8 1.5-1.6 1.4-6-.7-9.6-4.3-10.3-10.3-.1-.8.5-1.6 1.4-1.6Z"
      stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);
const IconCheck = () => (
  <svg {...svgProps}>
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M7 10.2 9 12.2 13.2 7.8" stroke="currentColor" strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconTrophy = () => (
  <svg {...svgProps}>
    <path d="M6.5 4h7v4.3a3.5 3.5 0 0 1-7 0V4Z" stroke="currentColor" strokeWidth="1.4"
      strokeLinejoin="round"/>
    <path d="M10 11.8V14M7.5 16.3h5" stroke="currentColor" strokeWidth="1.4"
      strokeLinejoin="round"/>
  </svg>
);

// ── Content ───────────────────────────────────────────────────────────────────
// Feature cards — mirrors TeamPerformance's left panel content exactly,
// so the clone overlay is visually identical to the real component.
const FEATURES = [
  { Icon: IconClock,  title: 'Activity Command Center',
    desc: 'Surface calls, texts, appointments, and next actions by rep, team, and market in one operating view.' },
  { Icon: IconPhone,  title: 'Call Tracking',
    desc: 'Monitor answer rates, connection quality, response times, and call outcomes without chasing spreadsheets.' },
  { Icon: IconCheck,  title: 'Follow-Up Completion',
    desc: 'Track whether every lead received the required touch pattern and escalate exceptions automatically.' },
  { Icon: IconTrophy, title: 'Leaderboards & KPIs',
    desc: 'Rank conversion performance by acquisitions rep, manager, office, and campaign with clean executive clarity.' },
];

const TESTIMONIALS = [
  { quote: '"We used to lose warm leads in the gap between inbound inquiry and follow-up. Remiliux turned that gap into a controlled system."',
    name: 'Marcus Hale', role: 'Founder, Hale Capital Homes' },
  { quote: '"The accountability layer changed our culture. Managers now know exactly which conversations are moving deals and which reps need coaching."',
    name: 'Danielle Brooks', role: 'VP of Acquisitions, Summit Property Group' },
  { quote: '"It feels built for serious operators. The workflow automation, call visibility, and reporting are at the level we expect from enterprise software."',
    name: 'Ethan Ruiz', role: 'CEO, Northline Wholesaling' },
];

// ── Easing ────────────────────────────────────────────────────────────────────
const easeInOut = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
const easeOut   = t => 1 - Math.pow(1-t, 3);
const easeIn    = t => t * t * t;
const clamp01   = n => Math.max(0, Math.min(1, n));
const band      = (p, s, e) => clamp01((p-s)/(e-s));

// ── Phase timing ──────────────────────────────────────────────────────────────
const TP_SLIDE_S  = 0.00, TP_SLIDE_E  = 0.20; // TP cover slides up
const COMPRESS_S  = 0.04, COMPRESS_E  = 0.22; // 4 cards → 3 dots
const SNAKE_S     = 0.20, SNAKE_E     = 0.68; // dots snake down
const EXPAND_S    = 0.64, EXPAND_E    = 0.82; // dots → testimonial cards
const HEADER_S    = 0.16, HEADER_E    = 0.38; // testimonials header fades in
const CTA_S       = 0.80, CTA_E       = 0.96; // CTA dark card

// ── Catmull-Rom spline ────────────────────────────────────────────────────────
const BEAD_OFFSET = 0.34; // how far behind each circle lags on the path
const CIRCLE_SIZE = 52;   // dot diameter in px

function catmullRomSeg(p0, p1, p2, p3, t) {
  const t2 = t*t, t3 = t*t*t;
  return {
    x: 0.5*((2*p1.x)+(-p0.x+p2.x)*t+(2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+(-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
    y: 0.5*((2*p1.y)+(-p0.y+p2.y)*t+(2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+(-p0.y+3*p1.y-3*p2.y+p3.y)*t3),
  };
}
function samplePath(waypoints, t) {
  const n = waypoints.length - 1;
  const seg = Math.min(Math.floor(clamp01(t) * n), n - 1);
  const lt  = clamp01(t) * n - seg;
  const p0  = waypoints[Math.max(0, seg-1)];
  const p1  = waypoints[seg];
  const p2  = waypoints[Math.min(n, seg+1)];
  const p3  = waypoints[Math.min(n, seg+2)];
  return catmullRomSeg(p0, p1, p2, p3, lt);
}

// Build the snake path in absolute px within the sticky viewport.
// startCenters: where the 3 dots START after compression (top of viewport area).
// finalCenters: where the testimonial cards end up (middle/lower area).
function buildWaypoints(startCenters, finalCenters, VW, VH) {
  return [
    { x: startCenters[0].x, y: startCenters[0].y },  // dot 0 start
    { x: startCenters[1].x, y: startCenters[1].y },  // dot 1 start
    { x: startCenters[2].x, y: startCenters[2].y },  // dot 2 start
    { x: VW * 0.88,          y: VH * 0.44 },          // curve down right
    { x: VW * 0.50,          y: VH * 0.52 },          // sweep left
    { x: VW * 0.12,          y: VH * 0.60 },          // curve down left
    { x: finalCenters[0].x,  y: finalCenters[0].y }, // card 0 final
    { x: finalCenters[1].x,  y: finalCenters[1].y }, // card 1 final
    { x: finalCenters[2].x,  y: finalCenters[2].y }, // card 2 final
  ];
}

// ── Component ─────────────────────────────────────────────────────────────────
const NAVBAR_H = 70;

export default function Testimonials() {
  const wrapRef    = useRef(null);
  const stickyRef  = useRef(null);
  const tpFeatRef  = useRef(null); // ref passed into a hidden element to measure TP's real grid
  const [progress, setProgress]     = useState(0);
  const [viewport, setViewport]     = useState({ w: 1200, h: 730 });
  // Measured position of TP's feature grid relative to Testimonials sticky top.
  // We use this to position the clone cards at progress=0 exactly over the real ones.
  const [featRect, setFeatRect]     = useState(null);
  // Final testimonial card geometry (computed from sticky viewport size)
  const [cardGeo, setCardGeo]       = useState(null);

  // Measure TP's .tp__features position once at mount and on resize.
  const measureTPFeatures = useCallback(() => {
    const el = document.querySelector('.tp__features');
    if (!el || !stickyRef.current) return;
    const elR   = el.getBoundingClientRect();
    const stR   = stickyRef.current.getBoundingClientRect();
    // Position relative to the sticky layer's own top-left corner
    setFeatRect({
      top:    elR.top  - stR.top,
      left:   elR.left - stR.left,
      width:  elR.width,
      height: elR.height,
    });
  }, []);

  const measureViewport = useCallback(() => {
    if (!stickyRef.current) return;
    const r = stickyRef.current.getBoundingClientRect();
    setViewport({ w: r.width, h: r.height });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const vh   = window.innerHeight;
      const p    = clamp01(-rect.top / (rect.height - vh));
      setProgress(p);
    };
    const onResize = () => {
      measureTPFeatures();
      measureViewport();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    // Initial measurements — slight delay so TP has painted
    setTimeout(() => { measureTPFeatures(); measureViewport(); }, 100);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [measureTPFeatures, measureViewport]);

  // Compute testimonial card geometry from viewport size
  useEffect(() => {
    const { w, h } = viewport;
    const COLS = 3, GAP = 20, HPAD = 52;
    const totalW = w - HPAD * 2;
    const cw = (totalW - (COLS-1)*GAP) / COLS;
    const ch = Math.min(280, h * 0.38);
    const cardY = h * 0.38; // testimonial cards sit in the middle of the viewport
    const centers = Array.from({ length: 3 }, (_, i) => ({
      x: HPAD + i*(cw+GAP) + cw/2,
      y: cardY + ch/2,
    }));
    setCardGeo({ cw, ch, cardY, centers, HPAD });
  }, [viewport]);

  if (!featRect || !cardGeo) {
    // Not yet measured — render skeleton (hidden, just takes up space for scroll math)
    return <div className="ts" ref={wrapRef} />;
  }

  // ── Per-card geometry for the 4 feature card clones ─────────────────────
  // Feature cards sit in a 2×2 grid within featRect
  const fGAP = 10;
  const fCW  = (featRect.width - fGAP) / 2;
  const fCH  = (featRect.height - fGAP) / 2;
  const featureCards = [
    { left: featRect.left,           top: featRect.top,           w: fCW, h: fCH }, // top-left
    { left: featRect.left+fCW+fGAP,  top: featRect.top,           w: fCW, h: fCH }, // top-right
    { left: featRect.left,           top: featRect.top+fCH+fGAP,  w: fCW, h: fCH }, // bottom-left
    { left: featRect.left+fCW+fGAP,  top: featRect.top+fCH+fGAP,  w: fCW, h: fCH }, // bottom-right
  ];
  // Centers of the 4 feature cards
  const featureCenters = featureCards.map(c => ({
    x: c.left + c.w/2, y: c.top + c.h/2,
  }));

  // The 3 dot start positions (after card 3 merges into card 2):
  // dot 0 = card 0 center, dot 1 = card 1 center, dot 2 = midpoint of cards 2+3
  const dotStartCenters = [
    featureCenters[0],
    featureCenters[1],
    { x: (featureCenters[2].x + featureCenters[3].x)/2,
      y: (featureCenters[2].y + featureCenters[3].y)/2 },
  ];

  // ── Animation values ──────────────────────────────────────────────────────
  const tpSlide    = easeInOut(band(progress, TP_SLIDE_S, TP_SLIDE_E));
  const tpCoverY   = -tpSlide * viewport.h;
  const bgOpacity  = easeOut(band(progress, 0.05, TP_SLIDE_E));
  const headerT    = easeOut(band(progress, HEADER_S, HEADER_E));
  const ctaT       = easeOut(band(progress, CTA_S, CTA_E));
  const expandT    = easeInOut(band(progress, EXPAND_S, EXPAND_E));
  const snakeP     = easeInOut(band(progress, SNAKE_S, SNAKE_E));
  const compressT  = easeInOut(band(progress, COMPRESS_S, COMPRESS_E));

  // Build waypoints & compute dot positions
  const waypoints = buildWaypoints(dotStartCenters, cardGeo.centers, viewport.w, viewport.h);

  // ── Per-circle state ──────────────────────────────────────────────────────
  // 3 circles: each compresses from its feature-card start, snakes, then expands
  const circles = Array.from({ length: 3 }, (_, i) => {
    // Start center (compressed-to-circle center)
    const sc = dotStartCenters[i];
    // Bead position on snake path
    const beadT    = clamp01(snakeP - i * BEAD_OFFSET);
    const snakePt  = samplePath(waypoints, beadT);
    // During compress: positions stay at feature-card centers,
    // size shrinks from card size to circle size.
    // Card size for this dot: for dots 0+1 it's a single card; dot 2 is average of 2 cards.
    const srcW = i < 2 ? featureCards[i].w : (featureCards[2].w + featureCards[3].w)/2 + fGAP;
    const srcH = i < 2 ? featureCards[i].h : (featureCards[2].h + featureCards[3].h)/2;
    // Current width/height: lerp from card size → circle → card (testimonial)
    const cw = srcW + (CIRCLE_SIZE - srcW) * compressT * (1 - expandT)
               + (cardGeo.cw - srcW) * expandT;
    const ch = srcH + (CIRCLE_SIZE - srcH) * compressT * (1 - expandT)
               + (cardGeo.ch - srcH) * expandT;
    // Border radius: card → circle → card
    const circleRatio = compressT * (1 - expandT);
    const br = 14 + (Math.min(CIRCLE_SIZE,CIRCLE_SIZE)/2 - 14) * circleRatio;
    // Position: before full compress → at feature card center; after → snaking
    const ex  = snakePt.x + (cardGeo.centers[i].x - snakePt.x) * expandT;
    const ey  = snakePt.y + (cardGeo.centers[i].y - snakePt.y) * expandT;
    const px  = compressT < 1 ? sc.x : ex;
    const py  = compressT < 1 ? sc.y : ey;
    // Content visibility: feature card content fades out, testimonial content fades in
    const featureContentOpacity = Math.max(0, 1 - compressT * 2.5);
    const testimonialContentOpacity = easeOut(band(progress, EXPAND_S + 0.08, EXPAND_E));
    return { px, py, cw, ch, br, featureContentOpacity, testimonialContentOpacity,
             feature: FEATURES[i], testimonial: TESTIMONIALS[i] };
  });

  // 4th feature card fades/shrinks independently (merges toward dot 2)
  const card3Compress = easeInOut(band(progress, COMPRESS_S, COMPRESS_E - 0.04));
  const card3Center   = featureCenters[3];
  const card3TargetX  = dotStartCenters[2].x;
  const card3TargetY  = dotStartCenters[2].y;
  const card3X = card3Center.x + (card3TargetX - card3Center.x) * card3Compress;
  const card3Y = card3Center.y + (card3TargetY - card3Center.y) * card3Compress;
  const card3W = featureCards[3].w * (1 - card3Compress * 0.85);
  const card3H = featureCards[3].h * (1 - card3Compress * 0.85);
  const card3Opacity = 1 - card3Compress;

  return (
    <div className="ts" ref={wrapRef}>
      <div className="ts__sticky" ref={stickyRef}
        style={{ background: `rgba(194,164,129,${bgOpacity})` }}>

        {/* ── TP cover: slides up taking the background with it ── */}
        <div className="ts__cover" style={{ transform: `translateY(${tpCoverY}px)` }} />

        {/* ── Header ── */}
        <div className="ts__header" style={{
          opacity: headerT,
          transform: `translateY(${(1-headerT)*28}px)`,
        }}>
          <div className="ts__eyebrow">Proof of Scale</div>
          <h2 className="ts__headline">Built to sound like the room<br />you want to sell into.</h2>
          <p className="ts__body">
            Investor-focused credibility needs sharp positioning and believable proof.
            These testimonials are written with acquisition, follow-up, and management
            realities in mind.
          </p>
        </div>

        {/* ── Animation layer: circles morphing between feature cards and testimonials ── */}
        <div className="ts__anim-layer">

          {/* 4th feature card (merges/shrinks into dot 2) */}
          {card3Compress < 0.99 && (
            <div className="ts__feature-card" style={{
              left: card3X - card3W/2,
              top:  card3Y - card3H/2,
              width: card3W, height: card3H,
              opacity: card3Opacity,
              borderRadius: 14,
            }}>
              <div className="ts__feature-inner" style={{ opacity: Math.max(0, 1 - card3Compress * 3) }}>
                <div className="ts__feat-icon"><IconTrophy /></div>
                <div className="ts__feat-title">{FEATURES[3].title}</div>
                <p className="ts__feat-desc">{FEATURES[3].desc}</p>
              </div>
            </div>
          )}

          {/* 3 main animated circles */}
          {circles.map(({ px, py, cw, ch, br,
            featureContentOpacity, testimonialContentOpacity,
            feature, testimonial }, i) => (
            <div key={i} className="ts__morph-card" style={{
              left: px - cw/2,
              top:  py - ch/2,
              width: cw, height: ch,
              borderRadius: br,
            }}>
              {/* Feature card content (fades out during compress) */}
              <div className="ts__feature-inner" style={{ opacity: featureContentOpacity, position:'absolute', inset:0 }}>
                <div className="ts__feat-icon"><feature.Icon /></div>
                <div className="ts__feat-title">{feature.title}</div>
                <p className="ts__feat-desc">{feature.desc}</p>
              </div>
              {/* Testimonial card content (fades in during expand) */}
              <div className="ts__testimonial-inner" style={{ opacity: testimonialContentOpacity, position:'absolute', inset:0 }}>
                <div className="ts__star"><IconStar /></div>
                <p className="ts__quote">{testimonial.quote}</p>
                <div className="ts__divider" />
                <div className="ts__name">{testimonial.name}</div>
                <div className="ts__role">{testimonial.role}</div>
              </div>
            </div>
          ))}
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
            <h2 className="ts__cta-headline">Stop losing deals to<br />poor follow-up.</h2>
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
