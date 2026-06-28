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
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / totalScroll));
      setProgress(p);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [vh]);

  // Phase 1 (0.00 → 0.35): flip front → 90deg
  // Phase 2 (0.35 → 0.60): flip 90deg → back revealed
  // Phase 3 (0.60 → 1.00): stage expands to fill full viewport
  const phase1 = Math.min(1, progress / 0.35);
  const phase2 = Math.max(0, Math.min(1, (progress - 0.35) / 0.25));
  const phase3 = Math.max(0, Math.min(1, (progress - 0.60) / 0.40));

  // Negative = counter-clockwise flip
  const rotateY = -(phase1 * 90 + phase2 * 90);

  const BASE_W = 700;
  const BASE_H = 430;

  // During phase3 the stage goes fixed and expands to cover viewport
  const isExpanding = phase3 > 0;
  const stageW = isExpanding ? BASE_W + phase3 * (vw - BASE_W) : BASE_W;
  const stageH = isExpanding ? BASE_H + phase3 * (vh - BASE_H) : BASE_H;
  const radius = Math.round(16 * (1 - phase3));

  // When expanding: stage moves from center of right-column to full screen
  // We use fixed positioning anchored to viewport center, then shift top/left to 0
  const expandTop = phase3 * (-50); // percent offset — handled via transform below
  
  const heroOpacity = Math.max(0, 1 - phase1 * 2);
  const darkBgOpacity = 1 - phase3;
  const creamBgOpacity = phase2 * 0.3 + phase3 * 0.7;

  // Ghost frame fix: hide the flipper's perspective container bg during mid-flip
  // by making the stage itself invisible at exactly 90deg (phase1=1, phase2=0)
  const atEdge = phase1 === 1 && phase2 === 0;

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

        {/* Card — right column normally, fixed+fullscreen during phase3 */}
        <div
          className="st__stage-wrapper"
          style={isExpanding ? {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          } : {
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <div
            className="st__stage"
            style={{
              width: stageW,
              height: stageH,
              borderRadius: radius,
              // Ghost fix: no background on the stage itself
              background: 'transparent',
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
