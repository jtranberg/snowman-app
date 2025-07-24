import "./Contact.css";

export default function Contact() {
  return (
    <div>
      <h2>Contact</h2>
      <div className="contact-container">
        <h1>📬 Contact Project Snowman</h1>
        <p className="intro">
          Got questions, ideas, or want to partner with us? Drop us a message —
          the Snowman Squad is listening.
        </p>

        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            Name
            <input type="text" placeholder="Your name" required />
          </label>

          <label>
            Email
            <input type="email" placeholder="you@example.com" required />
          </label>

          <label>
            Message
            <textarea
              placeholder="What would you like to share?"
              required
            ></textarea>
          </label>

          <button type="submit">❄️ Send Message</button>
        </form>

        <div className="contact-footer">
          <p>
            Or reach out directly:{" "}
            <a href="mailto:devjaytranberg@gmail.com">devjaytranberg@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
