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

// Navbar height — keeps expanded card below the nav
const NAV_H = 64;

export default function ScrollTransition() {
  const wrapRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [vw, setVw] = useState(window.innerWidth);
  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const totalScroll = rect.height - vh;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / totalScroll));
      setProgress(p);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [vh]);

  // Phase 1 (0.00 → 0.35): front flips to 90°
  // Phase 2 (0.35 → 0.60): 90° → back fully revealed
  // Phase 3 (0.60 → 1.00): card expands to fill sticky viewport
  const phase1 = Math.min(1, progress / 0.35);
  const phase2 = Math.max(0, Math.min(1, (progress - 0.35) / 0.25));
  const phase3 = Math.max(0, Math.min(1, (progress - 0.60) / 0.40));

  const rotateY = -(phase1 * 90 + phase2 * 90);

  // Card resting size in the right column
  const BASE_W = 700;
  const BASE_H = 430;

  // Available area below navbar
  const availH = vh - NAV_H;

  // Expand from BASE size → full available viewport (below navbar, full width)
  const stageW = BASE_W + phase3 * (vw - BASE_W);
  const stageH = BASE_H + phase3 * (availH - BASE_H);

  // Border radius collapses as card fills screen
  const radius = Math.round(16 * (1 - phase3));

  // During phase3 the card moves from right-column center → full viewport center
  // We keep it in the sticky container as absolute, centered
  // Right-column center X ≈ left edge of right column + half its width
  // Right column starts at ~500px (hero text) + 96px padding + 40px gap
  const rightColLeft = 500 + 96 + 40;
  const rightColCenter = rightColLeft + (vw - rightColLeft - 64) / 2; // 64 = right padding
  const viewportCenter = vw / 2;
  const centerX = rightColCenter + phase3 * (viewportCenter - rightColCenter);

  // Vertical: center in available area (below navbar)
  const centerY = NAV_H + availH / 2;

  const heroOpacity = Math.max(0, 1 - phase1 * 2);
  const darkBgOpacity = 1 - phase3;
  const creamBgOpacity = phase2 * 0.3 + phase3 * 0.7;

  return (
    <div className="st" ref={wrapRef}>
      <div className="st__sticky">

        {/* Dark hero background */}
        <div className="st__bg-dark" style={{ opacity: darkBgOpacity }}>
          <img src={building} alt="" className="st__bg-img" />
          <div className="st__bg-overlay" />
        </div>

        {/* Cream background */}
        <div className="st__bg-cream" style={{ opacity: creamBgOpacity }} />

        {/* Hero text — left */}
        <div
          className="st__hero-content"
          style={{
            opacity: heroOpacity,
            pointerEvents: heroOpacity < 0.05 ? 'none' : 'auto',
          }}
        >
          <div className="st__eyebrow">All-in-One Real Estate CRM</div>
          <h1 className="st__headline">
            Elevate Your<br />
            Real Estate<br />
            Business
          </h1>
          <p className="st__sub">
            Manage leads, clients, properties, and deals in one powerful
            platform built for modern real estate professionals.
          </p>
          <div className="st__ctas">
            <button className="st__btn-primary">Start Free Trial</button>
            <button className="st__btn-secondary">
              <span className="st__play">▶</span>
              Watch Demo
            </button>
          </div>
        </div>

        {/*
          Card: always position:absolute inside the sticky container.
          Centered via left/top + translate(-50%,-50%).
          During phase3 it moves to viewport center and expands to fill.
          NO position switching = NO jump/disappear.
        */}
        <div
          className="st__stage"
          style={{
            width: stageW,
            height: stageH,
            borderRadius: radius,
            position: 'absolute',
            left: centerX,
            top: centerY,
            transform: 'translate(-50%, -50%)',
            zIndex: phase3 > 0 ? 5 : 2,
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
              <WhyTeamsBack />
            </div>
          </div>
        </div>

        {/* Stats bar */}
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
