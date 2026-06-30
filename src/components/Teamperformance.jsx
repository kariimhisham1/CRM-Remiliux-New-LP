import React, { useEffect, useRef, useState } from 'react';
import './TeamPerformance.css';

// Inline line-icon SVGs, matching the style already established in
// WhyTeams.jsx (no icon-library dependency — hand-drawn, stroke-based,
// currentColor so they inherit the gold accent color via CSS).
const iconProps = { viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
const IconClock = () => (
  <svg {...iconProps}>
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M10 6.2V10l3 1.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconPhoneCall = () => (
  <svg {...iconProps}>
    <path d="M5.5 3.5h2.2l1 3.3-1.6 1.4a8.5 8.5 0 0 0 4.2 4.2l1.4-1.6 3.3 1v2.2c0 .9-.8 1.5-1.6 1.4-6-.7-9.6-4.3-10.3-10.3-.1-.8.5-1.6 1.4-1.6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);
const IconCheckCircle = () => (
  <svg {...iconProps}>
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M7 10.2 9 12.2 13.2 7.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconTrophy = () => (
  <svg {...iconProps}>
    <path d="M6.5 4h7v4.3a3.5 3.5 0 0 1-7 0V4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M6.5 5H4.8a1.3 1.3 0 0 0-1.3 1.3v.4A2.3 2.3 0 0 0 5.8 9h.7M13.5 5h1.7a1.3 1.3 0 0 1 1.3 1.3v.4A2.3 2.3 0 0 1 14.2 9h-.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M10 11.8V14M7.5 16.3h5M8 14.3h4l.3 2H7.7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);
const IconCrown = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 14.5 2.6 7.3a.5.5 0 0 1 .8-.46l3 2.16 2.9-4.3a.7.7 0 0 1 1.16 0l2.9 4.3 3-2.16a.5.5 0 0 1 .8.46l-.9 7.2H3.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M3.7 16.2h12.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const FEATURE_CARDS = [
  {
    Icon: IconClock,
    title: 'Activity Command Center',
    desc: 'Surface calls, texts, appointments, and next actions by rep, team, and market in one operating view.',
  },
  {
    Icon: IconPhoneCall,
    title: 'Call Tracking',
    desc: 'Monitor answer rates, connection quality, response times, and call outcomes without chasing spreadsheets.',
  },
  {
    Icon: IconCheckCircle,
    title: 'Follow-Up Completion',
    desc: 'Track whether every lead received the required touch pattern and escalate exceptions automatically.',
  },
  {
    Icon: IconTrophy,
    title: 'Leaderboards & KPIs',
    desc: 'Rank conversion performance by acquisitions rep, manager, office, and campaign with clean executive clarity.',
  },
];

// Fill values are matched to the visual proportions in the target design
// (not strictly the literal percentage of each label — e.g. "9.4/10" is
// shown as a short bar, "2m 14s" as a marker near the start, matching the
// mockup's stylized look rather than a literally-computed ratio).
const STATS = [
  { label: '96%', fill: 89 },
  { label: '31%', fill: 29 },
  { label: '2m 14s', fill: 1, isDot: true },
  { label: '9.4/10', fill: 8 },
];

export default function TeamPerformance() {
  const sectionRef = useRef(null);
  const [hasFallen, setHasFallen] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    // One-time scroll-into-view trigger (not scroll-jacked) — once the
    // card's container is ~35% visible, kick off the fall animation and
    // disconnect; it never re-triggers on scroll-up, matching a normal
    // page entrance rather than a scrubbable scroll animation.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasFallen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="tp" ref={sectionRef}>
      <div className="tp__inner">
        <div className="tp__eyebrow">Performance Visibility</div>
        <h2 className="tp__headline">
          Drive accountability across every<br />rep, market, and manager.
        </h2>
        <p className="tp__body">
          Premium CRM software should make leadership sharper. Remiliux translates
          daily activity into clear operational signals that help teams coach,
          forecast, and improve.
        </p>

        <div className="tp__layout">
          <div className="tp__features">
            {FEATURE_CARDS.map((c, i) => {
              const CardIcon = c.Icon;
              return (
                <div className="tp__feature" key={i}>
                  <div className="tp__feature-icon"><CardIcon /></div>
                  <h3 className="tp__feature-title">{c.title}</h3>
                  <p className="tp__feature-desc">{c.desc}</p>
                </div>
              );
            })}
          </div>

          {/* The 3D fall-in card. .tp__card-fall--in is added once, on
              scroll-into-view, and never removed — a one-time entrance,
              not a scrubbable scroll animation (per direction). */}
          <div className={`tp__card-wrap ${hasFallen ? 'tp__card-fall--in' : ''}`}>
            <div className="tp__card-fall">
              <div className="tp__card">
                <div className="tp__card-header">
                  <h3 className="tp__card-title">Team Performance</h3>
                  <span className="tp__card-crown"><IconCrown /></span>
                </div>

                <div className="tp__stat-list">
                  {STATS.map((s, i) => (
                    <div className="tp__stat-row" key={i}>
                      <span className="tp__stat-label">{s.label}</span>
                      <div className="tp__stat-bar-track">
                        {s.isDot ? (
                          <div
                            className={`tp__stat-dot ${hasFallen ? 'tp__stat-dot--in' : ''}`}
                            style={{ transitionDelay: `${0.68 + i * 0.12}s`, '--fill': `${s.fill}%` }}
                          />
                        ) : (
                          <div
                            className={`tp__stat-bar-fill ${hasFallen ? 'tp__stat-bar-fill--in' : ''}`}
                            style={{ transitionDelay: `${0.68 + i * 0.12}s`, '--fill': `${s.fill}%` }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="tp__card-caption">
                  Managers can see activity tracking, call tracking, follow-up
                  completion, leaderboards, KPIs, and accountability dashboards
                  without switching tools.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
