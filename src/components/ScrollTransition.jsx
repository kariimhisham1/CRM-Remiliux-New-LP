import React, { useEffect, useRef, useState } from 'react';
import DashboardCard from './DashboardCard';
import WhyTeamsBack from './WhyTeamsBack';
import './ScrollTransition.css';

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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Phase 1 (0->0.35): card slides in from right and centers
  // Phase 2 (0.35->0.65): card flips 0->90deg (front disappears)
  // Phase 3 (0.65->0.85): card flips 90->180deg (back revealed)
  // Phase 4 (0.85->1.0): back face zooms to fill screen
  const phase1 = Math.min(1, progress / 0.35);
  const phase2 = Math.max(0, Math.min(1, (progress - 0.35) / 0.3));
  const phase3 = Math.max(0, Math.min(1, (progress - 0.65) / 0.2));
  const phase4 = Math.max(0, (progress - 0.85) / 0.15);

  const rotateY = phase2 * 90 + phase3 * 90;
  const scale = 1 + phase4 * 4;
  const bgProgress = phase3;

  // Card starts small/right and moves to center
  const cardOpacity = phase1;
  const cardTranslateX = (1 - phase1) * 300;

  return (
    <div className="st" ref={wrapRef}>
      <div className="st__sticky">
        <div className="st__bg-dark" style={{ opacity: 1 - bgProgress * 0.95 }} />
        <div className="st__bg-cream" style={{ opacity: bgProgress }} />

        <div className="st__stage">
          <div
            className="st__flipper"
            style={{
              transform: 'translateX(' + cardTranslateX + 'px) perspective(1400px) rotateY(' + rotateY + 'deg) scale(' + scale + ')',
              opacity: cardOpacity,
            }}
          >
            <div className="st__face st__face--front">
              <DashboardCard />
            </div>
            <div className="st__face st__face--back">
              <WhyTeamsBack />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
