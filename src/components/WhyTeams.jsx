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
   plus an explicit pause, so there's always a deliberate hold
   between transitions and the math can't silently overlap.

   intro hold → flip → PAUSE → merge → PAUSE → timeline slide
   → PAUSE → integrations + pills → PAUSE (final, holds to 1.0)
   ─────────────────────────────────────────────────────────── */
const easeInOut = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easeOut = t => 1 - Math.pow(1 - t, 2.5);
const clamp01 = n => Math.max(0, Math.min(1, n));
const band = (p, start, end) => clamp01((p - start) / (end - start));
const lerp = (a, b, t) => a + (b - a) * t;

const HEADER_START = 0.04, HEADER_END = 0.15;

const FLIP_START = 0.05, FLIP_STAGGER = 0.026, FLIP_DUR = 0.09;
const FLIP_END = FLIP_START + 5 * FLIP_STAGGER + FLIP_DUR;          // ~0.275

const PAUSE_1 = 0.07;
const MERGE_START = FLIP_END + PAUSE_1;                              // ~0.345
const MERGE_STAGGER = 0.02, MERGE_DUR = 0.10;
const MERGE_SHAPE_END = MERGE_START + 5 * MERGE_STAGGER + MERGE_DUR; // ~0.545

const PAUSE_2 = 0.06;
const TIMELINE_START = MERGE_SHAPE_END + PAUSE_2;                     // ~0.605
const TIMELINE_DUR = 0.11;
const TIMELINE_END = TIMELINE_START + TIMELINE_DUR;                  // ~0.715

const PAUSE_3 = 0.05;
const INT_START = TIMELINE_END + PAUSE_3;                            // ~0.765
const INT_HEAD_DUR = 0.05;
const INT_HEAD_END = INT_START + INT_HEAD_DUR;                       // ~0.815

const PILL_START = INT_START + 0.03;                                 // ~0.795
const PILL_STAGGER = 0.018, PILL_DUR = 0.06;
// PILL end ≈ 0.945 — remaining ~0.055 of total scroll is a pure final pause.

/* ── Geometry shared between the 6 mini-cards and the two overlay panels ── */
const COL_GAP = 1.3, ROW_GAP = 2.6;          // % gaps in the ORIGINAL 3x2 grid
const RIGHT_X = 51, RIGHT_W = 49;            // target rect the cards merge into
const LEFT_W = 49;                           // timeline panel's rect (mirror of RIGHT)
const CARD_RADIUS = 12, PANEL_RADIUS = 14;

function cardGeometry(i, shapeT) {
  const col = i % 3, row = Math.floor(i / 3);
  const startW = (100 - 2 * COL_GAP) / 3;
  const startH = (100 - ROW_GAP) / 2;
  const startX = col * (startW + COL_GAP);
  const startY = row * (startH + ROW_GAP);

  const endW = RIGHT_W / 3;
  const endH = 50;
  const endX = RIGHT_X + col * endW;
  const endY = row * endH;

  return {
    left: lerp(startX, endX, shapeT),
    top: lerp(startY, endY, shapeT),
    width: lerp(startW, endW, shapeT),
    height: lerp(startH, endH, shapeT),
  };
}

function cardCorners(i, shapeT) {
  const col = i % 3, row = Math.floor(i / 3);
  const isTop = row === 0, isBottom = row === 1;
  const isLeftCol = col === 0, isRightCol = col === 2;
  const flat = lerp(CARD_RADIUS, 0, shapeT);
  const outer = lerp(CARD_RADIUS, PANEL_RADIUS, shapeT);
  return {
    borderTopLeftRadius: isTop && isLeftCol ? outer : flat,
    borderTopRightRadius: isTop && isRightCol ? outer : flat,
    borderBottomLeftRadius: isBottom && isLeftCol ? outer : flat,
    borderBottomRightRadius: isBottom && isRightCol ? outer : flat,
  };
}

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

  /* ---------- Phase 2: cards merge into one vertical panel ---------- */
  const shapeTs = SET_A.map((_, i) => {
    const start = MERGE_START + i * MERGE_STAGGER;
    return easeInOut(band(progress, start, start + MERGE_DUR));
  });
  const maxShapeT = Math.max(...shapeTs, 0);

  // Workflow text fades in on top of the merged shape only once it has
  // essentially finished assembling — content swap reads as "complete."
  const wfTextOpacity = easeOut(band(progress, MERGE_SHAPE_END - 0.06, MERGE_SHAPE_END + 0.04));

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

          {/* ---------- Stage: cards merge directly into the two overlay panels ---------- */}
          <div className="wt__cards-stage">

            <div className="wt__cards">
              {SET_A.map((frontCard, i) => {
                const backCard = SET_B[i];
                const rotateY = cardFlips[i] * 180;
                const shapeT = shapeTs[i];
                const geo = cardGeometry(i, shapeT);
                const corners = cardCorners(i, shapeT);
                const contentOpacity = 1 - easeInOut(clamp01((shapeT - 0.5) / 0.5));
                const seamAlpha = 0.16 * (1 - shapeT);
                const shadowAlpha = 0.25 * (1 - shapeT * 0.8);

                return (
                  <div
                    key={i}
                    className="wt__card-scene"
                    style={{
                      left: `${geo.left}%`,
                      top: `${geo.top}%`,
                      width: `${geo.width}%`,
                      height: `${geo.height}%`,
                    }}
                  >
                    <div className="wt__card-flipper" style={{ transform: `perspective(900px) rotateY(${rotateY}deg)` }}>
                      <div
                        className="wt__card wt__card--front"
                        style={{ ...corners, borderColor: `rgba(201,168,76,${seamAlpha})`, boxShadow: `0 4px 20px rgba(0,0,0,${shadowAlpha})` }}
                      >
                        <div className="wt__card-icon" style={{ opacity: contentOpacity }}>{frontCard.icon}</div>
                        <div className="wt__card-title" style={{ opacity: contentOpacity }}>{frontCard.title}</div>
                        <p className="wt__card-desc" style={{ opacity: contentOpacity }}>{frontCard.desc}</p>
                      </div>
                      <div
                        className="wt__card wt__card--back"
                        style={{ ...corners, borderColor: `rgba(201,168,76,${seamAlpha})`, boxShadow: `0 4px 20px rgba(0,0,0,${shadowAlpha})` }}
                      >
                        <div className="wt__card-icon" style={{ opacity: contentOpacity }}>{backCard.icon}</div>
                        <div className="wt__card-title" style={{ opacity: contentOpacity }}>{backCard.title}</div>
                        <p className="wt__card-desc" style={{ opacity: contentOpacity }}>{backCard.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Workflow Intelligence text — fades in on top of the merged card shape */}
            <div
              className="wt__workflow-overlay"
              style={{
                left: `${RIGHT_X}%`,
                width: `${RIGHT_W}%`,
                opacity: wfTextOpacity,
                pointerEvents: wfTextOpacity > 0.5 ? 'auto' : 'none',
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

            {/* Timeline panel — its own element, slides in from the left */}
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
