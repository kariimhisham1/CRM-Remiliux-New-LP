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

const easeInOut = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easeOut = t => 1 - Math.pow(1 - t, 2.5);
const clamp01 = n => Math.max(0, Math.min(1, n));
const band = (p, start, end) => clamp01((p - start) / (end - start));
const lerp = (a, b, t) => a + (b - a) * t;

/* ── Timeline: each phase end derives from the previous + a pause ── */
const HEADER_START = 0.04, HEADER_END = 0.15;

const FLIP_START = 0.05, FLIP_STAGGER = 0.026, FLIP_DUR = 0.09;
const FLIP_END = FLIP_START + 5 * FLIP_STAGGER + FLIP_DUR;            // ~0.275

const PAUSE_1 = 0.07;
const MERGE_START = FLIP_END + PAUSE_1;                                // ~0.345
const MERGE_STAGGER = 0.022, MERGE_DUR = 0.13;
const MERGE_END = MERGE_START + 5 * MERGE_STAGGER + MERGE_DUR;        // ~0.585

const PAUSE_2 = 0.06;
const TIMELINE_START = MERGE_END + PAUSE_2;                            // ~0.645
const TIMELINE_DUR = 0.11;
const TIMELINE_END = TIMELINE_START + TIMELINE_DUR;                   // ~0.755

const PAUSE_3 = 0.05;
const INT_START = TIMELINE_END + PAUSE_3;                              // ~0.805
const INT_HEAD_DUR = 0.05;
const INT_HEAD_END = INT_START + INT_HEAD_DUR;

const PILL_START = INT_START + 0.03;
const PILL_STAGGER = 0.016, PILL_DUR = 0.05;

/* ── Geometry: where the 6 cards merge into, in fractions of stage size ── */
const RIGHT_X_FRAC = 0.52, RIGHT_W_FRAC = 0.48;
const LEFT_W_FRAC = 0.49;
const COL_GAP_PX = 10, ROW_GAP_PX = 10;
const CARD_RADIUS = 12, PANEL_RADIUS = 14;

export default function WhyTeams() {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [bgProgress, setBgProgress] = useState(0);
  const [frameVisible, setFrameVisible] = useState(false);
  const [stageSize, setStageSize] = useState({ w: 1100, h: 360 });

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

  // Measure the stage in real pixels so the pull/scale math is exact —
  // not approximated through CSS percentage composition.
  useEffect(() => {
    if (!stageRef.current) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setStageSize({ w: width, h: height });
    });
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);

  const { w: stageW, h: stageH } = stageSize;

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

  /* ---------- Phase 2: cards pull right and connect ---------- */
  const startW = (stageW - 2 * COL_GAP_PX) / 3;
  const startH = (stageH - ROW_GAP_PX) / 2;
  const rightX = stageW * RIGHT_X_FRAC;
  const rightW = stageW * RIGHT_W_FRAC;
  const endW = rightW / 3;
  const endH = stageH / 2;

  const pullTs = SET_A.map((_, i) => {
    const start = MERGE_START + i * MERGE_STAGGER;
    return easeInOut(band(progress, start, start + MERGE_DUR));
  });
  const maxPullT = Math.max(...pullTs, 0);

  // Panel text fades in once the cards have essentially finished connecting.
  const wfTextOpacity = easeOut(band(progress, MERGE_END - 0.07, MERGE_END + 0.03));

  /* ---------- Phase 3: timeline panel slides in from the RIGHT ---------- */
  const timelineT = easeOut(band(progress, TIMELINE_START, TIMELINE_END));
  const timelineOpacity = timelineT;
  const timelineTranslateX = (1 - timelineT) * 64; // starts shifted right, settles at 0

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

          <div className="wt__cards-stage" ref={stageRef}>

            <div className="wt__cards">
              {SET_A.map((frontCard, i) => {
                const backCard = SET_B[i];
                const rotateY = cardFlips[i] * 180;
                const pullT = pullTs[i];

                const col = i % 3, row = Math.floor(i / 3);
                const sx = startW > 0 ? endW / startW : 1;
                const sy = startH > 0 ? endH / startH : 1;

                const startCenterX = col * (startW + COL_GAP_PX) + startW / 2;
                const startCenterY = row * (startH + ROW_GAP_PX) + startH / 2;
                const endCenterX = rightX + col * endW + endW / 2;
                const endCenterY = row * endH + endH / 2;
                const dx = endCenterX - startCenterX;
                const dy = endCenterY - startCenterY;

                const tx = dx * pullT;
                const ty = dy * pullT;

                // Mid-flight "landscape → portrait" flourish: peaks at the
                // halfway point of the pull, fully resolves back to the exact
                // target shape by the time the card lands — purely a flourish
                // during the journey, never distorts the final flush shape.
                const flourish = Math.sin(pullT * Math.PI);
                const PORTRAIT_FLOURISH = 0.4;
                const extraScaleX = 1 - flourish * PORTRAIT_FLOURISH;
                const extraScaleY = 1 + flourish * PORTRAIT_FLOURISH;

                const scaleX = lerp(1, sx, pullT) * extraScaleX;
                const scaleY = lerp(1, sy, pullT) * extraScaleY;

                // Only true outer corners of the merged block round toward the
                // panel radius; every interior seam flattens to 0 as it connects.
                const isTop = row === 0, isBottom = row === 1;
                const isLeftCol = col === 0, isRightCol = col === 2;
                const flat = lerp(CARD_RADIUS, 0, pullT);
                const outer = lerp(CARD_RADIUS, PANEL_RADIUS, pullT);

                const contentOpacity = 1 - clamp01(pullT / 0.6);
                const seamAlpha = 0.16 * (1 - pullT);
                const shadowAlpha = 0.25 * (1 - pullT * 0.8);

                const corners = {
                  borderTopLeftRadius: isTop && isLeftCol ? outer : flat,
                  borderTopRightRadius: isTop && isRightCol ? outer : flat,
                  borderBottomLeftRadius: isBottom && isLeftCol ? outer : flat,
                  borderBottomRightRadius: isBottom && isRightCol ? outer : flat,
                };

                return (
                  <div
                    key={i}
                    className="wt__card-scene"
                    style={{
                      left: `${col * (startW + COL_GAP_PX)}px`,
                      top: `${row * (startH + ROW_GAP_PX)}px`,
                      width: `${startW}px`,
                      height: `${startH}px`,
                      transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scaleX}, ${scaleY})`,
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

            {/* Workflow Intelligence text — fades in on top of the connected cards */}
            <div
              className="wt__workflow-overlay"
              style={{
                left: `${RIGHT_X_FRAC * 100}%`,
                width: `${RIGHT_W_FRAC * 100}%`,
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

            {/* Timeline panel — own element, now slides in from the RIGHT */}
            <div
              className="wt__timeline-panel"
              style={{
                width: `${LEFT_W_FRAC * 100}%`,
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

          {/* PHASE 4: Connected Systems heading + integration pills */}
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
