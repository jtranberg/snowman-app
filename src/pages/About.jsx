import "./About.css";

export default function About() {
  return (
    <div>
      <h2>About</h2>
      <div className="about-container">
        <h1>❄️ About Project Snowman</h1>
        <p className="mission">
          Project Snowman is your futuristic carbon-capturing companion —
          transforming every drive into a cleaner breath for the planet.
        </p>

        <div className="about-sections">
          <section>
            <h2>🧠 Mission</h2>
            <p>
              Our goal is to empower individuals to offset emissions in
              real-time by using smart, (insert secret  here.).
              It's gamified. It's measurable. It's the future.
            </p>
          </section>

          <section>
            <h2>🧪 Technology</h2>
            <p>
              This part is secret...<br></br>

              Project Snowman uses a proprietary combination of 
              xxxxx xxxxx xxxxxxxxxx
              xxxxxx xxxxxxx xxxxxxxx xxx
              xxxxxx xxxxxx xxxxxxx  neutralize carbon — even converting it
              into xxxx forms.
            </p>
          </section>

          <section>
            <h2>🎖️ The Snowman Agent</h2>
            <p>
              Your Snowman grows stronger the more you drive clean. Level up,
              track your impact, and become an agent of climate change —
              literally.
            </p>
          </section>
        </div>

        <footer className="about-footer">
          <p>🧊 Built with science, style, and a mission to cool the world.</p>
        </footer>
      </div>
    </div>
  );
}
