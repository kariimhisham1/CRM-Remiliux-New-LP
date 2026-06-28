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

  // Phase 1 (0→0.5): card flips 0→90deg (front disappears at edge)
  // Phase 2 (0.5→0.8): card flips 90→180deg (back face revealed)
  // Phase 3 (0.8→1.0): back face zooms to fill screen
  const phase1 = Math.min(1, progress / 0.5);
  const phase2 = Math.max(0, Math.min(1, (progress - 0.5) / 0.3));
  const phase3 = Math.max(0, (progress - 0.8) / 0.2);

  const rotateY = phase1 * 90 + phase2 * 90; // 0 → 90 → 180
  const scale = 1 + phase3 * 3.5;
  const bgProgress = phase2;

  return (
    <div className="st" ref={wrapRef}>
      <div className="st__sticky">

        {/* Background layers */}
        <div className="st__bg-dark" style={{ opacity: 1 - bgProgress * 0.95 }} />
        <div className="st__bg-cream" style={{ opacity: bgProgress }} />

        {/* The 3D flip stage */}
        <div className="st__stage">
          <div
            className="st__flipper"
            style={{
              transform: `perspective(1400px) rotateY(${rotateY}deg) scale(${scale})`,
            }}
          >
            {/* FRONT FACE — Dashboard */}
            <div className="st__face st__face--front">
              <DashboardCard />
            </div>

            {/* BACK FACE — Why Teams section */}
            <div className="st__face st__face--back">
              <WhyTeamsBack />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
