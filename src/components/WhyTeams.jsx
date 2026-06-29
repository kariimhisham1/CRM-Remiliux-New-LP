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
  { icon: '📱', label: 'Dialpad' },
  { icon: '✉️', label: 'Email' },
  { icon: '💬', label: 'SMS' },
  { icon: '📅', label: 'Calendars' },
  { icon: '📋', label: 'Lead Forms' },
  { icon: '🔗', label: 'Zapier' },
  { icon: '🏠', label: 'MLS' },
  { icon: '📊', label: 'Analytics' },
];

const easeInOut = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
const easeOut   = t => 1 - Math.pow(1-t, 3);
const easeOut2  = t => 1 - Math.pow(1-t, 2);
const clamp01   = n => Math.max(0, Math.min(1, n));
const band      = (p, s, e) => clamp01((p-s)/(e-s));

// ── Phase timing ──────────────────────────────────────────
const FLIP_S = 0.04, FLIP_STAGGER = 0.025, FLIP_DUR = 0.09;
const FLIP_E = FLIP_S + 5*FLIP_STAGGER + FLIP_DUR;       // ~0.26

const HEADER_S = FLIP_S, HEADER_E = FLIP_E;

// Cards fade out their labels as they shrink — start fading at merge begin
const FADE_S = FLIP_E + 0.04, FADE_E = FADE_S + 0.08;

// Cards shrink toward right panel area
const SHRINK_S = FLIP_E + 0.03, SHRINK_STAGGER = 0.018, SHRINK_DUR = 0.12;
const SHRINK_E = SHRINK_S + 5*SHRINK_STAGGER + SHRINK_DUR; // ~0.50

// Right panel (workflow) fades in as cards form it
const WF_S = SHRINK_S + 0.06, WF_E = SHRINK_E + 0.04;

// Timeline slides in from LEFT after cards have formed right panel
const TL_S = SHRINK_E + 0.04, TL_E = TL_S + 0.10;

// Integration section
const INT_S = TL_E + 0.05, INT_E = INT_S + 0.08;
const PILL_S = INT_S + 0.02, PILL_STAGGER = 0.015, PILL_DUR = 0.05;

export default function WhyTeams() {
  const wrapRef  = useRef(null);
  const stageRef = useRef(null);
  const [progress, setProgress]   = useState(0);
  const [bgProgress, setBgProgress] = useState(0);
  const [frameVisible, setFrameVisible] = useState(false);
  const [stageSize, setStageSize] = useState({ w: 1012, h: 360 });

  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const vh   = window.innerHeight;
      const p    = clamp01(-rect.top / (rect.height - vh));
      setProgress(p);
      setBgProgress(clamp01((vh - rect.top) / (vh * 0.6)));
      if (rect.top < vh * 0.9) setFrameVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!stageRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      if (width > 0) setStageSize({ w: width, h: height });
    });
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);

  const { w: SW, h: SH } = stageSize;

  // Background morph
  const bp = easeOut2(bgProgress);
  const bgColor = `rgb(${Math.round(26+bp*170)},${Math.round(18+bp*152)},${Math.round(8+bp*135)})`;

  // Header crossfade
  const hFlip = easeInOut(band(progress, HEADER_S, HEADER_E));

  // Card flip (phase 1)
  const cardFlips = SET_A.map((_, i) => {
    const s = FLIP_S + i * FLIP_STAGGER;
    return easeInOut(band(progress, s, s + FLIP_DUR));
  });

  // Card content fade out before shrink
  const contentFade = 1 - easeOut(band(progress, FADE_S, FADE_E));

  // Card geometry
  const GAP = 8;
  const COLS = 3, ROWS = 2;
  const cellW = (SW - (COLS-1)*GAP) / COLS;
  const cellH = (SH - (ROWS-1)*GAP) / ROWS;

  // RIGHT panel = right 48% of stage
  const RIGHT_FRAC = 0.48;
  const rightX     = SW * (1 - RIGHT_FRAC);
  const rightW     = SW * RIGHT_FRAC;
  // Each card's target: stack 3×2 inside the right panel area, zero gaps (flush)
  const tgtW = rightW / COLS;
  const tgtH = SH / ROWS;

  const shrinkTs = SET_A.map((_, i) => {
    const s = SHRINK_S + i * SHRINK_STAGGER;
    return easeInOut(band(progress, s, s + SHRINK_DUR));
  });

  // Workflow Intelligence panel opacity
  const wfOpacity = easeOut(band(progress, WF_S, WF_E));

  // Timeline panel slides in from LEFT
  const tlT       = easeOut(band(progress, TL_S, TL_E));
  const tlOpacity = tlT;
  const tlSlide   = (1 - tlT) * -56; // starts -56px left, slides to 0

  // Integrations
  const intT    = easeOut(band(progress, INT_S, INT_E));
  const intGrow = easeOut(band(progress, INT_S - 0.01, INT_S + 0.06));
  const pillP   = i => easeOut(band(progress, PILL_S + i*PILL_STAGGER, PILL_S + i*PILL_STAGGER + PILL_DUR));

  return (
    <div className="wt" ref={wrapRef}>
      <div className="wt__sticky" style={{ background: bgColor }}>
        <div className={`wt__frame ${frameVisible ? 'wt__frame--visible' : ''}`}>

          {/* Header A */}
          <div className="wt__header" style={{ opacity: 1-hFlip, position:'absolute', pointerEvents: hFlip>0.9?'none':'auto' }}>
            <div className="wt__eyebrow">Platform Capabilities</div>
            <h2 className="wt__headline">Built for operators who need<br />control and conversion.</h2>
            <p className="wt__body">Lead operations, communication, and follow-up — all in one system.</p>
          </div>

          {/* Header B */}
          <div className="wt__header" style={{ opacity: hFlip, position:'absolute', pointerEvents: hFlip<0.1?'none':'auto' }}>
            <div className="wt__eyebrow">Automation Engine</div>
            <h2 className="wt__headline">A follow-up system that moves<br />with the urgency of the opportunity.</h2>
            <p className="wt__body">Leads should not depend on memory. Remiliux orchestrates a disciplined chain of touch-points.</p>
          </div>

          <div className="wt__header-spacer" />

          {/* ── STAGE ── */}
          <div className="wt__cards-stage" ref={stageRef}>

            {/* 6 flipping + shrinking cards */}
            <div className="wt__cards">
              {SET_A.map((front, i) => {
                const back   = SET_B[i];
                const rotY   = cardFlips[i] * 180;
                const shrink = shrinkTs[i];

                const col = i % COLS, row = Math.floor(i / COLS);
                // Start position (centre of cell)
                const startCX = col*(cellW+GAP) + cellW/2;
                const startCY = row*(cellH+GAP) + cellH/2;
                // Target position (centre in right panel)
                const tgtCX = rightX + col*tgtW + tgtW/2;
                const tgtCY = row*tgtH + tgtH/2;

                const cx = startCX + (tgtCX - startCX)*shrink;
                const cy = startCY + (tgtCY - startCY)*shrink;
                const cw = cellW  + (tgtW - cellW)*shrink;
                const ch = cellH  + (tgtH - cellH)*shrink;

                // Corner radii: outer corners keep radius, inner seams go to 0
                const isTop  = row === 0, isBot = row === 1;
                const isLeft = col === 0, isRight = col === 2;
                const outerR = 12;
                const innerR = outerR * (1-shrink); // seams flatten to 0
                const outerCurr = outerR; // outer corners stay rounded

                const bTL = (isTop  && isLeft)  ? outerCurr : innerR;
                const bTR = (isTop  && isRight) ? outerCurr : innerR;
                const bBL = (isBot  && isLeft)  ? outerCurr : innerR;
                const bBR = (isBot  && isRight) ? outerCurr : innerR;

                // Border between adjacent cells fades to 0 as they merge
                const borderAlpha = 0.16 * (1 - shrink) + 0.0 * shrink;

                return (
                  <div
                    key={i}
                    className="wt__card-scene"
                    style={{
                      left:   cx - cw/2,
                      top:    cy - ch/2,
                      width:  cw,
                      height: ch,
                    }}
                  >
                    <div className="wt__card-flipper"
                      style={{ transform: `perspective(900px) rotateY(${rotY}deg)` }}>

                      {/* Front */}
                      <div className="wt__card wt__card--front" style={{
                        borderTopLeftRadius: bTL, borderTopRightRadius: bTR,
                        borderBottomLeftRadius: bBL, borderBottomRightRadius: bBR,
                        borderColor: `rgba(201,168,76,${borderAlpha})`,
                      }}>
                        <div className="wt__card-icon" style={{ opacity: contentFade }}>{front.icon}</div>
                        <div className="wt__card-title" style={{ opacity: contentFade }}>{front.title}</div>
                        <p className="wt__card-desc" style={{ opacity: contentFade }}>{front.desc}</p>
                      </div>

                      {/* Back */}
                      <div className="wt__card wt__card--back" style={{
                        borderTopLeftRadius: bTL, borderTopRightRadius: bTR,
                        borderBottomLeftRadius: bBL, borderBottomRightRadius: bBR,
                        borderColor: `rgba(201,168,76,${borderAlpha})`,
                      }}>
                        <div className="wt__card-icon" style={{ opacity: contentFade }}>{back.icon}</div>
                        <div className="wt__card-title" style={{ opacity: contentFade }}>{back.title}</div>
                        <p className="wt__card-desc" style={{ opacity: contentFade }}>{back.desc}</p>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Workflow Intelligence overlay (RIGHT panel text) ── */}
            <div className="wt__workflow-overlay" style={{
              left: rightX, width: rightW,
              opacity: wfOpacity,
              pointerEvents: wfOpacity > 0.5 ? 'auto' : 'none',
            }}>
              <div className="wt__workflow-eyebrow">Workflow Intelligence</div>
              <h3 className="wt__workflow-headline">
                Multi-channel automation,<br />managed like an asset.
              </h3>
              <p className="wt__workflow-body">
                The automation layer protects a premium system of control sequences, time
                windows, response routing, and appointment creation with zero manual lift.
              </p>
              <div className="wt__stat-list">
                {STATS.map((s,i) => (
                  <div className="wt__stat-row" key={i}>
                    <span>{s.label}</span><strong>{s.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Timeline panel (LEFT) — slides in from left AFTER cards form right panel ── */}
            <div className="wt__timeline-panel" style={{
              width: `${(1-RIGHT_FRAC)*100 - 1}%`,
              opacity: tlOpacity,
              transform: `translateX(${tlSlide}px)`,
              pointerEvents: tlOpacity > 0.4 ? 'auto' : 'none',
            }}>
              {STEPS.map((s, i) => (
                <div className="wt__timeline-step" key={i}>
                  <div className="wt__timeline-icon">{s.icon}</div>
                  <div className="wt__timeline-copy">
                    <div className="wt__timeline-steplabel">STEP {i+1}</div>
                    <div className="wt__timeline-title">{s.title}</div>
                    <p className="wt__timeline-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>{/* end stage */}

          {/* ── Phase 4: Integrations ── */}
          <div className="wt__integrations" style={{
            maxHeight: `${intGrow * 200}px`,
            marginTop: `${intGrow * 16}px`,
            opacity: intT,
            transform: `translateY(${(1-intT)*18}px)`,
          }}>
            <div className="wt__eyebrow" style={{ marginBottom: 6 }}>Connected Systems</div>
            <h3 className="wt__integrations-headline">
              Integrations that fit the stack serious<br />acquisition teams already use.
            </h3>
            <p className="wt__integrations-body">
              The ecosystem is deliberately presented as enterprise-grade infrastructure,
              not a patchwork of plugins. Each connection extends the operating system.
            </p>
            <div className="wt__pills">
              {PILLS.map((p, i) => {
                const ps = pillP(i);
                return (
                  <div key={i} className="wt__pill" style={{
                    opacity: ps,
                    transform: `translateX(${(1-ps)*-32}px)`,
                  }}>
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
