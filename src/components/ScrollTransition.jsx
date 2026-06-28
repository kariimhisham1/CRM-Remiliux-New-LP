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

  // Phase 1 (0.00 → 0.35): flip front → 90deg (front disappears)
  // Phase 2 (0.35 → 0.60): flip 90deg → 180deg (back revealed)
  // Phase 3 (0.60 → 1.00): stage expands to fill full viewport
  const phase1 = Math.min(1, progress / 0.35);
  const phase2 = Math.max(0, Math.min(1, (progress - 0.35) / 0.25));
  const phase3 = Math.max(0, Math.min(1, (progress - 0.60) / 0.40));

  // NEGATIVE rotation = flips the other direction (left/counter-clockwise)
  const rotateY = -(phase1 * 90 + phase2 * 90);

  const BASE_W = 680;
  const BASE_H = 420;

  // Phase 3: stage fills viewport exactly
  const stageW = BASE_W + phase3 * (vw - BASE_W);
  const stageH = BASE_H + phase3 * (vh - BASE_H);

  // Stage moves from right-column position to absolute 0,0 fill
  // At phase3=0: centered in right column. At phase3=1: covers full screen
  const stageTop = phase3 * -(/* offset to top */ 50); // handled via CSS transform
  const radius = Math.round(16 * (1 - phase3));

  const heroOpacity = Math.max(0, 1 - phase1 * 2);
  const darkBgOpacity = 1 - phase3;
  const creamBgOpacity = phase2 * 0.3 + phase3 * 0.7;
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

        {/* Card stage — starts right column, expands to full screen */}
        <div
          className="st__stage"
          style={{
            width: stageW,
            height: stageH,
            borderRadius: radius,
            // When phase3 > 0, break out of flex layout and cover the viewport
            ...(phase3 > 0 ? {
              position: 'fixed',
              top: `${(1 - phase3) * 50}%`,
              left: `${(1 - phase3) * 50}%`,
              transform: `translate(-${(1 - phase3) * 50}%, -${(1 - phase3) * 50}%)`,
              zIndex: 10,
            } : {
              position: 'relative',
            }),
          }}
        >
          <div
            className="st__flipper"
            style={{
              transform: `perspective(1400px) rotateY(${rotateY}deg)`,
            }}
          >
            {/* Front face — back is now rotateY(+180) since we flip negative */}
            <div className="st__face st__face--front" style={{ borderRadius: radius }}>
              <DashboardCard />
            </div>
            {/* Back face — pre-rotated -180deg to match negative flip direction */}
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
