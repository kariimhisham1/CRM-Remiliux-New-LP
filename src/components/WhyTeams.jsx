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

/* ── Progress bands (fractions of total scroll, 0 → 1) ──
   0.00–0.16  Header A → Header B crossfade
   0.05–0.25  PHASE 1   6 cards flip front → back (wave)
   0.22–0.41  PHASE 2   cards collapse + shrink toward right, Workflow panel forms underneath
   0.38–0.54  PHASE 3   timeline panel slides in from the left
   0.56–0.66  PHASE 4a  "Connected Systems" heading/copy fades up
   0.60–0.815 PHASE 4b  integration pills slide in left → right, staggered
   0.82–1.00  PHASE 5   hold — nothing changes, natural scroll pause
*/
const HEADER_START = 0.03, HEADER_END = 0.16;

const FLIP_START = 0.05, FLIP_STAGGER = 0.022, FLIP_DUR = 0.09;

const PHASE2_START = 0.22, PHASE2_CARD_STAGGER = 0.018, PHASE2_CARD_DUR = 0.10;
const WF_START = 0.30, WF_END = 0.46;

const TL_START = 0.38, TL_END = 0.54;

const INT_HEAD_START = 0.56, INT_HEAD_END = 0.66;
const PILL_START = 0.60, PILL_STAGGER = 0.025, PILL_DUR = 0.09;

const easeInOut = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easeOut = t => 1 - Math.pow(1 - t, 2.5);
const clamp01 = n => Math.max(0, Math.min(1, n));
const band = (p, start, end) => clamp01((p - start) / (end - start));

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
      const p = clamp01(scrolled / totalScroll);
      setProgress(p);

      const bgP = clamp01((vh - rect.top) / (vh * 0.6));
      setBgProgress(bgP);

      if (rect.top < vh * 0.9) setFrameVisible(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ---------- Phase 1: flip ---------- */
  const cardFlips = SET_A.map((_, i) => {
    const start = FLIP_START + i * FLIP_STAGGER;
    return easeInOut(band(progress, start, start + FLIP_DUR));
  });

  /* ---------- Background morph ---------- */
  const bp = easeOut(bgProgress);
  const r = Math.round(26 + bp * (196 - 26));
  const g = Math.round(18 + bp * (170 - 18));
  const b = Math.round(8 + bp * (143 - 8));
  const bgColor = `rgb(${r},${g},${b})`;

  /* ---------- Header crossfade ---------- */
  const headerFlip = easeInOut(band(progress, HEADER_START, HEADER_END));
  const header1Opacity = 1 - headerFlip;
  const header2Opacity = headerFlip;

  /* ---------- Phase 2: cards collapse toward right ---------- */
  const cardCollapses = SET_A.map((_, i) => {
    const start = PHASE2_START + i * PHASE2_CARD_STAGGER;
    return easeInOut(band(progress, start, start + PHASE2_CARD_DUR));
  });
  const maxCollapse = Math.max(...cardCollapses, 0);

  /* ---------- Workflow panel (right) forms ---------- */
  const workflowRaw = band(progress, WF_START, WF_END);
  const workflowOpacity = easeOut(workflowRaw);
  const workflowScale = 0.92 + workflowOpacity * 0.08;
  const workflowTranslateY = (1 - workflowOpacity) * 18;

  /* ---------- Timeline panel (left) slides in ---------- */
  const timelineRaw = band(progress, TL_START, TL_END);
  const timelineEase = easeOut(timelineRaw);
  const timelineOpacity = timelineEase;
  const timelineTranslateX = (1 - timelineEase) * -64;

  /* ---------- Integrations heading ---------- */
  const intHeadRaw = easeOut(band(progress, INT_HEAD_START, INT_HEAD_END));
  const intHeadOpacity = intHeadRaw;
  const intHeadTranslateY = (1 - intHeadRaw) * 22;

  /* ---------- Integration pills, staggered left → right ---------- */
  const pillProgress = i => {
    const start = PILL_START + i * PILL_STAGGER;
    return easeOut(band(progress, start, start + PILL_DUR));
  };

  /* Visibility toggles so off-screen layers don't intercept clicks */
  const cardsLayerVisible = maxCollapse < 0.98;
  const panelLayerVisible = workflowOpacity > 0.02 || timelineOpacity > 0.02;

  return (
    <div className="wt" ref={wrapRef}>
      <div className="wt__sticky" style={{ background: bgColor }}>
        <div className={`wt__frame ${frameVisible ? 'wt__frame--visible' : ''}`}>

          {/* Header A */}
          <div
            className="wt__header"
            style={{
              opacity: header1Opacity,
              position: 'absolute',
              pointerEvents: header1Opacity < 0.05 ? 'none' : 'auto',
            }}
          >
            <div className="wt__eyebrow">Platform Capabilities</div>
            <h2 className="wt__headline">Built for operators who need<br />control and conversion.</h2>
            <p className="wt__body">Lead operations, communication, and follow-up — all in one system.</p>
          </div>

          {/* Header B */}
          <div
            className="wt__header"
            style={{
              opacity: header2Opacity,
              position: 'absolute',
              pointerEvents: header2Opacity < 0.05 ? 'none' : 'auto',
            }}
          >
            <div className="wt__eyebrow">Platform Capabilities</div>
            <h2 className="wt__headline">Visibility, accountability,<br />and deal intelligence.</h2>
            <p className="wt__body">Pipeline, reporting, and team performance — built into every layer.</p>
          </div>

          <div className="wt__header-spacer" />

          {/* ---------- Stage: cards-grid and the two-panel card occupy the same area ---------- */}
          <div className="wt__cards-stage">

            {/* PHASE 1 + 2: the 6 flipping / collapsing cards */}
            <div
              className="wt__cards"
              style={{
                opacity: cardsLayerVisible ? 1 : 0,
                pointerEvents: cardsLayerVisible ? 'auto' : 'none',
              }}
            >
              {SET_A.map((frontCard, i) => {
                const backCard = SET_B[i];
                const flip = cardFlips[i];
                const rotateY = flip * 180;

                const collapse = cardCollapses[i];
                const tx = collapse * 220;
                const ty = collapse * (i - 2.5) * 28;
                const scale = 1 - collapse * 0.65;
                const rotateZ = collapse * (i % 2 === 0 ? -8 : 8);
                const fadeOut = clamp01((collapse - 0.55) / 0.45);

                return (
                  <div
                    key={i}
                    className="wt__card-scene"
                    style={{
                      transform: `translate(${tx}px, ${ty}px) scale(${scale}) rotateZ(${rotateZ}deg)`,
                      opacity: 1 - fadeOut,
                    }}
                  >
                    <div
                      className="wt__card-flipper"
                      style={{ transform: `perspective(900px) rotateY(${rotateY}deg)` }}
                    >
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

            {/* PHASE 2 + 3: the two-panel "Workflow Intelligence" card */}
            <div
              className="wt__panelcard"
              style={{
                opacity: panelLayerVisible ? 1 : 0,
                pointerEvents: panelLayerVisible ? 'auto' : 'none',
              }}
            >
              {/* Left: 4-step timeline, slides in from the left */}
              <div
                className="wt__timeline-panel"
                style={{
                  opacity: timelineOpacity,
                  transform: `translateX(${timelineTranslateX}px)`,
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

              {/* Right: Workflow Intelligence, forms from the collapsing cards */}
              <div
                className="wt__workflow-panel"
                style={{
                  opacity: workflowOpacity,
                  transform: `scale(${workflowScale}) translateY(${workflowTranslateY}px)`,
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
            </div>
          </div>

          {/* PHASE 4: Connected Systems heading + integration pills */}
          <div
            className="wt__integrations"
            style={{
              opacity: intHeadOpacity,
              transform: `translateY(${intHeadTranslateY}px)`,
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
                  <div
                    className="wt__pill"
                    key={i}
                    style={{
                      opacity: ps,
                      transform: `translateX(${(1 - ps) * -40}px)`,
                    }}
                  >
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
