import { useState, useEffect } from 'react';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Alternate hamburger/logo every 0.5s
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setShowLogo(prev => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isMobile]);

  return (
    <header className="header">
      {/* Always-visible logo on the left */}
      <div className="logo-container">
        <img src="/logo.png" alt="Project Snowman Logo" className="logo" />
      </div>

      {/* Nav links for desktop */}
      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <a href="/">🏠 Home</a>
        <a href="/dashboard">📊 Dashboard</a>
        <a href="/score">🏅 My Score</a>
        <a href="/about">❄️ About</a>
        <a href="/contact">📬 Contact</a>
      </nav>

      {/* Mobile toggle button on the RIGHT */}
      {isMobile && (
        <div
          className={`mobile-toggle ${!menuOpen ? 'pulse' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {showLogo ? (
            <img src="/logo.png" alt="Toggle Menu" className="hamburger-logo" />
          ) : (
            <div className="hamburger-icon">☰</div>
          )}
        </div>
      )}
    </header>
  );
}
