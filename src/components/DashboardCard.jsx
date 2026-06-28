import React from 'react';
import logo from '../assets/logo.png';
import './DashboardCard.css';

export default function DashboardCard() {
  return (
    <div className="dash">
      {/* Sidebar */}
      <div className="dash__sidebar">
        <div className="dash__sidebar-logo">
          <img src={logo} alt="Remiliux" />
        </div>
        <div className="dash__sidebar-section-label">Core</div>
        <ul className="dash__sidebar-nav">
          {['Dashboard', 'Leads', 'Actions', 'Transactions', 'Buyers', 'Email Inbox', 'Templates'].map((item, i) => (
            <li key={item} className={`dash__sidebar-item ${i === 0 ? 'active' : ''}`}>
              <span className="dash__sidebar-icon">
                {i === 0 ? '⊞' : i === 1 ? '◈' : i === 2 ? '⚡' : i === 3 ? '⇄' : i === 4 ? '♟' : i === 5 ? '✉' : '▤'}
              </span>
              {item}
            </li>
          ))}
        </ul>
        <div className="dash__sidebar-footer">
          <div className="dash__sidebar-user">
            <div className="dash__avatar">C</div>
            <div>
              <div className="dash__user-name">CashKeys</div>
              <div className="dash__user-role">Real Estate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="dash__main">
        <div className="dash__breadcrumb">CRM &rsaquo; Dashboard</div>

        <div className="dash__welcome">
          <h2>Welcome back, <span className="dash__name">Karim 👋</span></h2>
          <p>Your real estate business is moving forward.</p>
        </div>

        {/* Stats row */}
        <div className="dash__stats">
          {[
            { icon: '👥', label: 'New Leads', value: '128', delta: '+18% vs last week' },
            { icon: '📞', label: 'Calls Made', value: '96', delta: '+12% vs last week' },
            { icon: '💬', label: 'Texts Sent', value: '247', delta: '+22% vs last week' },
            { icon: '🔥', label: 'Hot Leads', value: '32', delta: '+28% vs last week' },
          ].map(s => (
            <div key={s.label} className="dash__stat-card">
              <div className="dash__stat-icon">{s.icon}</div>
              <div>
                <div className="dash__stat-label">{s.label}</div>
                <div className="dash__stat-value">{s.value}</div>
                <div className="dash__stat-delta">{s.delta}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div className="dash__grid">
          {/* Top achievers */}
          <div className="dash__widget">
            <div className="dash__widget-title">Top Achievers</div>
            {[
              ['Sarah Johnson', '34 Leads'],
              ['Michael Brown', '28 Leads'],
              ['Emily Davis', '21 Leads'],
              ['James Wilson', '18 Leads'],
              ['Olivia Martinez', '16 Leads'],
            ].map(([name, count]) => (
              <div key={name} className="dash__achiever-row">
                <div className="dash__achiever-avatar">{name[0]}</div>
                <span className="dash__achiever-name">{name}</span>
                <span className="dash__achiever-count">{count}</span>
              </div>
            ))}
            <div className="dash__widget-link">View all achievers →</div>
          </div>

          {/* Pipeline */}
          <div className="dash__widget">
            <div className="dash__widget-title">Pipeline Overview</div>
            <div className="dash__pipeline-center">
              <div className="dash__donut">
                <span>68%</span>
                <small>In Progress</small>
              </div>
            </div>
            <div className="dash__pipeline-legend">
              {[['New Leads','#C9A84C','128'],['Contacted','#a08030','96'],['Qualified','#7a6020','84'],['Proposal Sent','#534010','32'],['Closed','#2a2010','24']].map(([l,c,v])=>(
                <div key={l} className="dash__legend-row">
                  <span className="dash__legend-dot" style={{background:c}}/>
                  <span>{l}</span>
                  <span className="dash__legend-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deals closed */}
          <div className="dash__widget">
            <div className="dash__widget-title">Deals Closed This Week</div>
            <div className="dash__deals-num">14</div>
            <div className="dash__deals-delta">+27% vs last week</div>
            <div className="dash__deals-divider"/>
            <div className="dash__deals-label">Total Closed Value</div>
            <div className="dash__deals-value">$452,000</div>
            <div className="dash__deals-delta">+35% vs last week</div>
            <div className="dash__widget-link" style={{marginTop:'auto'}}>View all transactions →</div>
          </div>
        </div>
      </div>
    </div>
  );
}
