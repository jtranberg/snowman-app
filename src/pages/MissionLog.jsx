import { useState, useEffect } from "react";
import "./MissionLog.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function MissionLog() {
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/logs`);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch mission logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !image) return;

    const formData = new FormData();
    formData.append("author", "Commander Jay");
    formData.append("message", message);
    if (image) formData.append("image", image);

    try {
      const res = await fetch(`${API_URL}/api/logs`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("");
        setImage(null);
        fetchLogs();
      }
    } catch (err) {
      console.error("Error posting log:", err);
    }
  };

  return (
    <div className="mission-log-container">
      <h1>❄️🖥️ Mission Log</h1>

      <form className="log-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter your mission update..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="file"
          name="image" // ← 🔥 REQUIRED for multer to pick up the file
          accept="image/*"
          onChange={handleImageChange}
        />

        <button type="submit">Submit Log</button>
      </form>

      <div className="log-entries">
        {logs.map((log) => (
          <div key={log._id} className="log-entry">
            <div className="log-header">
              <strong>{log.author}</strong> —{" "}
              {new Date(log.timestamp).toLocaleString()}
            </div>
            <p>{log.message || "(Image Only Log)"}</p>
            {log.image && (
              <img
                src={log.image.replace("/upload/", "/upload/w_300,c_limit/")}
                alt="Attached"
                className="log-image"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
