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

  // ACTION zone: 0 → 0.60 (flip + zoom lock-step, same easing, same progress)
  // PAUSE zone:  0.60 → 1.0 (card holds, shimmer plays)
  const raw = Math.min(1, progress / 0.60);

  // Both flip and zoom use identical easing so they move in perfect sync
  const easeOut = t => 1 - Math.pow(1 - t, 2.8);
  const p = easeOut(raw);

  // Flip: 0 → -180deg
  const rotateY = -(p * 180);

  // Zoom: card grows from BASE → TARGET, starting immediately at scroll=0
  const BASE_W = 680;
  const BASE_H = 420;
  const TARGET_W = vw - CARD_PADDING * 2;
  const TARGET_H = vh - NAV_H - CARD_PADDING * 2;

  const stageW = BASE_W + p * (TARGET_W - BASE_W);
  const stageH = BASE_H + p * (TARGET_H - BASE_H);
  const radius = Math.round(16 - p * 6);

  // Center: card moves from right-column → viewport center, same p
  const rightColStart  = 96 + 500 + 40;
  const rightColCenter = rightColStart + (vw - rightColStart - 64) / 2;
  const viewCenter     = vw / 2;
  const centerX = rightColCenter + p * (viewCenter - rightColCenter);
  const centerY = NAV_H + (vh - NAV_H) / 2;

  // Hero fades in first 25% of action
  const heroOpacity = Math.max(0, 1 - (raw / 0.25) * 1.4);

  // Overlay fades with the zoom so building reveals as card grows
  const overlayOpacity = 1 - p * 0.78;
  const creamBgOpacity = p * 0.15;

  const pauseP = Math.max(0, Math.min(1, (progress - 0.60) / 0.40));
  const shimmerProgress = Math.min(1, p * 0.3 + pauseP);

  return (
    <div className="st" ref={wrapRef}>
      <div className="st__sticky">

        <div className="st__bg-building">
          <img src={building} alt="" className="st__bg-img" />
        </div>
        <div className="st__bg-overlay" style={{ opacity: overlayOpacity }} />
        <div className="st__bg-cream"   style={{ opacity: creamBgOpacity }} />

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

        {/* Card — flip and zoom are pixel-perfectly synchronized */}
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
