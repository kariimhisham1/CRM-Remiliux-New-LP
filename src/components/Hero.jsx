import React, { useEffect, useRef, useState } from 'react';
import DashboardCard from './DashboardCard';
import building from '../assets/building.png';
import './Hero.css';

const STATS = [
  { icon: '👥', value: '2,500+', label: 'Active Agents' },
  { icon: '📋', value: '$1.2B+', label: 'Closed Deals' },
  { icon: '✓', value: '98%+', label: 'Client Satisfaction' },
  { icon: '🛡', value: '24/7', label: 'Support' },
];

export default function Hero() {
  const cardRef = useRef(null);
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Progress: 0 when section top hits bottom of viewport, 1 when it's scrolled out
      const total = windowH + rect.height * 0.5;
      const scrolled = windowH - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Interpolate card transform based on scroll
  const rotateX = 18 - scrollProgress * 18;       // 18deg → 0deg
  const scale = 0.82 + scrollProgress * 0.18;      // 0.82 → 1.0
  const translateY = scrollProgress * -20;          // slight upward lift

  return (
    <section className="hero" ref={sectionRef}>
      {/* Background */}
      <div className="hero__bg">
        <img src={building} alt="Remiliux building" className="hero__bg-img" />
        <div className="hero__bg-overlay" />
      </div>

      {/* Content */}
      <div className="hero__content">
        <div className="hero__left">
          <div className="hero__eyebrow">All-in-One Real Estate CRM</div>

          <h1 className="hero__headline">
            Elevate Your<br />
            Real Estate<br />
            Business
          </h1>

          <p className="hero__sub">
            Manage leads, clients, properties, and deals in one powerful
            platform built for modern real estate professionals.
          </p>

          <div className="hero__ctas">
            <button className="hero__btn-primary">Start Free Trial</button>
            <button className="hero__btn-secondary">
              <span className="hero__play">▶</span>
              Watch Demo
            </button>
          </div>
        </div>

        {/* Dashboard card with scroll-driven 3D tilt */}
        <div className="hero__card-wrap" ref={cardRef}>
          <div
            className="hero__card-3d"
            style={{
              transform: `perspective(1200px) rotateX(${rotateX}deg) scale(${scale}) translateY(${translateY}px)`,
            }}
          >
            <DashboardCard />
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="hero__stats">
        {STATS.map(s => (
          <div key={s.label} className="hero__stat">
            <span className="hero__stat-icon">{s.icon}</span>
            <div>
              <div className="hero__stat-value">{s.value}</div>
              <div className="hero__stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
