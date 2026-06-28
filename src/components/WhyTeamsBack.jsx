import React from 'react';
import './WhyTeamsBack.css';

const PAIN_POINTS = [
  { icon: '💼', text: 'Leads are forgotten the moment acquisition volume increases.' },
  { icon: '⏱', text: 'Follow-up cadence stops long before the prospect is ready.' },
  { icon: '👤', text: 'Managers cannot see who is driving pipeline and who is drifting.' },
  { icon: '💬', text: 'Calls, texts, calendars, and deals live in disconnected systems.' },
];

export default function WhyTeamsBack({ animProgress = 0 }) {
  // animProgress: 0 = just revealed, 1 = fully settled
  // Driven by phase3 from ScrollTransition

  // Eyebrow appears first
  const eyebrowP = Math.min(1, animProgress / 0.2);

  // Headline words stagger in
  const headlineP = Math.max(0, Math.min(1, (animProgress - 0.1) / 0.4));

  // Body text after headline
  const bodyP = Math.max(0, Math.min(1, (animProgress - 0.35) / 0.25));

  // Cards cascade in one by one
  const cardDelays = [0.45, 0.55, 0.65, 0.72];
  const cardProgress = cardDelays.map(d =>
    Math.max(0, Math.min(1, (animProgress - d) / 0.2))
  );

  const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  return (
    <div className="wtb">
      <div className="wtb__header">

        {/* Eyebrow */}
        <div
          className="wtb__eyebrow"
          style={{
            opacity: ease(eyebrowP),
            transform: `translateY(${(1 - ease(eyebrowP)) * 12}px)`,
          }}
        >
          Why Teams Lose Revenue
        </div>

        {/* Headline — each word animates independently */}
        <h2 className="wtb__headline">
          {['The', 'gap', 'between', 'inbound', 'lead', 'and', 'disciplined', 'follow-up', 'destroys', 'deal', 'volume.'].map((word, i) => {
            const wordP = Math.max(0, Math.min(1, (headlineP - i * 0.07) / 0.3));
            const e = ease(wordP);
            return (
              <span
                key={i}
                className="wtb__word"
                style={{
                  opacity: e,
                  transform: `translateY(${(1 - e) * 24}px)`,
                  display: 'inline-block',
                  marginRight: '0.25em',
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>

        {/* Body */}
        <p
          className="wtb__body"
          style={{
            opacity: ease(bodyP),
            transform: `translateY(${(1 - ease(bodyP)) * 12}px)`,
          }}
        >
          Most real estate operators do not have a lead problem.<br />
          They have an execution problem.
        </p>
      </div>

      {/* Pain point cards */}
      <div className="wtb__cards">
        {PAIN_POINTS.map((point, i) => {
          const cp = ease(cardProgress[i]);
          return (
            <div
              key={i}
              className="wtb__card"
              style={{
                opacity: cp,
                transform: `translateY(${(1 - cp) * 32}px)`,
              }}
            >
              <div
                className="wtb__card-icon"
                style={{
                  transform: `scale(${0.7 + cp * 0.3})`,
                }}
              >
                {point.icon}
              </div>
              <p className="wtb__card-text">{point.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
