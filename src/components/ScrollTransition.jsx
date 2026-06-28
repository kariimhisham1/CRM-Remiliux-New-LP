import React, { useEffect, useRef, useState } from 'react';
import building from '../assets/Building.png';
import DashboardCard from './DashboardCard';
import WhyTeamsBack from './WhyTeamsBack';
import './ScrollTransition.css';

const STATS = [
  { icon: '👥', value: '2,500+', label: 'Active Agents' },
  { icon: '📋', value: '$1.2B+', label: 'Closed Deals' },
  { icon: '✓', value: '98%+', label: 'Client Satisfaction' },
  { icon: '🛡', value: '24/7', label: 'Support' },
];

const NAV_H = 64;
const CARD_PADDING = 48;

export default function ScrollTransition() {
  const wrapRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [vw, setVw] = useState(window.innerWidth);
  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    const onResize = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const totalScroll = rect.height - vh;
      const p = Math.max(0, Math.min(1, -rect.top / totalScroll));
      setProgress(p);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [vh]);

  // Single unified phase: flip + zoom happen together (0 → 0.65)
  // Phase pause (0.65 → 1.00): card fully expanded, building visible, shimmer plays
  const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const flipZoomP = easeInOut(Math.min(1, progress / 0.65));
  const pauseP    = Math.max(0, Math.min(1, (progress - 0.65) / 0.35));

  // Rotation: 0 → -180deg as flipZoomP goes 0→1
  const rotateY = -(flipZoomP * 180);

  // Size: card starts at BASE, grows to TARGET simultaneously with flip
  const BASE_W = 700;
  const BASE_H = 430;
  const TARGET_W = vw - CARD_PADDING * 2;
  const TARGET_H = vh - NAV_H - CARD_PADDING * 2;

  const stageW = BASE_W + flipZoomP * (TARGET_W - BASE_W);
  const stageH = BASE_H + flipZoomP * (TARGET_H - BASE_H);

  // Border radius: 16 → 10 as card expands
  const radius = Math.round(16 - flipZoomP * 6);

  // Center X: interpolates from right-column center → viewport center
  const rightColStart  = 96 + 500 + 40;
  const rightColCenter = rightColStart + (vw - rightColStart - 64) / 2;
  const viewCenter     = vw / 2;
  const centerX = rightColCenter + flipZoomP * (viewCenter - rightColCenter);
  const centerY = NAV_H + (vh - NAV_H) / 2;

  // Hero text fades out in first 30% of flip
  const heroOpacity = Math.max(0, 1 - (progress / 0.30) * 1.5);

  // Background overlay fades as card expands (tied to flipZoomP)
  const overlayOpacity  = 1 - flipZoomP * 0.75;
  const creamBgOpacity  = flipZoomP * 0.18;

  // shimmer animProgress for WhyTeamsBack — starts mid-flip, peaks during pause
  const shimmerProgress = Math.min(1, flipZoomP * 0.5 + pauseP);

  return (
    <div className="st" ref={wrapRef}>
      <div className="st__sticky">

        <div className="st__bg-building">
          <img src={building} alt="" className="st__bg-img" />
        </div>
        <div className="st__bg-overlay" style={{ opacity: overlayOpacity }} />
        <div className="st__bg-cream"   style={{ opacity: creamBgOpacity }} />

        {/* Hero text */}
        <div
          className="st__hero-content"
          style={{
            opacity: heroOpacity,
            pointerEvents: heroOpacity < 0.05 ? 'none' : 'auto',
          }}
        >
          <div className="st__eyebrow">All-in-One Real Estate CRM</div>
          <h1 className="st__headline">
            Elevate Your<br />Real Estate<br />Business
          </h1>
          <p className="st__sub">
            Manage leads, clients, properties, and deals in one powerful
            platform built for modern real estate professionals.
          </p>
          <div className="st__ctas">
            <button className="st__btn-primary">Start Free Trial</button>
            <button className="st__btn-secondary">
              <span className="st__play">▶</span>Watch Demo
            </button>
          </div>
        </div>

        {/* Card — flips and zooms simultaneously */}
        <div
          className="st__stage"
          style={{
            width: stageW,
            height: stageH,
            borderRadius: radius,
            left: centerX,
            top: centerY,
            zIndex: 3,
          }}
        >
          <div
            className="st__flipper"
            style={{
              transform: `perspective(1400px) rotateY(${rotateY}deg)`,
            }}
          >
            <div className="st__face st__face--front" style={{ borderRadius: radius }}>
              <DashboardCard />
            </div>
            <div className="st__face st__face--back" style={{ borderRadius: radius }}>
              <WhyTeamsBack animProgress={shimmerProgress} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="st__stats" style={{ opacity: heroOpacity }}>
          {STATS.map(s => (
            <div key={s.label} className="st__stat">
              <span className="st__stat-icon">{s.icon}</span>
              <div>
                <div className="st__stat-value">{s.value}</div>
                <div className="st__stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
