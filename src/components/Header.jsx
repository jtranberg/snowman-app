import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header style={{ padding: '1rem', background: '#0f172a', color: 'white' }}>
      <nav>
        <Link to="/">Home</Link> | <Link to="/dashboard">Dashboard</Link> | <Link to="/learn">Learn</Link>
      </nav>
    </header>
  );
}
