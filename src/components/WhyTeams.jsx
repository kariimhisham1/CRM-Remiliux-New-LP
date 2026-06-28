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
  { step: 'STEP 1', icon: '🔔', title: 'Lead Arrives',    desc: 'Via web form, ad, import, referral, or direct response — captured instantly.' },
  { step: 'STEP 2', icon: '💬', title: 'Text Sent',       desc: 'AI-matched SMS is launched immediately with contextual personalisation.' },
  { step: 'STEP 3', icon: '✉️', title: 'Email Sent',      desc: 'A branded email reinforces credibility and defines next best actions.' },
  { step: 'STEP 4', icon: '🎙️', title: 'Voicemail Drop', desc: 'A smart voicemail is delivered when no response is detected.' },
];

const STATS = [
  { label: 'Total delivery rate',       value: '99.2%' },
  { label: 'Email response uplift',     value: '+47%'  },
  { label: 'Appointment recovery rate', value: '2.4x'  },
];

const PILLS = [
  { icon: '✉️',  label: 'Email'        },
  { icon: '💬',  label: 'SMS'          },
  { icon: '📅',  label: 'Calendars'    },
  { icon: '📋',  label: 'Lead Forms'   },
  { icon: '🗄️', label: 'CRM Imports'  },
];

// ── Easings ──────────────────────────────────────────────────────────────────
const easeInOut  = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const easeOut3   = t => 1 - Math.pow(1 - t, 3);
const easeOut4   = t => 1 - Math.pow(1 - t, 4);
const easeInOut3 = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function clamp(v, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, v)); }
function prog(scroll, start, end)  { return clamp((scroll - start) / (end - start)); }

export default function WhyTeams() {
  const wrapRef = useRef(null);
  const [scroll, setScroll]           = useState(0);
  const [bgProgress, setBgProgress]   = useState(0);
  const [frameVisible, setFrameVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current) return;
      const rect      = wrapRef.current.getBoundingClientRect();
      const vh        = window.innerHeight;
      const totalScroll = rect.height - vh;
      const scrolled  = -rect.top;
      const p         = clamp(scrolled / totalScroll);
      setScroll(p);

      const bgP = clamp((vh - rect.top) / (vh * 0.6));
      setBgProgress(bgP);
      if (rect.top < vh * 0.9) setFrameVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Phase breakpoints (normalised 0→1 across total scroll height) ─────────
  //
  //  0.00 → 0.20  Phase 0 : section enters, frame slides up
  //  0.20 → 0.55  Phase 1 : SET_A cards flip → SET_B  (existing)
  //  0.55 → 0.62  Phase 1b: header cross-fade A→B      (existing)
  //  0.62 → 0.72  Phase 2 : frame morphs → dark card; grid dissolves
  //  0.68 → 0.82  Phase 3 : 4-step timeline slides in from LEFT
  //  0.76 → 0.88  Phase 3b: Workflow Intelligence panel slides in from RIGHT
  //  0.84 → 0.94  Phase 4 : integration pills stagger in
  //  0.94 → 1.00  Phase 5 : hold / read

  // ── Existing flip logic (unchanged) ──────────────────────────────────────
  const FLIP_START = 0.20;
  const STAGGER    = 0.08;
  const FLIP_DUR   = 0.18;

  const cardFlips = SET_A.map((_, i) => {
    const start = FLIP_START + i * STAGGER;
    const raw   = clamp((scroll - start) / FLIP_DUR);
    return easeInOut(raw);
  });

  // ── Existing header cross-fade (unchanged) ────────────────────────────────
  const headerFlip   = easeInOut(prog(scroll, 0.15, 0.40));
  const header1Opacity = 1 - headerFlip;
  const header2Opacity = headerFlip;

  // ── Existing bg morph (unchanged) ────────────────────────────────────────
  const easeOutBg = t => 1 - Math.pow(1 - t, 2.5);
  const bp = easeOutBg(bgProgress);
  const r  = Math.round(26  + bp * (196 - 26));
  const g  = Math.round(18  + bp * (170 - 18));
  const b  = Math.round(8   + bp * (143 - 8));
  const bgColor = `rgb(${r},${g},${b})`;

  // ── Phase 2: grid dissolve + frame morph ─────────────────────────────────
  const collapseP = easeInOut3(prog(scroll, 0.62, 0.73));
  // Individual card collapse with stagger — they shrink toward center
  const cardCollapseP = SET_A.map((_, i) => {
    const s = 0.62 + i * 0.012;
    return easeOut4(prog(scroll, s, s + 0.10));
  });

  // ── Phase 3: timeline slides in from left ────────────────────────────────
  const timelineP = easeOut4(prog(scroll, 0.68, 0.82));
  const stepP = STEPS.map((_, i) => {
    const s = 0.70 + i * 0.032;
    return easeOut4(prog(scroll, s, s + 0.10));
  });

  // ── Phase 3b: WI panel slides in from right ───────────────────────────────
  const wiP = easeOut3(prog(scroll, 0.73, 0.86));
  const statP = STATS.map((_, i) => {
    const s = 0.78 + i * 0.030;
    return easeOut4(prog(scroll, s, s + 0.08));
  });

  // ── Phase 4: pills stagger in ─────────────────────────────────────────────
  const pillP = PILLS.map((_, i) => {
    const s = 0.84 + i * 0.022;
    return easeOut3(prog(scroll, s, s + 0.08));
  });

  // Derived flags
  const showEngine = collapseP > 0.02;
  const showPills  = pillP[0]  > 0.01;

  return (
    <div className="wt" ref={wrapRef}>
      <div className="wt__sticky" style={{ background: bgColor }}>

        {/* ── Frosted frame (phases 0–1) ── */}
        <div
          className={`wt__frame ${frameVisible ? 'wt__frame--visible' : ''}`}
          style={{
            opacity:   showEngine ? Math.max(0, 1 - collapseP * 4) : undefined,
            transform: showEngine ? `scale(${1 - collapseP * 0.04}) translateY(${collapseP * -20}px)` : undefined,
            pointerEvents: collapseP > 0.5 ? 'none' : 'auto',
          }}
        >
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

          <div className="wt__header-spacer" />

          {/* 6 flipping cards */}
          <div className="wt__cards">
            {SET_A.map((frontCard, i) => {
              const backCard = SET_B[i];
              const flip     = cardFlips[i];
              const rotateY  = flip * 180;
              const cp       = cardCollapseP[i];

              return (
                <div
                  key={i}
                  className="wt__card-scene"
                  style={{
                    opacity:   1 - cp,
                    transform: `scale(${1 - cp * 0.12}) translateY(${cp * -12}px)`,
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
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            PHASES 2–5 : Automation Engine dark card
        ══════════════════════════════════════════════════════════════════ */}
        {showEngine && (
          <div
            className="wt__engine-wrap"
            style={{ opacity: collapseP, pointerEvents: collapseP > 0.5 ? 'auto' : 'none' }}
          >
            {/* Section header above dark card */}
            <div
              className="wt__engine-header"
              style={{
                opacity:   easeOut3(prog(scroll, 0.62, 0.74)),
                transform: `translateY(${(1 - easeOut3(prog(scroll, 0.62, 0.74))) * 16}px)`,
              }}
            >
              <div className="wt__eyebrow" style={{ color: 'var(--gold, #C9A84C)' }}>Automation Engine</div>
              <h2 className="wt__engine-headline">
                A follow-up system that moves<br />with the urgency of the opportunity.
              </h2>
              <p className="wt__engine-body">
                Leads should not depend on memory. Every inbound signal triggers a disciplined
                chain of responses — with executive visibility at every step.
              </p>
            </div>

            {/* Dark card */}
            <div
              className="wt__dark-card"
              style={{
                transform: `scale(${0.94 + collapseP * 0.06}) translateY(${(1 - collapseP) * 24}px)`,
              }}
            >
              {/* LEFT: 4-step timeline */}
              <div
                className="wt__timeline"
                style={{
                  opacity:   timelineP,
                  transform: `translateX(${(1 - timelineP) * -52}px)`,
                }}
              >
                {STEPS.map((step, i) => (
                  <div
                    key={i}
                    className="wt__step"
                    style={{
                      opacity:   stepP[i],
                      transform: `translateX(${(1 - stepP[i]) * -20}px)`,
                    }}
                  >
                    <div className="wt__step-icon">{step.icon}</div>
                    <div className="wt__step-body">
                      <p className="wt__step-label">{step.step}</p>
                      <p className="wt__step-title">{step.title}</p>
                      <p className="wt__step-desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="wt__card-divider" style={{ opacity: timelineP * 0.5 }} />

              {/* RIGHT: Workflow Intelligence */}
              <div
                className="wt__wi"
                style={{
                  opacity:   wiP,
                  transform: `translateX(${(1 - wiP) * 52}px)`,
                }}
              >
                <p className="wt__wi-eyebrow">Workflow Intelligence</p>
                <h3 className="wt__wi-headline">
                  Multi-channel automation,<br />managed like an asset.
                </h3>
                <p className="wt__wi-body">
                  The automation layer protects a premium system of control sequences,
                  time windows, response routing, and appointment creation with zero
                  manual lift.
                </p>
                <div className="wt__stats">
                  {STATS.map((stat, i) => (
                    <div
                      key={i}
                      className="wt__stat"
                      style={{
                        opacity:   statP[i],
                        transform: `translateY(${(1 - statP[i]) * 10}px)`,
                      }}
                    >
                      <span className="wt__stat-label">{stat.label}</span>
                      <span className="wt__stat-value">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Integration pills */}
            {showPills && (
              <div className="wt__pills">
                {PILLS.map((pill, i) => (
                  <div
                    key={i}
                    className="wt__pill"
                    style={{
                      opacity:   pillP[i],
                      transform: `translateX(${(1 - pillP[i]) * -28}px)`,
                    }}
                  >
                    <span className="wt__pill-icon">{pill.icon}</span>
                    <span className="wt__pill-label">{pill.label}</span>
                    <span className="wt__pill-badge">Native</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
