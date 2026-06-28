import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import './Navbar.css';

const NAV_LINKS = ['Features', 'Solutions', 'Pricing', 'Resources', 'About'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__logo">
        <img src={logo} alt="Remiliux logo" className="navbar__logo-img" />
        <div className="navbar__logo-text">
          <span className="navbar__brand">REMILIUX</span>
          <span className="navbar__sub">REAL ESTATE CRM</span>
        </div>
      </div>

      <ul className="navbar__links">
        {NAV_LINKS.map(link => (
          <li key={link}>
            <a href={`#${link.toLowerCase()}`} className="navbar__link">{link}</a>
          </li>
        ))}
      </ul>

      <div className="navbar__actions">
        <button className="btn-ghost">Log in</button>
        <button className="btn-gold">Book a Demo</button>
      </div>
    </nav>
  );
}
