import React, { useEffect, useRef, useState } from 'react';
import building from '../assets/Building.png';
import './Hero.css';

const STATS = [
  { icon: '👥', value: '2,500+', label: 'Active Agents' },
  { icon: '📋', value: '$1.2B+', label: 'Closed Deals' },
  { icon: '✓', value: '98%+', label: 'Client Satisfaction' },
  { icon: '🛡', value: '24/7', label: 'Support' },
];

export default function Hero() {
  return (
    <section className="hero">
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

        {/* Right side hint — scroll indicator */}
        <div className="hero__right">
          <div className="hero__scroll-hint">
            <div className="hero__scroll-label">Scroll to explore</div>
            <div className="hero__scroll-arrow">↓</div>
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
