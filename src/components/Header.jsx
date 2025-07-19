import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <img src="/logo.png" alt="Project Snowman Logo" className="logo" />
      </div>
      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
  );
}
