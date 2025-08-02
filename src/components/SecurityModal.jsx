import { useState } from "react";
import "./SecurityModal.css";

export default function SecurityModal({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const correctPassword = "snowman"; // 🔒 You can move this to `.env` if needed

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === correctPassword) {
      sessionStorage.setItem("accessGranted", "true");
      onUnlock();
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  return (
    <div className="security-modal-overlay">
      <div className="security-modal">
        <h2>❄️ Welcome to Project Snowman</h2>
        <p>You are part of a select few invited to view this live project.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter access password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Unlock</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
