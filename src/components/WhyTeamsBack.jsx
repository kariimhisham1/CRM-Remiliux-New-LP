import React from 'react';
import './WhyTeamsBack.css';

const PAIN_POINTS = [
  { icon: '💼', text: 'Leads are forgotten the moment acquisition volume increases.' },
  { icon: '⏱', text: 'Follow-up cadence stops long before the prospect is ready.' },
  { icon: '👤', text: 'Managers cannot see who is driving pipeline and who is drifting.' },
  { icon: '💬', text: 'Calls, texts, calendars, and deals live in disconnected systems.' },
];

export default function WhyTeamsBack({ animProgress = 0 }) {
  // Shimmer sweep — decorative only
  const shimmerP = Math.min(1, animProgress / 0.55);
  const shimmerX = -60 + shimmerP * 160;
  const shimmerOpacity = shimmerP >= 1 ? 0 : Math.min(1, shimmerP * 4);

  // Easing functions
  const easeOut3 = t => 1 - Math.pow(1 - t, 3);
  const easeOut4 = t => 1 - Math.pow(1 - t, 4);

  // Header fades in early and stays
  const headerP = easeOut3(Math.min(1, animProgress / 0.30));

  // Cards start appearing at animProgress = 0.45 (mid flip+zoom)
  // Each card staggers 0.12 apart, duration 0.30 each
  // Order: card 0 (top-left), 1 (top-mid), 2 (top-right), 3 (bottom-left)
  const CARD_START = 0.45;
  const CARD_STAGGER = 0.12;
  const CARD_DUR = 0.30;

  const cardP = PAIN_POINTS.map((_, i) => {
    const start = CARD_START + i * CARD_STAGGER;
    const raw = Math.max(0, Math.min(1, (animProgress - start) / CARD_DUR));
    return easeOut4(raw);
  });

  return (
    <div className="wtb">
      {/* Gold shimmer */}
      <div
        className="wtb__shimmer"
        style={{
          opacity: shimmerOpacity,
          transform: `translateX(${shimmerX}%)`,
        }}
      />

      <div className="wtb__content">
        {/* Header — always readable, gentle fade up */}
        <div
          className="wtb__header"
          style={{
            opacity: 0.12 + headerP * 0.88,
            transform: `translateY(${(1 - headerP) * 10}px)`,
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

        {/* Cards — appear one by one starting mid flip+zoom */}
        <div className="wtb__cards">
          {PAIN_POINTS.map((point, i) => {
            const cp = cardP[i];
            return (
              <div
                key={i}
                className="wtb__card"
                style={{
                  opacity: cp,
                  transform: `translateY(${(1 - cp) * 48}px)`,
                  // Slight scale for depth feel
                  scale: `${0.92 + cp * 0.08}`,
                }}
              >
                {/* Icon scales in with a tiny delay after card */}
                <div
                  className="wtb__card-icon"
                  style={{
                    transform: `scale(${0.4 + cp * 0.6}) rotate(${(1 - cp) * -8}deg)`,
                    opacity: cp,
                  }}
                >
                  {point.icon}
                </div>
                <p
                  className="wtb__card-text"
                  style={{
                    opacity: 0.2 + cp * 0.8,
                    transform: `translateX(${(1 - cp) * 10}px)`,
                  }}
                >
                  {point.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
