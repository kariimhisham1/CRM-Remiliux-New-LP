import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollTransition from './components/ScrollTransition';
import WhyTeams from './components/WhyTeams';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <ScrollTransition />
      <WhyTeams />
    </div>
  );
}
