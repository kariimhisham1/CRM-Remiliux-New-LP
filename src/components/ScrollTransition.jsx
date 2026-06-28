import React, { useEffect, useRef, useState } from 'react';
import building from '../assets/Building.png';
import logo from '../assets/Logo.png';
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

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const scrolled = -rect.top;
      const totalScroll = rect.height - windowH;
      const p = Math.max(0, Math.min(1, scrolled / totalScroll));
      setProgress(p);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Phase 1 (0 → 0.30): card fades/slides in from left edge to right hero position
  // Phase 2 (0.30 → 0.60): card flips 0 → 90deg (front disappears)
  // Phase 3 (0.60 → 0.80): card flips 90 → 180deg (back revealed)
  // Phase 4 (0.80 → 1.0): back face expands to fill full viewport

  const phase1 = Math.min(1, progress / 0.30);
  const phase2 = Math.max(0, Math.min(1, (progress - 0.30) / 0.30));
  const phase3 = Math.max(0, Math.min(1, (progress - 0.60) / 0.20));
  const phase4 = Math.max(0, Math.min(1, (progress - 0.80) / 0.20));

  const rotateY = phase2 * 90 + phase3 * 90;

  // Card starts off-screen left, settles to right side of hero
  const cardOpacity = phase1;
  const cardTranslateX = (1 - phase1) * -420;

  // Background: dark hero → cream as back face reveals
  const bgProgress = phase3;

  // Stage expands from card size to full viewport during phase 4
  const baseW = 720;
  const baseH = 440;
  const targetW = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const targetH = typeof window !== 'undefined' ? window.innerHeight : 900;
  const stageW = baseW + phase4 * (targetW - baseW);
  const stageH = baseH + phase4 * (targetH - baseH);

  // Border radius collapses as it fills screen
  const borderRadius = 16 * (1 - phase4);

  // Hero content fades out as flip begins
  const heroOpacity = Math.max(0, 1 - phase2 * 2);

  return (
    <div className="st" ref={wrapRef}>
      <div className="st__sticky">

        {/* Dark hero background */}
        <div className="st__bg-dark" style={{ opacity: 1 - bgProgress }}>
          <img src={building} alt="" className="st__bg-img" />
          <div className="st__bg-overlay" />
        </div>

        {/* Cream background for back face */}
        <div className="st__bg-cream" style={{ opacity: bgProgress }} />

        {/* Hero content — left side, fades as flip starts */}
        <div className="st__hero-content" style={{ opacity: heroOpacity, pointerEvents: heroOpacity < 0.1 ? 'none' : 'auto' }}>
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

        {/* The flipping card — right side of hero */}
        <div className="st__card-area">
          <div
            className="st__stage"
            style={{ width: stageW, height: stageH }}
          >
            <div
              className="st__flipper"
              style={{
                transform: `translateX(${cardTranslateX}px) perspective(1400px) rotateY(${rotateY}deg)`,
                opacity: cardOpacity,
                borderRadius: borderRadius,
              }}
            >
              {/* Front face — Dashboard */}
              <div className="st__face st__face--front" style={{ borderRadius }}>
                <DashboardCard />
              </div>

              {/* Back face — Why Teams */}
              <div className="st__face st__face--back" style={{ borderRadius }}>
                <WhyTeamsBack />
              </div>
            </div>
          </div>

          {/* Scroll hint — visible only at start */}
          <div className="st__scroll-hint" style={{ opacity: Math.max(0, 1 - phase1 * 3) }}>
            <div className="st__scroll-label">Scroll to explore</div>
            <div className="st__scroll-arrow">↓</div>
          </div>
        </div>

        {/* Stats bar — fades out as flip begins */}
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
