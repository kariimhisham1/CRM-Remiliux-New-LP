import React, { useEffect, useRef, useState } from 'react';
import './WhyTeams.css';

const FEATURES = [
  { icon: '📋', title: 'Lead Management', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '🔔', title: 'Smart Follow-Up Automation', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '💬', title: 'SMS Campaigns', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '✉️', title: 'Email Campaigns', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '📞', title: 'Voicemail Drops', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '⚙️', title: 'Pipeline Management', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '📱', title: 'Dialpad Integration', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '📅', title: 'Calendar Management', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '✅', title: 'Task Management', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '👥', title: 'Team Accountability', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '📊', title: 'Reporting & Analytics', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
  { icon: '📈', title: 'Deal Lifecycle Tracking', desc: 'Command the workflow with less manual overhead and better accountability from first touch to signed contract.' },
];

export default function WhyTeams() {
  const sectionRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.idx);
            // Stagger each card in
            setTimeout(() => {
              setVisibleCards(prev => new Set([...prev, idx]));
            }, idx * 60);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const cards = sectionRef.current?.querySelectorAll('.why__card');
    cards?.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="why" ref={sectionRef}>
      <div className="why__inner">

        {/* Header */}
        <div className="why__header">
          <div className="why__eyebrow">Platform Capabilities</div>
          <h2 className="why__headline">
            Built for operators who need<br />
            control, visibility, and<br />
            conversion at scale.
          </h2>
          <p className="why__body">
            Every surface is designed to help acquisition teams execute faster without losing clarity. The
            product language stays CRM-native while the presentation stays premium.
          </p>
        </div>

        {/* 3-column dark card grid */}
        <div className="why__cards">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className={`why__card ${visibleCards.has(i) ? 'why__card--visible' : ''}`}
              data-idx={i}
            >
              <div className="why__card-icon">
                <span>{f.icon}</span>
              </div>
              <div className="why__card-body">
                <div className="why__card-title">{f.title}</div>
                <p className="why__card-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
