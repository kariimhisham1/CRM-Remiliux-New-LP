import React, { useEffect, useRef, useState } from 'react';
import './AutomationEngine.CSS';

const STEPS = [
  { icon: '🔔', step: 'Step 1', title: 'Lead Arrives', desc: 'Via web form, ad, import, referral, or direct response captured instantly.' },
  { icon: '💬', step: 'Step 2', title: 'Text Sent', desc: 'AI-matched SMS is launched immediately with contextual personalization.' },
  { icon: '✉️', step: 'Step 3', title: 'Email Sent', desc: 'A branded email reinforces credibility and defines next best actions.' },
  { icon: '📞', step: 'Step 4', title: 'Voicemail Drop', desc: 'A smart voicemail is delivered when no response is detected.' },
];

const STATS = [
  { label: 'Total delivery rate', value: '99.2%' },
  { label: 'Email response uplift', value: '+47%' },
  { label: 'Appointment recovery rate', value: '2.4x' },
];

const INTEGRATIONS = [
  { icon: '📱', name: 'Dialpad' },
  { icon: '✉️', name: 'Email' },
  { icon: '💬', name: 'SMS' },
  { icon: '📅', name: 'Calendars' },
  { icon: '📋', name: 'Lead Forms' },
  { icon: '🔗', name: 'Zapier' },
  { icon: '🏠', name: 'MLS' },
  { icon: '📊', name: 'Analytics' },
  { icon: '📱', name: 'Dialpad' },
  { icon: '✉️', name: 'Email' },
  { icon: '💬', name: 'SMS' },
  { icon: '📅', name: 'Calendars' },
];

export default function AutomationEngine() {
  const wrapRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const totalScroll = rect.height - vh;
      const p = Math.max(0, Math.min(1, -rect.top / totalScroll));
      setProgress(p);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [vh]);

  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeInOut = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

  // Phase 1 (0→0.40): 6 cards rotate vertically into right panel stack
  // Phase 2 (0.40→0.70): left panel slides in from left
  // Phase 3 (0.70→0.85): stats rows fade in one by one
  // Phase 4 (0.85→1.0): integrations slide in from right

  const phase1 = Math.min(1, progress / 0.40);
  const phase2 = easeOut(Math.max(0, Math.min(1, (progress - 0.40) / 0.30)));
  const phase3 = Math.max(0, Math.min(1, (progress - 0.70) / 0.15));
  const phase4 = Math.max(0, Math.min(1, (progress - 0.85) / 0.15));

  // Each of the 6 cards rotates in with stagger
  // They stack vertically on the right panel
  // Card i starts at phase1 = i * 0.14, duration 0.25
  const cardAnims = [0,1,2,3,4,5].map(i => {
    const start = i * 0.13;
    const raw = Math.max(0, Math.min(1, (phase1 - start) / 0.25));
    return easeInOut(raw);
  });

  // Cards we show in right panel (only first 4 visible as steps, rest collapse)
  // They rotate from horizontal (rotateX 90deg) to flat (0deg) as they stack
  const cardRotations = cardAnims.map(p => (1 - p) * 90);
  const cardOpacities = cardAnims.map(p => p);
  const cardTranslateY = cardAnims.map((p, i) => (1 - p) * -60 + (i * 0));

  // Left panel slides in from left
  const leftX = (1 - phase2) * -80;
  const leftOpacity = phase2;

  // Stats stagger
  const statP = STATS.map((_, i) => {
    const start = i * 0.3;
    return easeOut(Math.max(0, Math.min(1, (phase3 - start * 0.3) / 0.4)));
  });

  // Integration marquee — driven by phase4 + continuous offset
  const integrationX = (1 - phase4) * 120;

  // Background stays taupe from WhyTeams
  const bgOpacity = Math.min(1, progress * 4);

  return (
    <div className="ae" ref={wrapRef}>
      <div className="ae__sticky">

        {/* Section header */}
        <div
          className="ae__header"
          style={{
            opacity: easeOut(Math.min(1, progress * 6)),
            transform: `translateY(${(1 - easeOut(Math.min(1, progress * 6))) * 20}px)`,
          }}
        >
          <div className="ae__eyebrow">Automation Engine</div>
          <h2 className="ae__headline">
            A follow-up system that moves<br />
            with the urgency of the opportunity.
          </h2>
          <p className="ae__body">
            Leads should not depend on memory. Remiliux orchestrates a disciplined chain of text, email,
            voicemail, reminders, response handling, and appointment creation with executive visibility at every step.
          </p>
        </div>

        {/* Main card */}
        <div className="ae__card">

          {/* LEFT — timeline steps, slides in from left */}
          <div
            className="ae__left"
            style={{
              opacity: leftOpacity,
              transform: `translateX(${leftX}px)`,
            }}
          >
            {STEPS.map((step, i) => (
              <div key={i} className="ae__step">
                <div className="ae__step-icon">{step.icon}</div>
                <div className="ae__step-content">
                  <div className="ae__step-label">{step.step}</div>
                  <div className="ae__step-title">{step.title}</div>
                  <p className="ae__step-desc">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && <div className="ae__step-line" />}
              </div>
            ))}
          </div>

          {/* RIGHT — 6 cards rotate in vertically to build this panel */}
          <div className="ae__right">
            <div className="ae__right-header">
              <div className="ae__right-eyebrow">Workflow Intelligence</div>
              <h3 className="ae__right-headline">
                Multi-channel automation,<br />managed like an asset.
              </h3>
              <p className="ae__right-body">
                The automation layer protects a premium system of control sequences,
                time windows, response routing, and appointment creation with zero manual lift.
              </p>
            </div>

            {/* The 6 rotating cards stack here */}
            <div className="ae__rotating-cards">
              {[0,1,2,3,4,5].map(i => (
                <div
                  key={i}
                  className="ae__rotating-card"
                  style={{
                    opacity: cardOpacities[i],
                    transform: `
                      perspective(600px)
                      rotateX(${cardRotations[i]}deg)
                      translateY(${cardTranslateY[i]}px)
                    `,
                    zIndex: 6 - i,
                  }}
                />
              ))}
            </div>

            {/* Stats rows — fade in after cards settle */}
            <div className="ae__stats">
              {STATS.map((stat, i) => (
                <div
                  key={i}
                  className="ae__stat-row"
                  style={{
                    opacity: statP[i],
                    transform: `translateY(${(1 - statP[i]) * 12}px)`,
                  }}
                >
                  <span className="ae__stat-label">{stat.label}</span>
                  <span className="ae__stat-value">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* INTEGRATIONS — slide in from right */}
        <div
          className="ae__integrations"
          style={{
            opacity: easeOut(phase4),
            transform: `translateX(${integrationX}px)`,
          }}
        >
          <div className="ae__integrations-eyebrow">Connected Systems</div>
          <div className="ae__integrations-track">
            {INTEGRATIONS.map((item, i) => (
              <div key={i} className="ae__integration-pill">
                <span className="ae__integration-icon">{item.icon}</span>
                <span className="ae__integration-name">{item.name}</span>
                <span className="ae__integration-badge">NATIVE</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
