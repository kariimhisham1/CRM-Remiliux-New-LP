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

  // Phase 1 (0.00 → 0.35): card flips front → 90deg
  // Phase 2 (0.35 → 0.60): card flips 90deg → back revealed
  // Phase 3 (0.60 → 1.00): back face stage expands to fill full viewport

  const phase1 = Math.min(1, progress / 0.35);
  const phase2 = Math.max(0, Math.min(1, (progress - 0.35) / 0.25));
  const phase3 = Math.max(0, Math.min(1, (progress - 0.60) / 0.40));

  const rotateY = phase1 * 90 + phase2 * 90;

  // Card is always fully visible from page load
  const BASE_W = 680;
  const BASE_H = 420;

  // Phase 3: stage grows from card size to full viewport
  const stageW = BASE_W + phase3 * (vw - BASE_W);
  const stageH = BASE_H + phase3 * (vh - BASE_H);
  const radius = Math.round(16 * (1 - phase3));

  // Hero text fades as flip starts
  const heroOpacity = Math.max(0, 1 - phase1 * 2);

  // Dark bg stays until back face fully expands
  const darkBgOpacity = 1 - phase3;

  // Cream bg: hint during phase2, full during phase3
  const creamBgOpacity = phase2 * 0.3 + phase3 * 0.7;

  // Scroll hint fades after slight scroll
  const scrollHintOpacity = Math.max(0, 1 - progress * 8);

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

        {/* Card — right side, always visible, grows in phase3 */}
        <div
          className="st__stage"
          style={{
            width: stageW,
            height: stageH,
            borderRadius: radius,
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

        {/* Scroll hint */}
        <div className="st__scroll-hint" style={{ opacity: scrollHintOpacity }}>
          <div className="st__scroll-label">Scroll to explore</div>
          <div className="st__scroll-arrow">↓</div>
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
