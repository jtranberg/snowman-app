import './IntroModal.css';

export default function IntroModal({ onDismiss }) {
  return (
    <div className="intro-modal-overlay">
      <div className="intro-modal">
        <h2>❄️ Welcome to Project Snowman</h2>
        <p>
          You are witnessing the live evolution of an engineering marvel.
          <br /><br />
          <strong>Project Snowman</strong> is a real-time experiment in carbon capture,
          sensor integration, wireless communication, and environmental feedback—all embedded in a mobile vehicle platform.
        </p>
        <p>
          Only a select few have been granted access to view this development as it unfolds. 
          You’ll see live updates, system changes, and engineering decisions in real-time.
        </p>
        <p>
          This is not a simulation. This is the making of something revolutionary.
        </p>
        <button onClick={onDismiss}>Enter the Project</button>
      </div>
    </div>
  );
}
