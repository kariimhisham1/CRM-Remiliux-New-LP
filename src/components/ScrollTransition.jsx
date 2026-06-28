import React, { useEffect, useRef, useState, useCallback } from 'react';
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

  // Phase 1 (0.00 → 0.25): card fades in already in position (no slide, just appear)
  // Phase 2 (0.25 → 0.55): card flips front → 90deg
  // Phase 3 (0.55 → 0.75): card flips 90deg → back revealed
  // Phase 4 (0.75 → 1.00): back face stage expands to fill full viewport

  const phase1 = Math.min(1, progress / 0.25);
  const phase2 = Math.max(0, Math.min(1, (progress - 0.25) / 0.30));
  const phase3 = Math.max(0, Math.min(1, (progress - 0.55) / 0.20));
  const phase4 = Math.max(0, Math.min(1, (progress - 0.75) / 0.25));

  const rotateY = phase2 * 90 + phase3 * 90;

  // Card dimensions — matches the screenshot proportions
  const BASE_W = 680;
  const BASE_H = 420;

  // Phase 4: stage grows from card size to full viewport
  const stageW = BASE_W + phase4 * (vw - BASE_W);
  const stageH = BASE_H + phase4 * (vh - BASE_H);

  // Border radius goes to 0 as card fills screen
  const radius = Math.round(16 * (1 - phase4));

  // Hero text fades as flip starts
  const heroOpacity = Math.max(0, 1 - phase2 * 2.5);

  // Dark bg stays until back face is fully expanded
  // Starts fading only when phase4 begins
  const darkBgOpacity = 1 - phase4;

  // Cream bg appears as back face reveals (phase3) and fills during phase4
  const creamBgOpacity = phase3 * 0.3 + phase4 * 0.7;

  // Card opacity fades in during phase1
  const cardOpacity = phase1;

  return (
    <div className="st" ref={wrapRef}>
      <div className="st__sticky">

        {/* Dark hero background — stays until phase4 */}
        <div
          className="st__bg-dark"
          style={{ opacity: darkBgOpacity }}
        >
          <img src={building} alt="" className="st__bg-img" />
          <div className="st__bg-overlay" />
        </div>

        {/* Cream background — comes in as back face fills */}
        <div
          className="st__bg-cream"
          style={{ opacity: creamBgOpacity }}
        />

        {/* Hero text — left side */}
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

        {/* Card stage — right side, expands to fill in phase4 */}
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
              opacity: cardOpacity,
            }}
          >
            {/* Front — Dashboard */}
            <div
              className="st__face st__face--front"
              style={{ borderRadius: radius }}
            >
              <DashboardCard />
            </div>

            {/* Back — Why Teams */}
            <div
              className="st__face st__face--back"
              style={{ borderRadius: radius }}
            >
              <WhyTeamsBack />
            </div>
          </div>
        </div>

        {/* Scroll hint — top of page only */}
        <div
          className="st__scroll-hint"
          style={{ opacity: Math.max(0, 1 - phase1 * 4) }}
        >
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
