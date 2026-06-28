import React, { useEffect, useRef, useState } from 'react';
import './WhyTeams.css';

const FEATURES = [
  { icon: '📋', title: 'Lead Management', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '🔔', title: 'Smart Follow-Up Automation', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '💬', title: 'SMS Campaigns', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '✉️', title: 'Email Campaigns', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '📞', title: 'Voicemail Drops', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '⚙️', title: 'Pipeline Management', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '📱', title: 'Dialpad Integration', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '📅', title: 'Calendar Management', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '✅', title: 'Task Management', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '👥', title: 'Team Accountability', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '📊', title: 'Reporting & Analytics', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '📈', title: 'Deal Lifecycle Tracking', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
];

export default function WhyTeams() {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const [frameVisible, setFrameVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [bgProgress, setBgProgress] = useState(0);

  // Background color morph — driven by scroll position entering the section
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Start morphing when section top hits bottom of viewport
      // Complete when section top hits viewport center
      const p = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH * 0.6)));
      setBgProgress(p);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Frame slide-up — triggers when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFrameVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Cards stagger in after frame appears
  useEffect(() => {
    if (!frameVisible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.idx);
            setTimeout(() => {
              setVisibleCards(prev => new Set([...prev, idx]));
            }, idx * 55);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );
    const cards = sectionRef.current?.querySelectorAll('.why__card');
    cards?.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [frameVisible]);

  // Interpolate background: dark building tone → warm taupe
  const easeOut = t => 1 - Math.pow(1 - t, 2.5);
  const p = easeOut(bgProgress);

  // #1a1208 (dark warm brown) → #c4aa8f (taupe)
  const r = Math.round(26  + p * (196 - 26));
  const g = Math.round(18  + p * (170 - 18));
  const b = Math.round(8   + p * (143 - 8));
  const bgColor = `rgb(${r}, ${g}, ${b})`;

  return (
    <section className="why" ref={sectionRef} style={{ background: bgColor }}>
      <div
        ref={frameRef}
        className={`why__inner ${frameVisible ? 'why__inner--visible' : ''}`}
      >
        <div className="why__header">
          <div className="why__eyebrow">Platform Capabilities</div>
          <h2 className="why__headline">
            Built for operators who need<br />
            control, visibility, and<br />
            conversion at scale.
          </h2>
          <p className="why__body">
            Every surface is designed to help acquisition teams execute faster without losing clarity. The
            product language stays CRM-native while the presentation stays premium.
          </p>
        </div>

        <div className="why__cards">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className={`why__card ${visibleCards.has(i) ? 'why__card--visible' : ''}`}
              data-idx={i}
            >
              <div className="why__card-icon"><span>{f.icon}</span></div>
              <div className="why__card-body">
                <div className="why__card-title">{f.title}</div>
                <p className="why__card-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
