import React from 'react';
import './WhyTeamsBack.css';

const PAIN_POINTS = [
  { icon: '💼', text: 'Leads are forgotten the moment acquisition volume increases.' },
  { icon: '⏱', text: 'Follow-up cadence stops long before the prospect is ready.' },
  { icon: '👤', text: 'Managers cannot see who is driving pipeline and who is drifting.' },
  { icon: '💬', text: 'Calls, texts, calendars, and deals live in disconnected systems.' },
];

export default function WhyTeamsBack({ animProgress = 0 }) {
  const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  // Shimmer sweeps across during 0 → 0.45 of animProgress
  // It's a vertical band that moves left (-10%) to right (110%)
  const shimmerP = Math.min(1, animProgress / 0.45);
  const shimmerX = -10 + shimmerP * 120; // -10% to 110%

  // Content revealed BEHIND the shimmer — uses shimmer position as a clip
  // Everything to the left of the shimmer is visible
  const revealX = shimmerX; // content clips in as shimmer passes

  // After shimmer passes (0.35+), staggered content animations
  const contentP = Math.max(0, Math.min(1, (animProgress - 0.30) / 0.70));

  const eyebrowP = easeOut(Math.min(1, contentP / 0.2));
  const headlineP = Math.max(0, Math.min(1, (contentP - 0.05) / 0.45));
  const bodyP = easeOut(Math.max(0, Math.min(1, (contentP - 0.40) / 0.25)));

  const cardDelays = [0.50, 0.60, 0.68, 0.76];
  const cardProgress = cardDelays.map(d =>
    easeOut(Math.max(0, Math.min(1, (contentP - d) / 0.18)))
  );

  return (
    <div className="wtb">

      {/* Gold shimmer sweep layer — sits on top, moves left to right */}
      <div
        className="wtb__shimmer"
        style={{
          // Once shimmer fully exits (shimmerP=1), hide it
          opacity: shimmerP >= 1 ? 0 : 1,
          background: `linear-gradient(
            to right,
            transparent 0%,
            rgba(201,168,76,0.08) 20%,
            rgba(201,168,76,0.22) 48%,
            rgba(255,220,100,0.35) 50%,
            rgba(201,168,76,0.22) 52%,
            rgba(201,168,76,0.08) 80%,
            transparent 100%
          )`,
          transform: `translateX(${shimmerX - 50}%)`,
        }}
      />

      {/* Reveal mask — everything left of shimmer is visible */}
      {/* We achieve this by clipping the content div */}
      <div
        className="wtb__content"
        style={{
          clipPath: `inset(0 ${Math.max(0, 100 - revealX)}% 0 0)`,
        }}
      >
        <div className="wtb__header">
          <div
            className="wtb__eyebrow"
            style={{
              opacity: eyebrowP,
              transform: `translateY(${(1 - eyebrowP) * 10}px)`,
            }}
          >
            Why Teams Lose Revenue
          </div>

          <h2 className="wtb__headline">
            {['The','gap','between','inbound','lead','and','disciplined','follow-up','destroys','deal','volume.'].map((word, i) => {
              const wP = easeOut(Math.max(0, Math.min(1, (headlineP - i * 0.06) / 0.25)));
              return (
                <span
                  key={i}
                  className="wtb__word"
                  style={{
                    opacity: wP,
                    transform: `translateY(${(1 - wP) * 20}px)`,
                    display: 'inline-block',
                    marginRight: '0.25em',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </h2>

          <p
            className="wtb__body"
            style={{
              opacity: bodyP,
              transform: `translateY(${(1 - bodyP) * 10}px)`,
            }}
          >
            Most real estate operators do not have a lead problem.<br />
            They have an execution problem.
          </p>
        </div>

        <div className="wtb__cards">
          {PAIN_POINTS.map((point, i) => {
            const cp = cardProgress[i];
            return (
              <div
                key={i}
                className="wtb__card"
                style={{
                  opacity: cp,
                  transform: `translateY(${(1 - cp) * 28}px)`,
                }}
              >
                <div
                  className="wtb__card-icon"
                  style={{ transform: `scale(${0.65 + cp * 0.35})` }}
                >
                  {point.icon}
                </div>
                <p className="wtb__card-text">{point.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
