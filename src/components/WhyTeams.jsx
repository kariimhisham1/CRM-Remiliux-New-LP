import React, { useEffect, useRef, useState } from 'react';
import './WhyTeams.css';

const SET_A = [
  { icon: '📋', title: 'Lead Management', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '🔔', title: 'Smart Follow-Up Automation', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '💬', title: 'SMS Campaigns', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '✉️', title: 'Email Campaigns', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '📞', title: 'Voicemail Drops', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '📱', title: 'Dialpad Integration', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
];

const SET_B = [
  { icon: '⚙️', title: 'Pipeline Management', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '📅', title: 'Calendar Management', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '✅', title: 'Task Management', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '👥', title: 'Team Accountability', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '📊', title: 'Reporting & Analytics', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '📈', title: 'Deal Lifecycle Tracking', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
];

export default function WhyTeams() {
  const wrapRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [bgProgress, setBgProgress] = useState(0);
  const [frameVisible, setFrameVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScroll = rect.height - vh;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / totalScroll));
      setProgress(p);

      // Background morph on entry
      const bgP = Math.max(0, Math.min(1, (vh - rect.top) / (vh * 0.6)));
      setBgProgress(bgP);

      // Frame visible when section enters
      if (rect.top < vh * 0.9) setFrameVisible(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Flip phase: 0.2 → 0.8 of total scroll
  // Each card flips with stagger: card i starts at flipStart + i * stagger
  const FLIP_START = 0.20;
  const FLIP_END   = 0.80;
  const STAGGER    = 0.08; // delay between each card
  const FLIP_DUR   = 0.18; // duration per card

  const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const cardFlips = SET_A.map((_, i) => {
    const start = FLIP_START + i * STAGGER;
    const raw = Math.max(0, Math.min(1, (progress - start) / FLIP_DUR));
    return easeInOut(raw); // 0 = front, 1 = back fully shown
  });

  // Background morph: dark → taupe
  const easeOut = t => 1 - Math.pow(1 - t, 2.5);
  const bp = easeOut(bgProgress);
  const r = Math.round(26  + bp * (196 - 26));
  const g = Math.round(18  + bp * (170 - 18));
  const b = Math.round(8   + bp * (143 - 8));
  const bgColor = `rgb(${r},${g},${b})`;

  // Header: first set fades out, second fades in
  const headerFlip = easeInOut(Math.max(0, Math.min(1, (progress - 0.15) / 0.25)));
  const header1Opacity = 1 - headerFlip;
  const header2Opacity = headerFlip;

  return (
    <div className="wt" ref={wrapRef}>
      <div className="wt__sticky" style={{ background: bgColor }}>

        {/* Frame */}
        <div className={`wt__frame ${frameVisible ? 'wt__frame--visible' : ''}`}>

          {/* Header A */}
          <div className="wt__header" style={{ opacity: header1Opacity, position: 'absolute', pointerEvents: header1Opacity < 0.05 ? 'none' : 'auto' }}>
            <div className="wt__eyebrow">Platform Capabilities</div>
            <h2 className="wt__headline">Built for operators who need<br />control and conversion.</h2>
            <p className="wt__body">Lead operations, communication, and follow-up — all in one system.</p>
          </div>

          {/* Header B */}
          <div className="wt__header" style={{ opacity: header2Opacity, position: 'absolute', pointerEvents: header2Opacity < 0.05 ? 'none' : 'auto' }}>
            <div className="wt__eyebrow">Platform Capabilities</div>
            <h2 className="wt__headline">Visibility, accountability,<br />and deal intelligence.</h2>
            <p className="wt__body">Pipeline, reporting, and team performance — built into every layer.</p>
          </div>

          {/* Spacer to hold header height */}
          <div className="wt__header-spacer" />

          {/* 6 flipping cards */}
          <div className="wt__cards">
            {SET_A.map((frontCard, i) => {
              const backCard = SET_B[i];
              const flip = cardFlips[i];
              const rotateY = flip * 180;

              return (
                <div key={i} className="wt__card-scene">
                  <div
                    className="wt__card-flipper"
                    style={{ transform: `perspective(900px) rotateY(${rotateY}deg)` }}
                  >
                    {/* Front */}
                    <div className="wt__card wt__card--front">
                      <div className="wt__card-icon">{frontCard.icon}</div>
                      <div className="wt__card-title">{frontCard.title}</div>
                      <p className="wt__card-desc">{frontCard.desc}</p>
                    </div>
                    {/* Back */}
                    <div className="wt__card wt__card--back">
                      <div className="wt__card-icon">{backCard.icon}</div>
                      <div className="wt__card-title">{backCard.title}</div>
                      <p className="wt__card-desc">{backCard.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
