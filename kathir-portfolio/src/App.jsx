import React, { useEffect, useState, useRef } from "react";

/* ── Google Fonts injected via style tag ── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
    @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #060910;
      --bg2: #0c1120;
      --surface: #111827;
      --surface2: #1a2235;
      --border: #1e2d47;
      --accent: #38bdf8;
      --accent2: #818cf8;
      --accent3: #34d399;
      --text: #e2e8f0;
      --muted: #64748b;
      --heading: #f8fafc;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Outfit', sans-serif;
      overflow-x: hidden;
    }

    ::selection { background: var(--accent); color: var(--bg); }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

    /* Noise overlay */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
      opacity: 0.025;
      pointer-events: none;
      z-index: 9999;
    }

    /* Glow blobs */
    .blob {
      position: fixed;
      border-radius: 50%;
      filter: blur(120px);
      pointer-events: none;
      z-index: 0;
      animation: blobDrift 20s ease-in-out infinite alternate;
    }
    .blob-1 { width: 600px; height: 600px; background: rgba(56,189,248,0.07); top: -200px; left: -200px; }
    .blob-2 { width: 500px; height: 500px; background: rgba(129,140,248,0.06); bottom: 10%; right: -100px; animation-delay: -10s; }
    .blob-3 { width: 400px; height: 400px; background: rgba(52,211,153,0.05); top: 50%; left: 40%; animation-delay: -5s; }

    @keyframes blobDrift {
      from { transform: translate(0, 0) scale(1); }
      to   { transform: translate(40px, 30px) scale(1.08); }
    }

    /* Nav */
    .nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      padding: 20px 0;
      transition: background 0.4s, border-color 0.4s;
    }
    .nav.scrolled {
      background: rgba(6,9,16,0.85);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
    }
    .nav-inner {
      max-width: 1200px; margin: 0 auto; padding: 0 48px;
      display: flex; justify-content: space-between; align-items: center;
      width: 100%;
    }
    .nav-logo {
      font-family: 'Clash Display', sans-serif;
      font-size: 22px; font-weight: 800;
      color: var(--accent);
      letter-spacing: 0.03em;
      flex: 0 0 auto;
    }
    .nav-logo span { color: var(--accent2); }
    .nav-links { display: flex; gap: 36px; list-style: none; }
    .nav-links a {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px; letter-spacing: 0.08em;
      color: var(--muted);
      text-decoration: none;
      transition: color 0.2s;
      position: relative;
    }
    .nav-links a::after {
      content: '';
      position: absolute; bottom: -4px; left: 0; right: 0; height: 1px;
      background: var(--accent);
      transform: scaleX(0); transform-origin: left;
      transition: transform 0.25s ease;
    }
    .nav-links a:hover { color: var(--accent); }
    .nav-links a:hover::after { transform: scaleX(1); }

    /* Hero */
    .hero {
      min-height: 100vh;
      display: flex; align-items: center;
      padding: 120px 32px 80px;
      position: relative; z-index: 1;
    }
    .hero-inner {
      max-width: 1100px; margin: 0 auto; width: 100%;
      display: grid; grid-template-columns: 1fr 380px; gap: 80px; align-items: center;
    }
    .hero-tag {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.12em;
      color: var(--accent); background: rgba(56,189,248,0.08);
      border: 1px solid rgba(56,189,248,0.2);
      padding: 6px 14px; border-radius: 100px; margin-bottom: 24px;
      animation: fadeSlideUp 0.6s ease both;
    }
    .hero-tag::before { content: '●'; font-size: 8px; animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

    .hero-name {
      font-family: 'Clash Display', sans-serif;
      font-size: clamp(44px, 7vw, 72px);
      font-weight: 800; line-height: 1.05;
      color: var(--heading);
      animation: fadeSlideUp 0.6s 0.1s ease both;
    }
    .hero-name .hl { 
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .hero-sub {
      font-size: 18px; color: var(--muted); margin-top: 16px; line-height: 1.7;
      animation: fadeSlideUp 0.6s 0.2s ease both;
    }
    .hero-btns {
      display: flex; gap: 16px; margin-top: 40px;
      animation: fadeSlideUp 0.6s 0.3s ease both;
    }
    .btn-primary {
      background: var(--accent); color: var(--bg);
      padding: 14px 28px; border-radius: 10px;
      font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 15px;
      text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 0 24px rgba(56,189,248,0.35);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 36px rgba(56,189,248,0.5); }
    .btn-outline {
      border: 1px solid var(--border); color: var(--text);
      padding: 14px 28px; border-radius: 10px;
      font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 15px;
      text-decoration: none; transition: all 0.2s;
      background: rgba(255,255,255,0.02);
    }
    .btn-outline:hover { border-color: var(--accent); color: var(--accent); background: rgba(56,189,248,0.05); }

    /* Profile card */
    .profile-card {
      position: relative;
      animation: fadeSlideUp 0.6s 0.2s ease both;
    }
    .profile-card::before {
      content: '';
      position: absolute; inset: -2px;
      background: linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3));
      border-radius: 28px; z-index: -1;
      opacity: 0.6;
      animation: rotateBorder 6s linear infinite;
    }
    @keyframes rotateBorder {
      from { filter: hue-rotate(0deg); }
      to   { filter: hue-rotate(360deg); }
    }
    .profile-img {
      width: 100%; aspect-ratio: 1;
      object-fit: cover; border-radius: 26px;
      display: block;
      background: var(--surface);
    }
    .profile-badge {
      position: absolute; bottom: -16px; left: 50%; transform: translateX(-50%);
      background: var(--surface2); border: 1px solid var(--border);
      padding: 10px 20px; border-radius: 100px;
      font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.1em;
      color: var(--accent3); white-space: nowrap;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }

    /* Section base */
    .section {
      padding: 100px 32px;
      position: relative; z-index: 1;
    }
    .section-inner { max-width: 1100px; margin: 0 auto; }
    .section-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;
      color: var(--accent); margin-bottom: 12px;
    }
    .section-title {
      font-family: 'Clash Display', sans-serif;
      font-size: clamp(28px, 4vw, 42px); font-weight: 800;
      color: var(--heading); margin-bottom: 48px;
    }
    .section-divider {
      border: none; border-top: 1px solid var(--border); margin: 0;
    }

    /* About */
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
    .about-terminal {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px; overflow: hidden;
    }
    .terminal-bar {
      background: var(--surface2); padding: 12px 16px;
      display: flex; align-items: center; gap: 8px;
      border-bottom: 1px solid var(--border);
    }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot-red { background: #ff5f57; }
    .dot-yellow { background: #febc2e; }
    .dot-green { background: #28c840; }
    .terminal-filename {
      font-family: 'JetBrains Mono', monospace; font-size: 12px;
      color: var(--muted); margin-left: 8px;
    }
    .terminal-body {
      padding: 24px; font-family: 'JetBrains Mono', monospace;
      font-size: 13px; line-height: 1.8; color: #94a3b8;
    }
    .terminal-body .caret { color: var(--accent); animation: blink 1s step-end infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .terminal-body .keyword { color: var(--accent2); }
    .terminal-body .string { color: var(--accent3); }
    .terminal-body .comment { color: var(--muted); font-style: italic; }

    .about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .stat-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 14px; padding: 24px;
      transition: border-color 0.2s, transform 0.2s;
    }
    .stat-card:hover { border-color: var(--accent); transform: translateY(-3px); }
    .stat-num {
      font-family: 'Clash Display', sans-serif; font-size: 36px; font-weight: 800;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .stat-label { font-size: 13px; color: var(--muted); margin-top: 4px; }

    /* Skills */
    .skills-bg { background: var(--bg2); }
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
    .skill-bar-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 14px; padding: 20px;
      transition: border-color 0.2s, transform 0.2s;
    }
    .skill-bar-card:hover { border-color: var(--accent2); transform: translateY(-3px); }
    .skill-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .skill-name { font-family: 'Clash Display', sans-serif; font-weight: 600; font-size: 15px; color: var(--heading); }
    .skill-pct { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--accent); }
    .skill-track { height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; }
    .skill-fill {
      height: 100%; border-radius: 3px;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      transition: width 1.2s cubic-bezier(0.4,0,0.2,1);
      width: 0%;
    }

    /* Projects */
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: 24px; }
    .proj-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 20px; padding: 36px;
      position: relative; overflow: hidden;
      transition: transform 0.25s, border-color 0.25s;
      cursor: default;
    }
    .proj-card::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(56,189,248,0.04), transparent);
      opacity: 0; transition: opacity 0.3s;
    }
    .proj-card:hover { transform: translateY(-4px); border-color: var(--accent); }
    .proj-card:hover::before { opacity: 1; }
    .proj-num {
      font-family: 'Clash Display', sans-serif; font-size: 56px; font-weight: 800;
      color: rgba(56,189,248,0.07); position: absolute; top: 20px; right: 28px;
      line-height: 1;
    }
    .proj-icon {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; margin-bottom: 20px;
    }
    .proj-title {
      font-family: 'Clash Display', sans-serif; font-size: 20px; font-weight: 700;
      color: var(--heading); margin-bottom: 12px;
    }
    .proj-desc { font-size: 14px; color: var(--muted); line-height: 1.75; }
    .proj-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px; }
    .tag {
      font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.06em;
      padding: 4px 10px; border-radius: 6px;
      background: rgba(56,189,248,0.08); color: var(--accent);
      border: 1px solid rgba(56,189,248,0.15);
    }

    /* Contact */
    .contact-bg { background: var(--bg2); }
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
    .contact-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 20px; padding: 40px;
    }
    .contact-item {
      display: flex; align-items: center; gap: 16px;
      padding: 16px 0; border-bottom: 1px solid var(--border);
    }
    .contact-item:last-child { border-bottom: none; }
    .contact-icon {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; font-size: 18px;
      background: rgba(56,189,248,0.08); flex-shrink: 0;
    }
    .contact-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); letter-spacing: 0.1em; }
    .contact-val { font-size: 14px; color: var(--text); margin-top: 2px; word-break: break-all; }
    .cta-box {
      background: linear-gradient(135deg, rgba(56,189,248,0.1), rgba(129,140,248,0.1));
      border: 1px solid rgba(56,189,248,0.2);
      border-radius: 20px; padding: 40px; text-align: center;
    }
    .cta-title { font-family: 'Clash Display', sans-serif; font-size: 28px; font-weight: 800; color: var(--heading); margin-bottom: 12px; }
    .cta-sub { color: var(--muted); font-size: 15px; margin-bottom: 28px; line-height: 1.7; }

    /* Footer */
    .footer {
      padding: 32px; text-align: center;
      font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.1em;
      color: var(--muted); border-top: 1px solid var(--border);
      position: relative; z-index: 1;
    }
    .footer span { color: var(--accent); }

    /* Animations */
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .reveal {
      opacity: 0; transform: translateY(32px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    /* Hamburger */
    .hamburger {
      display: none;
      flex-direction: column; justify-content: center; align-items: center;
      width: 40px; height: 40px; cursor: pointer;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 10px; gap: 5px; flex-shrink: 0;
      transition: border-color 0.2s;
    }
    .hamburger:hover { border-color: var(--accent); }
    .hamburger-bar {
      width: 20px; height: 2px;
      background: var(--text); border-radius: 2px;
      transition: transform 0.35s cubic-bezier(0.4,0,0.2,1),
                  opacity 0.25s ease, width 0.3s ease;
      transform-origin: center;
    }
    .hamburger.open .hamburger-bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.open .hamburger-bar:nth-child(2) { opacity: 0; width: 0; }
    .hamburger.open .hamburger-bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* Mobile drawer */
    .mobile-menu {
      position: fixed; top: 0; right: 0; bottom: 0;
      width: 280px; z-index: 99;
      background: var(--bg2);
      border-left: 1px solid var(--border);
      display: flex; flex-direction: column;
      padding: 100px 32px 40px;
      transform: translateX(100%);
      transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
    }
    .mobile-menu.open { transform: translateX(0); }

    .mobile-menu-overlay {
      position: fixed; inset: 0; z-index: 98;
      background: rgba(6,9,16,0.7); backdrop-filter: blur(4px);
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .mobile-menu-overlay.open { opacity: 1; pointer-events: all; }

    .mobile-nav-links { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .mobile-nav-links li { opacity: 0; transform: translateX(20px); transition: opacity 0.3s ease, transform 0.3s ease; }
    .mobile-menu.open .mobile-nav-links li { opacity: 1; transform: translateX(0); }
    .mobile-menu.open .mobile-nav-links li:nth-child(1) { transition-delay: 0.1s; }
    .mobile-menu.open .mobile-nav-links li:nth-child(2) { transition-delay: 0.15s; }
    .mobile-menu.open .mobile-nav-links li:nth-child(3) { transition-delay: 0.2s; }
    .mobile-menu.open .mobile-nav-links li:nth-child(4) { transition-delay: 0.25s; }

    .mobile-nav-links a {
      display: block; padding: 14px 16px;
      font-family: 'Clash Display', sans-serif;
      font-size: 22px; font-weight: 600;
      color: var(--muted); text-decoration: none;
      border-radius: 10px;
      transition: color 0.2s, background 0.2s;
    }
    .mobile-nav-links a:hover { color: var(--accent); background: rgba(56,189,248,0.06); }

    .mobile-menu-footer {
      margin-top: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; color: var(--muted); letter-spacing: 0.1em;
    }

    @media (max-width: 768px) {
      .nav-links { display: none; }
      .hamburger { display: flex; }
      .hero-inner { grid-template-columns: 1fr; text-align: center; }
      .profile-card { width: 260px; margin: 0 auto; }
      .hero-btns { justify-content: center; }
      .about-grid, .contact-grid { grid-template-columns: 1fr; }
      .projects-grid { grid-template-columns: 1fr; }
      .about-stats { grid-template-columns: 1fr 1fr; }
    }
  `}</style>
);

/* ══════════════════════════════════════════
   HOOKS
══════════════════════════════════════════ */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return scrolled;
}

function useReveal(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
}

/* ══════════════════════════════════════════
   MAIN
══════════════════════════════════════════ */
export default function App() {
  return (
    <>
      <GlobalStyles />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <footer className="footer">© 2026 <span>Kathirvelmuruganwanthan P</span> — Built with React</footer>
    </>
  );
}

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
function Navbar() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const links = ["About", "Skills", "Projects", "Contact"];

  const close = () => setOpen(false);

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-logo">Kathir<span>.</span>dev</div>

          {/* Desktop links */}
          <ul className="nav-links">
            {links.map(l => (
              <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
            ))}
          </ul>

          {/* Hamburger — mobile only */}
          <button
            className={`hamburger ${open ? "open" : ""}`}
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div className={`mobile-menu-overlay ${open ? "open" : ""}`} onClick={close} />

      {/* Drawer */}
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <ul className="mobile-nav-links">
          {links.map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} onClick={close}>{l}</a>
            </li>
          ))}
        </ul>
        <div className="mobile-menu-footer">© 2026 Kathir.dev</div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-inner">
        <div>
          <div className="hero-tag">Available for opportunities</div>
          <h1 className="hero-name">
            Full Stack<br /><span className="hl">Developer</span>
          </h1>
          <p className="hero-sub">
            Hi, I'm <strong style={{ color: "var(--text)" }}>Kathirvelmuruganwanthan P</strong>.<br />
            Building scalable web &amp; AI-powered applications<br />
            that solve real-world problems.
          </p>
          <div className="hero-btns">
            <a href="#contact" className="btn-primary">Get In Touch</a>
            <a href="#projects" className="btn-outline">View Projects →</a>
          </div>
        </div>
        <div className="profile-card">
          <img src="/profile.jpg" alt="Kathirvelmuruganwanthan" className="profile-img" />
          <div className="profile-badge">📍 Coimbatore, India</div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   ABOUT
══════════════════════════════════════════ */
const SUMMARY_TEXT = "Computer Science graduate and aspiring Full Stack Developer with hands-on experience in building real-time web applications using React.js, Node.js, Express.js, Python, and JavaScript. Skilled in developing RESTful APIs, integrating cloud services and delivering scalable solutions. Experienced in completing end-to-end projects, solving complex problems, and collaborating effectively in team environments. Passionate about continuous learning and applying modern development practices.";

function SummaryTyping() {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    setDisplayed("");
    const iv = setInterval(() => {
      i++;
      setDisplayed(SUMMARY_TEXT.slice(0, i));
      if (i >= SUMMARY_TEXT.length) clearInterval(iv);
    }, 18);
    return () => clearInterval(iv);
  }, [started]);

  return (
    <div ref={ref} style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "14px",
      padding: "28px 32px",
      borderLeft: "3px solid var(--accent)",
      position: "relative",
    }}>
      <div style={{
        position: "absolute", top: "14px", left: "20px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "10px", letterSpacing: "0.12em",
        color: "var(--accent)", opacity: 0.6,
        textTransform: "uppercase",
      }}>
        summary.txt
      </div>
      <p style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: "17px", lineHeight: 1.9,
        color: "var(--text)", marginTop: "18px",
        minHeight: "96px",
      }}>
        {displayed}
        {displayed.length < SUMMARY_TEXT.length && (
          <span style={{
            display: "inline-block", width: "2px", height: "1.1em",
            background: "var(--accent)", marginLeft: "2px",
            verticalAlign: "text-bottom",
            animation: "blink 1s step-end infinite",
          }} />
        )}
      </p>
    </div>
  );
}

function About() {
  const ref = useRef(null);
  useReveal(ref);

  const stats = [
    { num: "2+", label: "Years Coding" },
    { num: "5+", label: "Projects Built" },
    { num: "4+", label: "Tech Stacks Used" },
    { num: "10+", label: "GitHub Repos" },
  ];

  return (
    <section className="section" id="about" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="section-inner reveal" ref={ref}>
        <div className="section-label">// whoami</div>
        <h2 className="section-title">Professional Summary</h2>

        {/* Summary paragraph typing effect */}
        <div style={{ marginBottom: "48px" }}>
          <SummaryTyping />
        </div>

        <div className="about-grid">
          <div>
            <div className="about-terminal">
              <div className="terminal-bar">
                <div className="dot dot-red" />
                <div className="dot dot-yellow" />
                <div className="dot dot-green" />
                <span className="terminal-filename">profile.json</span>
              </div>
              <div className="terminal-body">
                <TerminalTyping lines={[
                  { text: "// Computer Science Graduate", type: "comment" },
                  { text: 'role: "Full Stack Developer",', type: "normal" },
                  { text: 'stack: ["React", "Node", "JavaScript", "Python"],', type: "normal" },
                  { text: 'db: ["MySQL", "MongoDB"],', type: "normal" },
                  { text: 'collab: "Team player & problem solver",', type: "normal" },
                  { text: 'learning: "Progress over perfection"', type: "string" },
                ]} />
              </div>
            </div>
          </div>
          <div className="about-stats">
            {stats.map(s => (
              <div className="stat-card" key={s.label}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   SKILLS
══════════════════════════════════════════ */
const SKILL_CATEGORIES = [
  {
    category: "Languages",
    icon: "</>",
    color: "var(--accent)",
    colorRgb: "56,189,248",
    skills: [{ name: "Python", pct: 80 }, { name: "JavaScript", pct: 88 }],
  },
  {
    category: "Front-End",
    icon: "🎭",
    color: "var(--accent2)",
    colorRgb: "129,140,248",
    skills: [{ name: "React.js", pct: 81 }, { name: "HTML", pct: 90 }, { name: "Tailwind CSS", pct: 82 }],
  },
  {
    category: "Back-End",
    icon: "⚙️",
    color: "var(--accent3)",
    colorRgb: "52,211,153",
    skills: [{ name: "Node.js", pct: 80 }, { name: "Express.js", pct: 68 }],
  },
  {
    category: "Databases",
    icon: "🗃️",
    color: "#fb923c",
    colorRgb: "251,146,60",
    skills: [{ name: "MySQL", pct: 85 }, { name: "MongoDB", pct: 75 }],
  },
  {
    category: "Version Control",
    icon: "🔀",
    color: "#f472b6",
    colorRgb: "244,114,182",
    skills: [{ name: "Git", pct: 88 }, { name: "GitHub", pct: 86 }],
  },
  {
    category: "Tools & Design",
    icon: "🎯",
    color: "#a78bfa",
    colorRgb: "167,139,250",
    skills: [{ name: "VS Code", pct: 92 }, { name: "Canva", pct: 80 }],
  },
];

function Skills() {
  const ref = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAnimate(true); el.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section skills-bg" id="skills" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="section-inner reveal" ref={ref}>
        <div className="section-label">// tech stack</div>
        <h2 className="section-title">Technical Skills</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px"
        }}>
          {SKILL_CATEGORIES.map((cat, i) => (
            <SkillCategoryCard key={cat.category} cat={cat} animate={animate} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillCategoryCard({ cat, animate, delay }) {
  const [visible, setVisible] = useState(false);
  const [barAnimate, setBarAnimate] = useState(false);

  useEffect(() => {
    if (!animate) return;
    const t1 = setTimeout(() => setVisible(true), delay);
    const t2 = setTimeout(() => setBarAnimate(true), delay + 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [animate, delay]);

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "18px",
      padding: "28px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.5s ease, transform 0.5s ease, border-color 0.2s",
      cursor: "default",
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = cat.color}
    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "10px",
          background: `rgba(${cat.colorRgb},0.12)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px", flexShrink: 0,
        }}>
          {cat.icon}
        </div>
        <span style={{
          fontFamily: "'Clash Display', sans-serif",
          fontWeight: 700, fontSize: "15px",
          color: "var(--heading)", letterSpacing: "0.01em",
        }}>
          {cat.category}
        </span>
      </div>

      {/* Skill rows with bar + percentage */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {cat.skills.map((skill, i) => (
          <div key={skill.name}>
            {/* Label row */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: "6px",
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px", letterSpacing: "0.04em",
                color: "var(--text)",
              }}>
                {skill.name}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px", color: cat.color,
                fontWeight: 500,
              }}>
                {barAnimate ? `${skill.pct}%` : "0%"}
              </span>
            </div>
            {/* Track */}
            <div style={{
              height: "5px", background: "var(--surface2)",
              borderRadius: "3px", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: "3px",
                background: `linear-gradient(90deg, rgba(${cat.colorRgb},0.6), ${cat.color})`,
                width: barAnimate ? `${skill.pct}%` : "0%",
                transition: `width ${0.9 + i * 0.15}s cubic-bezier(0.4,0,0.2,1)`,
                boxShadow: barAnimate ? `0 0 8px rgba(${cat.colorRgb},0.4)` : "none",
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PROJECTS
══════════════════════════════════════════ */
const PROJECTS = [
  {
    title: "SpendSmart – Expense Tracker",
    desc: "Modern expense tracking dashboard with category-based tracking, advanced multi-filter system, interactive donut chart via Recharts, and summary analytics. Fully responsive with persistent localStorage.",
    tags: ["React.js", "Vite", "Tailwind CSS", "Recharts", "LocalStorage"],
    icon: "💸",
    screenshot: "/screenshots/spendsmart.png",
    color: "rgba(251,146,60,0.12)",
    colorRgb: "251,146,60",
    demo: "https://lnkd.in/gBZqTzdV",
    github: "https://github.com/Kathirvel-123/SpendSmartApp_01.git",
  },
  {
    title: "NoteNest – Notes Management App",
    desc: "Google Keep–inspired notes app with tagging, pinning, archiving, trash/restore system, and full-text search. Clean dark glassmorphism UI with client-side persistence.",
    tags: ["React.js", "Vite", "Tailwind CSS", "React Router", "LocalStorage"],
    icon: "📝",
    screenshot: "/screenshots/notenest.png",
    color: "rgba(129,140,248,0.12)",
    colorRgb: "129,140,248",
    demo: "https://lnkd.in/gN3i2uwS",
    github: "https://github.com/Kathirvel-123/Notes_App.git",
  },
  {
    title: "MovieVerse – Movie & TV Search",
    desc: "Real-time movie and TV show search app powered by the OMDB API. Features detailed movie pages with cast, ratings, and plot, plus filtering by type and smooth routing.",
    tags: ["React.js", "Vite", "Tailwind CSS", "React Router", "OMDB API"],
    icon: "🎬",
    screenshot: "/screenshots/movieverse.png",
    color: "rgba(244,114,182,0.12)",
    colorRgb: "244,114,182",
    demo: "https://lnkd.in/gHQWPM2X",
    github: "https://github.com/Kathirvel-123/MovieVerse_app7.git",
  },
  {
    title: "SuperCart – Shopping Cart App",
    desc: "Full-featured shopping cart with FakeStore API integration, global state via Context API, cart quantity management, USD→INR conversion, and responsive card-based UI.",
    tags: ["React.js", "Vite", "Tailwind CSS", "Context API", "FakeStore API"],
    icon: "🛒",
    screenshot: "/screenshots/supercart.png",
    color: "rgba(167,139,250,0.12)",
    colorRgb: "167,139,250",
    demo: "https://lnkd.in/gsdAsCQ8",
    github: "https://github.com/Kathirvel-123/SuperCart_App6.git",
  },
  {
    title: "Alumni Association Platform",
    desc: "Full-stack networking portal with secure REST APIs, real-time messaging, and cloud-native architecture. Enables alumni discovery, event management, and document sharing.",
    tags: ["React.js", "Node.js", "AWS DynamoDB", "S3", "REST API"],
    icon: "🏛️",
    screenshot: "/screenshots/alumni.png",
    color: "rgba(56,189,248,0.12)",
    colorRgb: "56,189,248",
    demo: "https://your-alumni-demo-link.com",
    github: "https://github.com/kaviyarasan5556/ALUMNI-PORTAL.git",
  },
  {
    title: "Flora Finder – AI App",
    desc: "React Native mobile app powered by a CNN model trained to 98% accuracy for plant identification. Integrates Firebase for real-time sync and offline-first data management.",
    tags: ["React Native", "Python", "TensorFlow", "CNN", "Firebase"],
    icon: "🌿",
    screenshot: "/screenshots/flora.png",
    color: "rgba(52,211,153,0.12)",
    colorRgb: "52,211,153",
    demo: "https://your-flora-demo-link.com",
    github: "https://github.com/Kathirvel-123/Flora-Scanner.git",
  },
];

function ProjectScreenshot({ project: p, index: i }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div style={{
      width: "100%", height: "200px", borderRadius: "12px",
      overflow: "hidden", marginBottom: "24px",
      border: `1px solid rgba(${p.colorRgb},0.2)`,
      background: "var(--surface2)", flexShrink: 0,
      position: "relative", display: "flex",
      alignItems: "center", justifyContent: "center",
    }}>
      {imgError ? (
        <span style={{ fontSize: "52px" }}>{p.icon}</span>
      ) : (
        <img
          src={p.screenshot}
          alt={`${p.title} preview`}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "top",
            display: "block", transition: "transform 0.5s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          onError={() => setImgError(true)}
        />
      )}
      {/* Number badge */}
      <div style={{
        position: "absolute", top: "10px", left: "10px",
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
        border: `1px solid rgba(${p.colorRgb},0.3)`,
        borderRadius: "8px", padding: "3px 10px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "11px", color: `rgba(${p.colorRgb},1)`,
        letterSpacing: "0.08em",
      }}>
        0{i + 1}
      </div>
    </div>
  );
}

function Projects() {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <section className="section" id="projects" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="section-inner reveal" ref={ref}>
        <div className="section-label">// portfolio</div>
        <h2 className="section-title">Featured Projects</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(460px, 1fr))",
          gap: "24px",
        }}>
          {PROJECTS.map((p, i) => (
            <div
              key={p.title}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "36px",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.25s, border-color 0.25s",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = `rgba(${p.colorRgb},0.5)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              {/* Screenshot */}
              <ProjectScreenshot project={p} index={i} />

              {/* Title */}
              <div style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "19px", fontWeight: 700,
                color: "var(--heading)", marginBottom: "12px",
              }}>
                {p.title}
              </div>

              {/* Desc */}
              <div style={{
                fontSize: "14px", color: "var(--muted)",
                lineHeight: 1.75, flexGrow: 1,
              }}>
                {p.desc}
              </div>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "20px" }}>
                {p.tags.map(t => (
                  <span key={t} style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px", letterSpacing: "0.05em",
                    padding: "4px 10px", borderRadius: "6px",
                    background: `rgba(${p.colorRgb},0.08)`,
                    color: `rgba(${p.colorRgb},1)` === "rgba(56,189,248,1)" ? "var(--accent)"
                         : `rgba(${p.colorRgb},1)` === "rgba(52,211,153,1)" ? "var(--accent3)"
                         : `#${p.colorRgb}`,
                    border: `1px solid rgba(${p.colorRgb},0.2)`,
                  }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                {p.demo ? (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1, textAlign: "center",
                      padding: "10px 16px", borderRadius: "10px",
                      background: `rgba(${p.colorRgb},0.15)`,
                      border: `1px solid rgba(${p.colorRgb},0.3)`,
                      color: "var(--heading)",
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "13px", fontWeight: 600,
                      textDecoration: "none",
                      transition: "background 0.2s, transform 0.15s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `rgba(${p.colorRgb},0.28)`; e.currentTarget.style.transform = "scale(1.02)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `rgba(${p.colorRgb},0.15)`; e.currentTarget.style.transform = "scale(1)"; }}
                  >
                     Live Demo
                  </a>
                ) : (
                  <span style={{
                    flex: 1, textAlign: "center",
                    padding: "10px 16px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border)",
                    color: "var(--muted)",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "13px", fontWeight: 500,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    cursor: "default",
                  }}>
                    🔒 Private
                  </span>
                )}
                {p.github ? (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1, textAlign: "center",
                      padding: "10px 16px", borderRadius: "10px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "13px", fontWeight: 500,
                      textDecoration: "none",
                      transition: "border-color 0.2s, color 0.2s, transform 0.15s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.transform = "scale(1.02)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.transform = "scale(1)"; }}
                  >
                     GitHub
                  </a>
                ) : (
                  <span style={{
                    flex: 1, textAlign: "center",
                    padding: "10px 16px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border)",
                    color: "var(--muted)",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "13px", fontWeight: 500,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    cursor: "default",
                  }}>
                    🔒 Private
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   CONTACT — SVG ICONS + CLICKABLE
══════════════════════════════════════════ */

/* SVG icon components */
const IconEmail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="2,4 12,13 22,4"/>
  </svg>
);

const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.02 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const IconGithub = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const IconLinkedin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const CONTACTS = [
  {
    Icon: IconEmail,
    label: "Email",
    val: "kathirvelmuruganwanthan@gmail.com",
    href: null,
    colorRgb: "56,189,248",
    iconColor: "var(--accent)",
  },
  {
    Icon: IconPhone,
    label: "Phone",
    val: "+91 7339097931",
    href: null,
    colorRgb: "52,211,153",
    iconColor: "var(--accent3)",
  },
  {
    Icon: IconGithub,
    label: "GitHub",
    val: "github.com/Kathirvel-123",
    href: "https://github.com/Kathirvel-123",
    colorRgb: "129,140,248",
    iconColor: "var(--accent2)",
  },
  {
    Icon: IconLinkedin,
    label: "LinkedIn",
    val: "linkedin.com/in/kathirvelmuruganwanthan-p",
    href: "https://linkedin.com/in/kathirvelmuruganwanthan-p-386604251",
    colorRgb: "56,149,248",
    iconColor: "#4f9cf9",
  },
];

function Contact() {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <section className="section contact-bg" id="contact" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="section-inner reveal" ref={ref}>
        <div className="section-label">// reach out</div>
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-grid">

          {/* Contact links card */}
          <div className="contact-card">
            <p style={{
              fontFamily: "'Outfit', sans-serif", fontSize: "14px",
              color: "var(--muted)", marginBottom: "20px", lineHeight: 1.7,
            }}>
              Feel free to reach out — I usually respond within 24 hours.
            </p>

            {CONTACTS.map(({ Icon, label, val, href, colorRgb, iconColor }) => {
              const inner = (
                <>
                  <div className="contact-icon-wrap" style={{ background: `rgba(${colorRgb},0.12)`, color: iconColor }}>
                    <Icon />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="contact-label">{label}</div>
                    <div className="contact-val" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</div>
                  </div>
                </>
              );
              if (href) {
                return (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="contact-item"
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${colorRgb},0.3)`; e.currentTarget.style.background = `rgba(${colorRgb},0.06)`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "transparent"; }}
                  >{inner}</a>
                );
              }
              return (
                <div key={label} className="contact-item" style={{ cursor: "default" }}>{inner}</div>
              );
            })}
          </div>

          {/* CTA box */}
          <div className="cta-box">
            <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
            <div className="cta-title">Let's Work Together</div>
            <div className="cta-sub">
              I'm currently open to full-time roles, freelance projects,
              and collaborative ideas. Let's build something great.
            </div>
            <a href="mailto:kathirvelmuruganwanthan@gmail.com" className="btn-primary" style={{ display: "inline-block" }}>
              Send Email →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   TERMINAL TYPING
══════════════════════════════════════════ */
function TerminalTyping({ lines }) {
  const [shown, setShown] = useState([]);
  const [cur, setCur] = useState(0);

  useEffect(() => {
    if (cur >= lines.length) return;
    const line = lines[cur];
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setShown(prev => {
        const copy = [...prev];
        copy[cur] = line.text.slice(0, i);
        return copy;
      });
      if (i >= line.text.length) {
        clearInterval(iv);
        setTimeout(() => setCur(c => c + 1), 120);
      }
    }, 22);
    return () => clearInterval(iv);
  }, [cur]);

  return (
    <>
      {lines.map((line, idx) => (
        <div key={idx} style={{ marginBottom: 6 }}>
          {line.type === "comment" && <span style={{ color: "var(--muted)", fontStyle: "italic" }}>{shown[idx] || ""}</span>}
          {line.type === "string"  && <span style={{ color: "var(--accent3)" }}>{shown[idx] || ""}</span>}
          {line.type === "normal"  && <span style={{ color: "#94a3b8" }}>{shown[idx] || ""}</span>}
          {idx === cur && <span className="caret">▋</span>}
        </div>
      ))}
    </>
  );
}