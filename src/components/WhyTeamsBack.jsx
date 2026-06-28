import React from 'react';
import './WhyTeamsBack.css';

const PAIN_POINTS = [
  { icon: '💼', text: 'Leads are forgotten the moment acquisition volume increases.' },
  { icon: '⏱', text: 'Follow-up cadence stops long before the prospect is ready.' },
  { icon: '👤', text: 'Managers cannot see who is driving pipeline and who is drifting.' },
  { icon: '💬', text: 'Calls, texts, calendars, and deals live in disconnected systems.' },
];

export default function WhyTeamsBack({ animProgress = 0 }) {
  // Shimmer sweeps left→right during 0→0.6, then fades out
  const shimmerP = Math.min(1, animProgress / 0.6);
  const shimmerX = -60 + shimmerP * 160; // -60% → 100%
  const shimmerOpacity = shimmerP >= 1 ? 0 : Math.min(1, shimmerP * 3);

  return (
    <div className="wtb">

      {/* Gold shimmer — purely decorative, content always visible behind it */}
      <div
        className="wtb__shimmer"
        style={{
          opacity: shimmerOpacity,
          transform: `translateX(${shimmerX}%)`,
        }}
      />

      {/* Content — always fully visible, no opacity/clip gating */}
      <div className="wtb__content">
        <div className="wtb__header">
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

        <div className="wtb__cards">
          {PAIN_POINTS.map((point, i) => (
            <div key={i} className="wtb__card">
              <div className="wtb__card-icon">{point.icon}</div>
              <p className="wtb__card-text">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
