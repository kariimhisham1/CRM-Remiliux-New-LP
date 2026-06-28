import React, { useEffect, useRef, useState } from 'react';
import './WhyTeams.css';

const PAIN_POINTS = [
  {
    icon: '💼',
    text: 'Leads are forgotten the moment acquisition volume increases.',
  },
  {
    icon: '⏱',
    text: 'Follow-up cadence stops long before the prospect is ready.',
  },
  {
    icon: '👤',
    text: 'Managers cannot see who is driving pipeline and who is drifting.',
  },
  {
    icon: '💬',
    text: 'Calls, texts, calendars, and deals live in disconnected systems.',
  },
];

export default function WhyTeams() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`why ${visible ? 'why--visible' : ''}`} ref={sectionRef}>
      <div className="why__inner">
        <div className="why__header">
          <div className="why__eyebrow">Why Teams Lose Revenue</div>
          <h2 className="why__headline">
            The gap between inbound lead<br />
            and disciplined follow-up<br />
            destroys deal volume.
          </h2>
          <p className="why__body">
            Most real estate operators do not have a lead problem. They have an execution problem.<br />
            Remiliux closes that gap with operating rigor across the full revenue system.
          </p>
        </div>

        <div className="why__cards">
          {PAIN_POINTS.map((point, i) => (
            <div
              key={i}
              className="why__card"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="why__card-icon">{point.icon}</div>
              <p className="why__card-text">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
