import React from 'react';
import Navbar from './components/Navbar';
import ScrollTransition from './components/ScrollTransition';
import WhyTeams from './components/WhyTeams';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <ScrollTransition />
      <WhyTeams />
    </div>
  );
}
