import React, { useEffect, useRef, useState } from 'react';

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

const CSS = `
.ae { height: 600vh; position: relative; }
.ae__sticky {
  position: sticky; top: 0; height: 100vh;
  background: #c4aa8f;
  display: flex; flex-direction: column; justify-content: center;
  padding: 80px 48px 24px; box-sizing: border-box; overflow: hidden; gap: 20px;
}
.ae__eyebrow {
  font-size: 10px; font-weight: 600; letter-spacing: 0.16em;
  text-transform: uppercase; color: #C9A84C; margin-bottom: 10px;
}
.ae__headline {
  font-family: var(--font-display, serif);
  font-size: clamp(22px, 2.6vw, 34px); font-weight: 800;
  color: #1a1509; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 10px;
}
.ae__body { font-size: 12px; line-height: 1.65; color: #5a4a35; max-width: 560px; }
.ae__card {
  background: #1a1408; border-radius: 20px;
  border: 1px solid rgba(201,168,76,0.14);
  display: grid; grid-template-columns: 1fr 1fr;
  overflow: hidden; flex: 1; min-height: 0;
  box-shadow: 0 8px 48px rgba(0,0,0,0.4);
}
.ae__left {
  padding: 28px 32px; border-right: 1px solid rgba(201,168,76,0.1);
  display: flex; flex-direction: column; overflow: hidden;
}
.ae__step { display: flex; gap: 14px; position: relative; padding-bottom: 18px; }
.ae__step:last-child { padding-bottom: 0; }
.ae__step-icon {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(201,168,76,0.12); border: 1px solid rgba(201,168,76,0.25);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; flex-shrink: 0; z-index: 1;
}
.ae__step-line {
  position: absolute; left: 16px; top: 32px; bottom: 0;
  width: 1px; background: rgba(201,168,76,0.15);
}
.ae__step-label {
  font-size: 9px; font-weight: 600; letter-spacing: 0.14em;
  text-transform: uppercase; color: #C9A84C; margin-bottom: 2px;
}
.ae__step-title { font-size: 13px; font-weight: 600; color: #f5ead8; margin-bottom: 3px; }
.ae__step-desc { font-size: 11px; line-height: 1.5; color: rgba(245,234,216,0.4); margin: 0; }
.ae__right {
  padding: 28px 32px; display: flex; flex-direction: column;
  gap: 14px; overflow: hidden;
}
.ae__right-eyebrow {
  font-size: 9px; font-weight: 600; letter-spacing: 0.14em;
  text-transform: uppercase; color: #C9A84C; margin-bottom: 6px;
}
.ae__right-headline {
  font-family: var(--font-display, serif);
  font-size: clamp(16px, 1.8vw, 24px); font-weight: 700;
  color: #f5ead8; line-height: 1.15; margin-bottom: 8px;
}
.ae__right-body { font-size: 11px; line-height: 1.6; color: rgba(245,234,216,0.4); margin: 0; }
.ae__rotating-cards { position: relative; height: 36px; }
.ae__rotating-card {
  position: absolute; left: 0; right: 0; height: 5px;
  background: rgba(201,168,76,0.18); border-radius: 3px;
  transform-origin: center top; will-change: transform, opacity;
}
.ae__stats {
  display: flex; flex-direction: column;
  border-top: 1px solid rgba(201,168,76,0.1);
  padding-top: 14px; margin-top: auto;
}
.ae__stat-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
  will-change: transform, opacity;
}
.ae__stat-label { font-size: 11px; color: rgba(245,234,216,0.55); }
.ae__stat-value { font-size: 13px; font-weight: 600; color: #C9A84C; }
.ae__integrations { flex-shrink: 0; }
.ae__integrations-eyebrow {
  font-size: 9px; font-weight: 600; letter-spacing: 0.14em;
  text-transform: uppercase; color: rgba(26,20,8,0.5); margin-bottom: 8px;
}
.ae__integrations-track { display: flex; gap: 8px; overflow: hidden; }
.ae__integration-pill {
  display: flex; align-items: center; gap: 8px;
  background: #1a1408; border: 1px solid rgba(201,168,76,0.15);
  border-radius: 10px; padding: 9px 14px; white-space: nowrap; flex-shrink: 0;
}
.ae__integration-icon { font-size: 13px; }
.ae__integration-name { font-size: 11px; font-weight: 500; color: #f5ead8; }
.ae__integration-badge {
  font-size: 8px; font-weight: 700; letter-spacing: 0.1em; color: #C9A84C;
  background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.2);
  border-radius: 4px; padding: 2px 4px;
}
`;

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

  const phase1 = Math.min(1, progress / 0.40);
  const phase2 = easeOut(Math.max(0, Math.min(1, (progress - 0.40) / 0.30)));
  const phase3 = Math.max(0, Math.min(1, (progress - 0.70) / 0.15));
  const phase4 = Math.max(0, Math.min(1, (progress - 0.85) / 0.15));

  const cardAnims = [0,1,2,3,4,5].map(i => {
    const start = i * 0.13;
    const raw = Math.max(0, Math.min(1, (phase1 - start) / 0.25));
    return easeInOut(raw);
  });

  const headerP = easeOut(Math.min(1, progress * 6));

  return (
    <>
      <style>{CSS}</style>
      <div className="ae" ref={wrapRef}>
        <div className="ae__sticky">

          <div style={{ opacity: headerP, transform: `translateY(${(1-headerP)*20}px)` }}>
            <div className="ae__eyebrow">Automation Engine</div>
            <h2 className="ae__headline">
              A follow-up system that moves<br />with the urgency of the opportunity.
            </h2>
            <p className="ae__body">
              Leads should not depend on memory. Remiliux orchestrates a disciplined chain of text,
              email, voicemail, reminders, response handling, and appointment creation with executive
              visibility at every step.
            </p>
          </div>

          <div className="ae__card">
            <div className="ae__left" style={{ opacity: phase2, transform: `translateX(${(1-phase2)*-80}px)` }}>
              {STEPS.map((step, i) => (
                <div key={i} className="ae__step">
                  <div className="ae__step-icon">{step.icon}</div>
                  <div>
                    <div className="ae__step-label">{step.step}</div>
                    <div className="ae__step-title">{step.title}</div>
                    <p className="ae__step-desc">{step.desc}</p>
                  </div>
                  {i < STEPS.length - 1 && <div className="ae__step-line" />}
                </div>
              ))}
            </div>

            <div className="ae__right">
              <div>
                <div className="ae__right-eyebrow">Workflow Intelligence</div>
                <h3 className="ae__right-headline">Multi-channel automation,<br />managed like an asset.</h3>
                <p className="ae__right-body">
                  The automation layer protects a premium system of control sequences,
                  time windows, response routing, and appointment creation with zero manual lift.
                </p>
              </div>

              <div className="ae__rotating-cards">
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} className="ae__rotating-card" style={{
                    top: i * 8,
                    opacity: cardAnims[i],
                    transform: `perspective(600px) rotateX(${(1-cardAnims[i])*90}deg)`,
                  }} />
                ))}
              </div>

              <div className="ae__stats">
                {STATS.map((stat, i) => {
                  const sp = easeOut(Math.max(0, Math.min(1, (phase3 - i*0.3*0.3) / 0.4)));
                  return (
                    <div key={i} className="ae__stat-row" style={{ opacity: sp, transform: `translateY(${(1-sp)*12}px)` }}>
                      <span className="ae__stat-label">{stat.label}</span>
                      <span className="ae__stat-value">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ opacity: easeOut(phase4), transform: `translateX(${(1-phase4)*120}px)` }}>
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
    </>
  );
}
