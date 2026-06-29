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

const STEPS = [
  { icon: '🔔', title: 'Lead Arrives', desc: 'Via web form, ad, import, referral, or direct response captured instantly.' },
  { icon: '💬', title: 'Text Sent', desc: 'AI-matched SMS is launched immediately with contextual personalization.' },
  { icon: '✉️', title: 'Email Sent', desc: 'A branded email reinforces credibility and defines next best actions.' },
  { icon: '📞', title: 'Voicemail Drop', desc: 'A smart voicemail is delivered when no response is detected.' },
];

const STATS = [
  { label: 'Total delivery rate', value: '99.2%' },
  { label: 'Email response uplift', value: '+47%' },
  { label: 'Appointment recovery rate', value: '2.4x' },
];

const PILLS = [
  { icon: '🔗', label: 'CRM' },
  { icon: '✉️', label: 'Email' },
  { icon: '💬', label: 'SMS' },
  { icon: '📅', label: 'Calendars' },
  { icon: '📝', label: 'Lead Forms' },
  { icon: '🗄️', label: 'Database' },
];

/* ───────────────────────────────────────────────────────────
   TIMELINE — every phase end is derived from the previous one
   plus an explicit pause, so transitions can't drift or overlap.

   intro hold → flip → PAUSE → crossfade to panel → PAUSE →
   timeline slide → PAUSE → integrations + pills → PAUSE (final)
   ─────────────────────────────────────────────────────────── */
const easeInOut = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easeOut = t => 1 - Math.pow(1 - t, 2.5);
const clamp01 = n => Math.max(0, Math.min(1, n));
const band = (p, start, end) => clamp01((p - start) / (end - start));

const HEADER_START = 0.04, HEADER_END = 0.15;

const FLIP_START = 0.05, FLIP_STAGGER = 0.026, FLIP_DUR = 0.09;
const FLIP_END = FLIP_START + 5 * FLIP_STAGGER + FLIP_DUR;          // ~0.275

const PAUSE_1 = 0.07;
const CROSSFADE_START = FLIP_END + PAUSE_1;                          // ~0.345
const CROSSFADE_DUR = 0.12;
const CROSSFADE_END = CROSSFADE_START + CROSSFADE_DUR;              // ~0.465

const PAUSE_2 = 0.06;
const TIMELINE_START = CROSSFADE_END + PAUSE_2;                      // ~0.525
const TIMELINE_DUR = 0.11;
const TIMELINE_END = TIMELINE_START + TIMELINE_DUR;                  // ~0.635

const PAUSE_3 = 0.05;
const INT_START = TIMELINE_END + PAUSE_3;                            // ~0.685
const INT_HEAD_DUR = 0.05;
const INT_HEAD_END = INT_START + INT_HEAD_DUR;                       // ~0.735

const PILL_START = INT_START + 0.03;                                 // ~0.715
const PILL_STAGGER = 0.018, PILL_DUR = 0.06;
// last pill finishes ~0.865 — rest of the scroll is a generous final pause.

const RIGHT_X = 51, RIGHT_W = 49;  // workflow panel rect
const LEFT_W = 49;                 // timeline panel rect (mirrors RIGHT)

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
      setProgress(clamp01(scrolled / totalScroll));

      const bgP = clamp01((vh - rect.top) / (vh * 0.6));
      setBgProgress(bgP);

      if (rect.top < vh * 0.9) setFrameVisible(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ---------- Background morph ---------- */
  const bp = easeOut(bgProgress);
  const bgColor = `rgb(${Math.round(26 + bp * 170)},${Math.round(18 + bp * 152)},${Math.round(8 + bp * 135)})`;

  /* ---------- Header crossfade ---------- */
  const headerFlip = easeInOut(band(progress, HEADER_START, HEADER_END));
  const header1Opacity = 1 - headerFlip;
  const header2Opacity = headerFlip;

  /* ---------- Phase 1: flip ---------- */
  const cardFlips = SET_A.map((_, i) => {
    const start = FLIP_START + i * FLIP_STAGGER;
    return easeInOut(band(progress, start, start + FLIP_DUR));
  });

  /* ---------- Phase 2: simple crossfade from cards-grid to panel ---------- */
  const crossfadeT = easeOut(band(progress, CROSSFADE_START, CROSSFADE_END));
  const cardsOpacity = 1 - crossfadeT;
  const workflowOpacity = crossfadeT;

  /* ---------- Phase 3: timeline panel slides in from the left ---------- */
  const timelineT = easeOut(band(progress, TIMELINE_START, TIMELINE_END));
  const timelineOpacity = timelineT;
  const timelineTranslateX = (1 - timelineT) * -48;

  /* ---------- Phase 4: integrations heading + pills ---------- */
  const intHeadT = easeOut(band(progress, INT_START, INT_HEAD_END));
  const intGrowT = easeOut(band(progress, INT_START - 0.02, INT_START + 0.05));
  const pillProgress = i => {
    const start = PILL_START + i * PILL_STAGGER;
    return easeOut(band(progress, start, start + PILL_DUR));
  };

  return (
    <div className="wt" ref={wrapRef}>
      <div className="wt__sticky" style={{ background: bgColor }}>
        <div className={`wt__frame ${frameVisible ? 'wt__frame--visible' : ''}`}>

          {/* Header A */}
          <div
            className="wt__header"
            style={{ opacity: header1Opacity, position: 'absolute', pointerEvents: header1Opacity < 0.05 ? 'none' : 'auto' }}
          >
            <div className="wt__eyebrow">Platform Capabilities</div>
            <h2 className="wt__headline">Built for operators who need<br />control and conversion.</h2>
            <p className="wt__body">Lead operations, communication, and follow-up — all in one system.</p>
          </div>

          {/* Header B */}
          <div
            className="wt__header"
            style={{ opacity: header2Opacity, position: 'absolute', pointerEvents: header2Opacity < 0.05 ? 'none' : 'auto' }}
          >
            <div className="wt__eyebrow">Platform Capabilities</div>
            <h2 className="wt__headline">Visibility, accountability,<br />and deal intelligence.</h2>
            <p className="wt__body">Pipeline, reporting, and team performance — built into every layer.</p>
          </div>

          <div className="wt__header-spacer" />

          {/* ---------- Stage: cards-grid crossfades straight into the two panels ---------- */}
          <div className="wt__cards-stage">

            {/* PHASE 1: the 6 flipping cards, normal CSS grid — fades out for phase 2 */}
            <div
              className="wt__cards"
              style={{ opacity: cardsOpacity, pointerEvents: cardsOpacity > 0.05 ? 'auto' : 'none' }}
            >
              {SET_A.map((frontCard, i) => {
                const backCard = SET_B[i];
                const rotateY = cardFlips[i] * 180;
                return (
                  <div key={i} className="wt__card-scene">
                    <div className="wt__card-flipper" style={{ transform: `perspective(900px) rotateY(${rotateY}deg)` }}>
                      <div className="wt__card wt__card--front">
                        <div className="wt__card-icon">{frontCard.icon}</div>
                        <div className="wt__card-title">{frontCard.title}</div>
                        <p className="wt__card-desc">{frontCard.desc}</p>
                      </div>
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

            {/* PHASE 2: Workflow Intelligence panel — fades in as the cards fade out */}
            <div
              className="wt__workflow-overlay"
              style={{
                left: `${RIGHT_X}%`,
                width: `${RIGHT_W}%`,
                opacity: workflowOpacity,
                pointerEvents: workflowOpacity > 0.5 ? 'auto' : 'none',
              }}
            >
              <div className="wt__workflow-eyebrow">Workflow Intelligence</div>
              <h3 className="wt__workflow-headline">Multi-channel automation,<br />managed like an asset.</h3>
              <p className="wt__workflow-body">
                The automation layer protects a premium system of control sequences, time
                windows, response routing, and appointment creation with zero manual lift.
              </p>
              <div className="wt__stat-list">
                {STATS.map((s, i) => (
                  <div className="wt__stat-row" key={i}>
                    <span>{s.label}</span>
                    <strong>{s.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* PHASE 3: Timeline panel — its own element, slides in from the left */}
            <div
              className="wt__timeline-panel"
              style={{
                width: `${LEFT_W}%`,
                opacity: timelineOpacity,
                transform: `translateX(${timelineTranslateX}px)`,
                pointerEvents: timelineOpacity > 0.5 ? 'auto' : 'none',
              }}
            >
              {STEPS.map((s, i) => (
                <div className="wt__timeline-step" key={i}>
                  <div className="wt__timeline-icon">{s.icon}</div>
                  <div className="wt__timeline-copy">
                    <div className="wt__timeline-steplabel">STEP {i + 1}</div>
                    <div className="wt__timeline-title">{s.title}</div>
                    <p className="wt__timeline-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PHASE 4: Connected Systems heading + integration pills.
              maxHeight grows from 0 so it doesn't reserve empty space earlier. */}
          <div
            className="wt__integrations"
            style={{
              maxHeight: `${intGrowT * 230}px`,
              marginTop: `${intGrowT * 18}px`,
              opacity: intHeadT,
              transform: `translateY(${(1 - intHeadT) * 22}px)`,
            }}
          >
            <div className="wt__eyebrow">Connected Systems</div>
            <h3 className="wt__integrations-headline">
              Integrations that fit the stack serious<br />acquisition teams already use.
            </h3>
            <p className="wt__integrations-body">
              The ecosystem is deliberately presented as enterprise-grade infrastructure, not a
              patchwork of plugins. Each connection extends the operating system.
            </p>
            <div className="wt__pills">
              {PILLS.map((p, i) => {
                const ps = pillProgress(i);
                return (
                  <div className="wt__pill" key={i} style={{ opacity: ps, transform: `translateX(${(1 - ps) * -40}px)` }}>
                    <span className="wt__pill-icon">{p.icon}</span>
                    <span className="wt__pill-label">{p.label}</span>
                    <span className="wt__pill-tag">Native</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
