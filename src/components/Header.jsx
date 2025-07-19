import { useState } from 'react';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/logo.png" alt="Project Snowman Logo" className="logo" />
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <a href="/">🏠 Home</a>
        <a href="/dashboard">📊 Dashboard</a>
        <a href="/score">🏅 My Score</a>
        <a href="/about">❄️ About</a>
        <a href="/contact">📬 Contact</a>
      </nav>
    </header>
  );
}
