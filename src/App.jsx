import React from 'react';
import Navbar from './components/Navbar';
import ScrollTransition from './components/ScrollTransition';
import WhyTeams from './components/WhyTeams';
import TeamPerformance from './components/TeamPerformance';
export default function App() {
  return (
    <div className="app">
      <Navbar />
      <ScrollTransition />
      <WhyTeams />
      <TeamPerformance />
    </div>
  );
}
