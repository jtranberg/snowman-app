import './WelcomeBanner.css';

export default function WelcomeBanner({ name = "Driver", level = 3 }) {
  return (
    <div className="welcome-banner">
      <h2>Welcome back, {name}! ❄️</h2>
      <p>You're currently <strong>Level {level}</strong> — keep driving to reach the next milestone!</p>
    </div>
  );
}
