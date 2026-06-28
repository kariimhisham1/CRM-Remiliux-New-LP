import React, { useEffect, useRef, useState } from 'react';
import DashboardCard from './DashboardCard';
import './ScrollTransition.css';

export default function ScrollTransition() {
  const wrapRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Full sticky scroll range
      const scrolled = -rect.top;
      const totalScroll = rect.height - windowH;
      const p = Math.max(0, Math.min(1, scrolled / totalScroll));
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Phase 1 (0→0.5): card rotates from angled to flat, zooms in
  // Phase 2 (0.5→1): card fills screen, background transitions to cream
  const phase1 = Math.min(1, progress / 0.5);
  const phase2 = Math.max(0, (progress - 0.5) / 0.5);

  const rotateX = 28 * (1 - phase1);          // 28deg → 0deg
  const scale = 0.55 + phase1 * 0.45;          // 0.55 → 1.0
  const cardOpacity = 1;
  const bgOpacity = phase2;                     // dark bg fades out as cream fades in

  return (
    <div className="scroll-transition" ref={wrapRef}>
      <div className="scroll-transition__sticky">

        {/* Dark to cream background blend */}
        <div
          className="scroll-transition__bg-dark"
          style={{ opacity: 1 - bgOpacity * 0.9 }}
        />
        <div
          className="scroll-transition__bg-cream"
          style={{ opacity: bgOpacity }}
        />

        {/* The morphing card */}
        <div className="scroll-transition__stage">
          <div
            className="scroll-transition__card"
            style={{
              transform: `perspective(1400px) rotateX(${rotateX}deg) scale(${scale})`,
              opacity: cardOpacity,
              borderRadius: `${16 * (1 - phase2)}px`,
            }}
          >
            <DashboardCard />
          </div>
        </div>

      </div>
    </div>
  );
}
