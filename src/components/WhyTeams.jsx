import React, { useEffect, useRef, useState } from 'react';
import './WhyTeams.css';

// Small inline line-icon SVGs for the integration pills (gold outline badge
// style). Hand-drawn rather than a library import — avoids adding a new
// dependency (lucide-react previously caused a Vercel build failure when
// it wasn't declared in package.json).
const iconProps = { viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
const IconDatabase = () => (
  <svg {...iconProps}>
    <ellipse cx="10" cy="5" rx="6" ry="2.2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M4 5v4.5c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2V5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M4 9.5V14c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2V9.5" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
);
const IconPhone = () => (
  <svg {...iconProps}>
    <path d="M5.5 3.5h2.2l1 3.3-1.6 1.4a8.5 8.5 0 0 0 4.2 4.2l1.4-1.6 3.3 1v2.2c0 .9-.8 1.5-1.6 1.4-6-.7-9.6-4.3-10.3-10.3-.1-.8.5-1.6 1.4-1.6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);
const IconEnvelope = () => (
  <svg {...iconProps}>
    <rect x="3" y="5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M3.5 5.8 10 10.5l6.5-4.7" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);
const IconMessage = () => (
  <svg {...iconProps}>
    <path d="M3.5 5.5h13a1 1 0 0 1 1 1v6.2a1 1 0 0 1-1 1H8.8L5.5 16V13.7H3.5a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);
const IconCalendar = () => (
  <svg {...iconProps}>
    <rect x="3.5" y="4.5" width="13" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M3.5 8h13M7 3v3M13 3v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const IconClipboard = () => (
  <svg {...iconProps}>
    <rect x="5" y="4" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="7.5" y="2.7" width="5" height="2.6" rx="0.8" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M7.2 9h5.6M7.2 12h5.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const IconLink = () => (
  <svg {...iconProps}>
    <rect x="2.8" y="7.5" width="7" height="5" rx="2.5" transform="rotate(-45 6.3 10)" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="10.2" y="7.5" width="7" height="5" rx="2.5" transform="rotate(-45 13.7 10)" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
);
const IconHome = () => (
  <svg {...iconProps}>
    <path d="M4 9.5 10 4l6 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 8.5V16h9V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M8.2 16v-3.8h3.6V16" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);
const IconChart = () => (
  <svg {...iconProps}>
    <path d="M4 16V11M9 16V6.5M14 16V9.5M4 16h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
  { Icon: IconDatabase, label: 'CRM Imports' },
  { Icon: IconPhone, label: 'Dialpad' },
  { Icon: IconEnvelope, label: 'Email' },
  { Icon: IconMessage, label: 'SMS' },
  { Icon: IconCalendar, label: 'Calendars' },
  { Icon: IconClipboard, label: 'Lead Forms' },
  { Icon: IconLink, label: 'Zapier' },
  { Icon: IconHome, label: 'MLS' },
  { Icon: IconChart, label: 'Analytics' },
];

const easeInOut = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
const easeOut   = t => 1 - Math.pow(1-t, 3);
const easeOut2  = t => 1 - Math.pow(1-t, 2);
const clamp01   = n => Math.max(0, Math.min(1, n));
const band      = (p, s, e) => clamp01((p-s)/(e-s));
// Mirrors CSS clamp(min, Nvh, max): scales with viewport height but never
// goes below min or above max. Used for the integrations block sizing,
// which is animated via inline styles rather than a CSS clamp().
const clampVH   = (min, vhFrac, max, vh) => Math.max(min, Math.min(max, vhFrac/100 * vh));

// ── Phase timing ──
// Cards flip row-by-row: all 3 top-row cards flip together, then once
// that's fully done, all 3 bottom-row cards flip together. Stagger equals
// the flip duration so row 2 starts the instant row 1 finishes — no
// overlap, no gap. (Previously each of the 6 cards staggered individually.)
const FLIP_S = 0.03, FLIP_DUR = 0.13, FLIP_ROW_STAGGER = FLIP_DUR;
const FLIP_E = FLIP_S + 1*FLIP_ROW_STAGGER + FLIP_DUR;     // ~0.29 (row 2 start + its duration)

const HEADER_S = 0.05, HEADER_E = 0.22;

const FADE_S = FLIP_E + 0.03, FADE_E = FADE_S + 0.07;

// Cards merge to right panel
const SHRINK_S = FLIP_E + 0.02, SHRINK_STAGGER = 0.016, SHRINK_DUR = 0.10;
const SHRINK_E = SHRINK_S + 5*SHRINK_STAGGER + SHRINK_DUR; // ~0.48

// Right panel text appears as cards form it
const WF_S = SHRINK_S + 0.06, WF_E = SHRINK_E + 0.04;

// Timeline panel background fades in (replaces the old curtain wipe)
const TL_BG_S = SHRINK_E + 0.02, TL_BG_E = TL_BG_S + 0.04;

// Timeline STEPS reveal one at a time, after the panel background is in.
// Each step gets its own band; the connector line grows across the same span.
const TL_STEP_S = TL_BG_E + 0.01, TL_STEP_STAGGER = 0.045, TL_STEP_DUR = 0.06;
const TL_STEPS_E = TL_STEP_S + 3*TL_STEP_STAGGER + TL_STEP_DUR; // last step finishes, ~0.745

// Frame border appears when both panels are ready
const FRAME_S = TL_BG_S + 0.02, FRAME_E = TL_STEPS_E;

// Integrations
const INT_S = TL_STEPS_E + 0.04, INT_E = INT_S + 0.07;

// Right panel takes 48% of stage width
const RIGHT_FRAC = 0.48;

// Visible gap between the outer lighter frame (.wt__panels-bg) and the two
// inner dark panels, and the gap between the two inner panels themselves —
// matches the target design's "frame holding two cards" look.
const STAGE_INSET = 14;
const PANEL_GAP   = 14;

export default function WhyTeams() {
  const wrapRef  = useRef(null);
  const stageRef = useRef(null);
  const [progress, setProgress]     = useState(0);
  const [bgProgress, setBgProgress] = useState(0);
  const [frameVisible, setFrameVisible] = useState(false);
  const [stageSize, setStageSize]   = useState({ w: 1104, h: 380 });
  // Tracks viewport height so the header spacer, stage, and integrations
  // block can scale down on short browser windows instead of overflowing
  // the sticky 100vh container (see clampVH helper below).
  const [viewportH, setViewportH]   = useState(900);

  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const vh   = window.innerHeight;
      const p    = clamp01(-rect.top / (rect.height - vh));
      setProgress(p);
      setBgProgress(clamp01((vh - rect.top) / (vh * 0.6)));
      setViewportH(vh);
      if (rect.top < vh * 0.9) setFrameVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
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

  // Background
  const bp = easeOut2(bgProgress);
  const bgColor = `rgb(${Math.round(26+bp*170)},${Math.round(18+bp*152)},${Math.round(8+bp*135)})`;

  // Header crossfade
  const hFlip = easeInOut(band(progress, HEADER_S, HEADER_E));

  // Card flips — staggered by ROW, not by individual card: all 3 cards in
  // a row share the same timing band, so the top row fully completes its
  // flip before the bottom row begins (per the 3-column grid: row = i/3).
  const cardFlips = SET_A.map((_, i) => {
    const row = Math.floor(i / 3);
    const s = FLIP_S + row * FLIP_ROW_STAGGER;
    return easeInOut(band(progress, s, s + FLIP_DUR));
  });

  // Content fades before shrink
  const contentFade = 1 - easeOut(band(progress, FADE_S, FADE_E));

  // Inner working rect — inset from the outer .wt__panels-bg frame so a
  // visible lighter "frame" border shows around the two dark panels,
  // matching the target design. Everything below (card grid, right panel,
  // timeline panel) is computed relative to this inset rect, not the raw
  // stage bounds, so the merged cards and the panel CSS always agree.
  const innerX = STAGE_INSET;
  const innerY = STAGE_INSET;
  const innerW = Math.max(0, SW - STAGE_INSET * 2);
  const innerH = Math.max(0, SH - STAGE_INSET * 2);

  // Split the inset rect into: left timeline panel | gap | right panel.
  // Both panel widths are derived from the same innerW so they always sum
  // correctly with no overlap and no touching at the gap.
  const tlPanelW = innerW * (1 - RIGHT_FRAC) - PANEL_GAP / 2;
  const rightW   = innerW * RIGHT_FRAC - PANEL_GAP / 2;
  const rightX   = innerX + tlPanelW + PANEL_GAP;

  // Grid geometry
  const GAP = 8, COLS = 3, ROWS = 2;
  const cellW = (innerW - (COLS-1)*GAP) / COLS;
  const cellH = (innerH - (ROWS-1)*GAP) / ROWS;

  // Right panel target geometry — cards merge flush (no gaps) into rightW
  const tgtW   = rightW / COLS;
  const tgtH   = innerH / ROWS;

  const shrinkTs = SET_A.map((_, i) => {
    const s = SHRINK_S + i * SHRINK_STAGGER;
    return easeInOut(band(progress, s, s + SHRINK_DUR));
  });

  // Workflow text opacity
  const wfOpacity = easeOut(band(progress, WF_S, WF_E));

  // Timeline panel background — fades in as a flat reveal (no more curtain wipe)
  const tlBgOpacity = easeOut(band(progress, TL_BG_S, TL_BG_E));

  // Each timeline step reveals on its own staggered band: fade + slide up
  const stepP = i => easeOut(band(progress, TL_STEP_S + i*TL_STEP_STAGGER, TL_STEP_S + i*TL_STEP_STAGGER + TL_STEP_DUR));
  const stepTs = STEPS.map((_, i) => stepP(i));

  // Connector line grows downward across the same span the steps occupy,
  // reaching each icon's center as that step finishes revealing.
  const lineGrowth = easeOut(band(progress, TL_STEP_S, TL_STEPS_E));

  // Combined frame opacity
  const frameOpacity = easeOut(band(progress, FRAME_S, FRAME_E));

  // Integrations
  const intT    = easeOut(band(progress, INT_S, INT_E));
  const intGrow = easeOut(band(progress, INT_S - 0.01, INT_S + 0.06));

  return (
    <div className="wt" ref={wrapRef}>
      <div className="wt__sticky" style={{ background: bgColor }}>
        <div className={`wt__frame ${frameVisible ? 'wt__frame--visible' : ''}`}>

          {/* Header A */}
          <div className="wt__header" style={{
            opacity: 1-hFlip, position:'absolute',
            pointerEvents: hFlip > 0.9 ? 'none' : 'auto'
          }}>
            <div className="wt__eyebrow">Platform Capabilities</div>
            <h2 className="wt__headline">Built for operators who need<br />control and conversion.</h2>
            <p className="wt__body">Lead operations, communication, and follow-up — all in one system.</p>
          </div>

          {/* Header B */}
          <div className="wt__header" style={{
            opacity: hFlip, position:'absolute',
            pointerEvents: hFlip < 0.1 ? 'none' : 'auto'
          }}>
            <div className="wt__eyebrow">Automation Engine</div>
            <h2 className="wt__headline">A follow-up system that moves<br />with the urgency of the opportunity.</h2>
            <p className="wt__body">Leads should not depend on memory. Remiliux orchestrates a disciplined chain of touch-points.</p>
          </div>

          <div className="wt__header-spacer" />

          {/* ── STAGE ── */}
          <div className="wt__cards-stage" ref={stageRef}>

            
            {/* Outer lighter frame — shows through the gap between the two dark panels */}
            <div className="wt__panels-bg" style={{ opacity: wfOpacity }} />
            {/* Gold border frame */}
            <div className="wt__panel-frame" style={{ opacity: frameOpacity }} />

            {/* 6 flipping + merging cards */}
            <div className="wt__cards">
              {SET_A.map((front, i) => {
                const back    = SET_B[i];
                const rotX    = cardFlips[i] * 180;
                const shrink  = shrinkTs[i];
                const col     = i % COLS;
                const row     = Math.floor(i / COLS);

                const startCX = innerX + col*(cellW+GAP) + cellW/2;
                const startCY = innerY + row*(cellH+GAP) + cellH/2;
                const tgtCX   = rightX + col*tgtW + tgtW/2;
                const tgtCY   = innerY + row*tgtH + tgtH/2;

                const cx = startCX + (tgtCX - startCX)*shrink;
                const cy = startCY + (tgtCY - startCY)*shrink;
                const cw = cellW   + (tgtW   - cellW)*shrink;
                const ch = cellH   + (tgtH   - cellH)*shrink;

                // Seam borders flatten to zero as cards merge
                const isTop   = row === 0, isBot   = row === 1;
                const isLeft  = col === 0, isRight = col === 2;
                const outerR  = 12;
                const seamR   = outerR * (1 - shrink);
                const bTL = (isTop && isLeft)   ? outerR : seamR;
                const bTR = (isTop && isRight)  ? outerR : seamR;
                const bBL = (isBot && isLeft)   ? outerR : seamR;
                const bBR = (isBot && isRight)  ? outerR : seamR;
                const borderAlpha = 0.16 * (1 - shrink);

                return (
                  <div key={i} className="wt__card-scene" style={{
                    left: cx - cw/2, top: cy - ch/2, width: cw, height: ch,
                  }}>
                    <div className="wt__card-flipper"
                      style={{ transform: `perspective(1200px) rotateX(${rotX}deg)` }}>
                      <div className="wt__card wt__card--front" style={{
                        borderTopLeftRadius: bTL, borderTopRightRadius: bTR,
                        borderBottomLeftRadius: bBL, borderBottomRightRadius: bBR,
                        borderColor: `rgba(201,168,76,${borderAlpha})`,
                      }}>
                        <div className="wt__card-icon" style={{ opacity: contentFade }}>{front.icon}</div>
                        <div className="wt__card-title" style={{ opacity: contentFade }}>{front.title}</div>
                        <p className="wt__card-desc" style={{ opacity: contentFade }}>{front.desc}</p>
                      </div>
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

            {/* Workflow Intelligence text — right panel */}
            <div className="wt__workflow-overlay" style={{
              left: rightX, width: rightW, top: innerY, height: innerH,
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
                {STATS.map((s, i) => (
                  <div className="wt__stat-row" key={i}>
                    <span>{s.label}</span><strong>{s.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline panel — background fades in, then each step reveals in sequence */}
            <div className="wt__timeline-panel" style={{
              left: innerX, top: innerY, width: tlPanelW, height: innerH,
              opacity: tlBgOpacity,
              pointerEvents: tlBgOpacity > 0.8 ? 'auto' : 'none',
            }}>
              {/* Connector line grows downward behind the icons as steps reveal */}
              <div className="wt__timeline-line-track">
                <div className="wt__timeline-line-fill" style={{ height: `${lineGrowth * 100}%` }} />
              </div>

              {STEPS.map((s, i) => {
                const st = stepTs[i];
                return (
                  <div className="wt__timeline-step" key={i} style={{
                    opacity: st,
                    transform: `translateY(${(1-st)*14}px)`,
                  }}>
                    <div className="wt__timeline-icon">{s.icon}</div>
                    <div className="wt__timeline-copy">
                      <div className="wt__timeline-steplabel">STEP {i+1}</div>
                      <div className="wt__timeline-title">{s.title}</div>
                      <p className="wt__timeline-desc">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>{/* end stage */}

          {/* Integrations */}
          <div className="wt__integrations" style={{
            maxHeight: `${intGrow * clampVH(156, 22.5, 212, viewportH)}px`,
            marginTop: `${intGrow * clampVH(5, 0.8, 12, viewportH)}px`,
            opacity: intT,
            transform: `translateY(${(1-intT)*16}px)`,
          }}>
            <div className="wt__eyebrow" style={{ marginBottom: 6 }}>Connected Systems</div>
            <h3 className="wt__integrations-headline">
              Integrations that fit the stack serious<br />acquisition teams already use.
            </h3>
            <p className="wt__integrations-body">
              The ecosystem is deliberately presented as enterprise-grade infrastructure,
              not a patchwork of plugins. Each connection extends the operating system.
            </p>
            {/* Edge-fade viewport clips the track; the track holds the
                pill list twice back-to-back and animates via CSS keyframes
                (see .wt__pills-track in the CSS) for a seamless infinite
                loop. Hovering pauses the animation (CSS :hover rule). */}
            <div className="wt__pills" style={{
              transform: `translateX(${(1-intT)*-28}px)`,
            }}>
              <div className="wt__pills-track">
                {[...PILLS, ...PILLS].map((p, i) => {
                  const PillIcon = p.Icon;
                  return (
                    <div key={i} className="wt__pill" aria-hidden={i >= PILLS.length}>
                      <span className="wt__pill-icon"><PillIcon /></span>
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
    </div>
  );
}
