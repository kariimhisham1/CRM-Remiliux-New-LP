import React from 'react';
import './WhyTeamsBack.css';

const PAIN_POINTS = [
  { icon: '💼', text: 'Leads are forgotten the moment acquisition volume increases.' },
  { icon: '⏱', text: 'Follow-up cadence stops long before the prospect is ready.' },
  { icon: '👤', text: 'Managers cannot see who is driving pipeline and who is drifting.' },
  { icon: '💬', text: 'Calls, texts, calendars, and deals live in disconnected systems.' },
];

export default function WhyTeamsBack({ animProgress = 0 }) {
  // Shimmer sweep — decorative gold band
  const shimmerP = Math.min(1, animProgress / 0.6);
  const shimmerX = -60 + shimmerP * 160;
  const shimmerOpacity = shimmerP >= 1 ? 0 : Math.min(1, shimmerP * 3);

  // Cards animate in with stagger starting from animProgress = 0.15
  // Each card: slides up from 40px + fades in + icon pops
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeSpring = t => {
    // Slight overshoot for premium feel
    if (t >= 1) return 1;
    const c4 = (2 * Math.PI) / 4.5;
    return 1 + Math.pow(2, -8 * t) * Math.sin((t * 10 - 0.75) * c4) * -1;
  };

  // Stagger offsets — cards cascade left to right, top row first
  const cardStarts = [0.10, 0.20, 0.30, 0.42];
  const cardDuration = 0.35;

  const cardP = cardStarts.map(start => {
    const raw = Math.max(0, Math.min(1, (animProgress - start) / cardDuration));
    return easeSpring(raw);
  });

  // Icon scale: small pop when card arrives
  const iconP = cardStarts.map(start => {
    const raw = Math.max(0, Math.min(1, (animProgress - start - 0.05) / 0.25));
    return easeOut(raw);
  });

  // Header text fades in early
  const headerP = easeOut(Math.min(1, animProgress / 0.25));

  return (
    <div className="wtb">
      {/* Gold shimmer sweep */}
      <div
        className="wtb__shimmer"
        style={{
          opacity: shimmerOpacity,
          transform: `translateX(${shimmerX}%)`,
        }}
      />

      <div className="wtb__content">
        {/* Header always visible but fades in cleanly */}
        <div
          className="wtb__header"
          style={{
            opacity: 0.15 + headerP * 0.85,
            transform: `translateY(${(1 - headerP) * 8}px)`,
          }}
        >
          <div className="wtb__eyebrow">Why Teams Lose Revenue</div>
          <h2 className="wtb__headline">
            The gap between inbound lead<br />
            and disciplined follow-up<br />
            destroys deal volume.
          </h2>
          <p className="wtb__body">
            Most real estate operators do not have a lead problem.<br />
            They have an execution problem.
          </p>
        </div>

        {/* Pain point cards — staggered spring entrance */}
        <div className="wtb__cards">
          {PAIN_POINTS.map((point, i) => (
            <div
              key={i}
              className="wtb__card"
              style={{
                opacity: Math.min(1, cardP[i] + 0.08),
                transform: `translateY(${(1 - Math.min(1, cardP[i])) * 40}px)`,
              }}
            >
              <div
                className="wtb__card-icon"
                style={{
                  transform: `scale(${0.5 + iconP[i] * 0.5})`,
                  opacity: 0.3 + iconP[i] * 0.7,
                }}
              >
                {point.icon}
              </div>
              <p className="wtb__card-text">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
