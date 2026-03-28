import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Mulish:wght@300;400;500;600;700&display=swap');

  :root {
    --cream:   #faf8f4;
    --cream-2: #f3f0eb;
    --ink:     #1a1510;
    --ink-2:   #2d2820;
    --muted:   #7a7268;
    --accent:  #c8a96e;
    --accent2: #b8924a;
    --border:  rgba(26,21,16,0.09);
    --white:   #ffffff;
  }

  .lp-root {
    font-family: 'Mulish', sans-serif;
    background: var(--cream);
    color: var(--ink);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 60px; height: 68px;
    background: rgba(250,248,244,0.88);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .lp-logo { display: flex; flex-direction: column; }
  .lp-logo-mark { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--ink); letter-spacing: -0.01em; }
  .lp-logo-sub  { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); font-weight: 700; }
  .lp-nav-cta {
    padding: 8px 22px; background: var(--ink); color: var(--white);
    border: none; border-radius: 6px; font-size: 13px; font-weight: 600;
    font-family: 'Mulish', sans-serif; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .lp-nav-cta:hover { background: var(--ink-2); transform: translateY(-1px); }

  /* HERO */
  .lp-hero {
    min-height: 100vh; display: flex; align-items: center;
    padding: 120px 60px 80px;
    position: relative; overflow: hidden;
  }
  .lp-hero-bg {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 70% 60% at 80% 40%, rgba(200,169,110,0.10) 0%, transparent 70%);
  }
  .lp-hero-grid {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
    background-image: linear-gradient(var(--ink) 1px, transparent 1px),
                      linear-gradient(90deg, var(--ink) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .lp-hero-content { max-width: 620px; position: relative; z-index: 1; }
  .lp-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 5px 14px; border-radius: 50px;
    border: 1px solid var(--accent); color: var(--accent);
    font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; margin-bottom: 28px;
    animation: fade-up 0.6s 0.1s both;
  }
  .lp-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .lp-h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(42px, 5vw, 68px); font-weight: 800;
    line-height: 1.1; color: var(--ink);
    margin: 0 0 24px; letter-spacing: -0.02em;
    animation: fade-up 0.7s 0.2s both;
  }
  .lp-h1 em { font-style: italic; color: var(--accent); }
  .lp-lead {
    font-size: 18px; line-height: 1.7; color: var(--muted);
    margin: 0 0 40px; max-width: 500px;
    animation: fade-up 0.7s 0.3s both;
  }
  .lp-cta-row { display: flex; gap: 14px; flex-wrap: wrap; animation: fade-up 0.7s 0.4s both; }
  .lp-cta-primary {
    padding: 14px 32px; background: var(--ink); color: var(--white);
    border: none; border-radius: 8px; font-size: 14px; font-weight: 700;
    font-family: 'Mulish', sans-serif; cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .lp-cta-primary:hover { background: var(--ink-2); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,21,16,0.18); }
  .lp-cta-secondary {
    padding: 14px 32px; background: transparent; color: var(--ink);
    border: 1px solid var(--border); border-radius: 8px; font-size: 14px; font-weight: 600;
    font-family: 'Mulish', sans-serif; cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
  }
  .lp-cta-secondary:hover { border-color: var(--accent); background: rgba(200,169,110,0.06); transform: translateY(-2px); }

  .lp-hero-visual {
    position: absolute; right: 60px; top: 50%; transform: translateY(-50%);
    width: 420px; animation: fade-left 0.8s 0.3s both;
  }

  /* STATS BAR */
  .lp-stats {
    display: flex; gap: 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    background: var(--white); animation: fade-up 0.6s 0.6s both;
  }
  .lp-stat {
    flex: 1; padding: 32px 40px; border-right: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 4px;
  }
  .lp-stat:last-child { border-right: none; }
  .lp-stat-num { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; color: var(--ink); }
  .lp-stat-label { font-size: 12px; color: var(--muted); font-weight: 500; letter-spacing: 0.05em; }

  /* FEATURES */
  .lp-section { padding: 100px 60px; }
  .lp-section-label {
    font-size: 11px; font-weight: 700; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--accent); margin-bottom: 14px;
  }
  .lp-section-h2 {
    font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700;
    color: var(--ink); margin: 0 0 16px; letter-spacing: -0.02em; line-height: 1.2;
  }
  .lp-section-lead { font-size: 16px; color: var(--muted); max-width: 520px; line-height: 1.7; margin: 0 0 60px; }

  .lp-features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px;
    background: var(--border);
    border: 1px solid var(--border); border-radius: 12px; overflow: hidden;
  }
  .lp-feature {
    background: var(--white); padding: 36px 32px;
    transition: background 0.2s;
  }
  .lp-feature:hover { background: var(--cream); }
  .lp-feature-icon {
    width: 44px; height: 44px; border-radius: 10px;
    background: rgba(200,169,110,0.12); border: 1px solid var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; margin-bottom: 20px;
  }
  .lp-feature-h3 { font-size: 16px; font-weight: 700; color: var(--ink); margin: 0 0 10px; }
  .lp-feature-p { font-size: 13px; color: var(--muted); line-height: 1.7; margin: 0; }

  /* ROLES */
  .lp-roles { background: var(--ink); padding: 100px 60px; }
  .lp-roles .lp-section-label { color: var(--accent); }
  .lp-roles .lp-section-h2 { color: var(--white); }
  .lp-roles .lp-section-lead { color: rgba(250,248,244,0.6); }
  .lp-roles-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .lp-role-card {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 28px 24px;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
  }
  .lp-role-card:hover { background: rgba(200,169,110,0.1); border-color: rgba(200,169,110,0.3); transform: translateY(-3px); }
  .lp-role-icon { font-size: 24px; margin-bottom: 16px; }
  .lp-role-title { font-size: 14px; font-weight: 700; color: var(--white); margin: 0 0 8px; }
  .lp-role-desc { font-size: 12px; color: rgba(250,248,244,0.55); line-height: 1.6; margin: 0; }

  /* WORKFLOW */
  .lp-steps { display: flex; flex-direction: column; gap: 0; max-width: 680px; margin: 0 auto; }
  .lp-step { display: flex; gap: 32px; position: relative; padding-bottom: 48px; }
  .lp-step:last-child { padding-bottom: 0; }
  .lp-step-left { display: flex; flex-direction: column; align-items: center; }
  .lp-step-num {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--ink); color: var(--white);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; flex-shrink: 0;
  }
  .lp-step-line { flex: 1; width: 1px; background: var(--border); margin: 8px 0; }
  .lp-step:last-child .lp-step-line { display: none; }
  .lp-step-content { padding-top: 10px; }
  .lp-step-h { font-size: 17px; font-weight: 700; color: var(--ink); margin: 0 0 8px; }
  .lp-step-p { font-size: 14px; color: var(--muted); line-height: 1.7; margin: 0; }

  /* CTA FOOTER */
  .lp-footer-cta {
    background: linear-gradient(135deg, var(--ink) 0%, #2d2820 100%);
    padding: 100px 60px; text-align: center;
    position: relative; overflow: hidden;
  }
  .lp-footer-cta::before {
    content: ''; position: absolute; top: -120px; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 300px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(200,169,110,0.12) 0%, transparent 70%);
  }
  .lp-footer-cta h2 {
    font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 700;
    color: var(--white); margin: 0 0 16px; letter-spacing: -0.02em;
    position: relative;
  }
  .lp-footer-cta p { font-size: 16px; color: rgba(250,248,244,0.6); margin: 0 0 40px; position: relative; }
  .lp-footer-cta button {
    padding: 16px 40px; background: var(--accent); color: var(--ink);
    border: none; border-radius: 8px; font-size: 15px; font-weight: 700;
    font-family: 'Mulish', sans-serif; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    position: relative;
  }
  .lp-footer-cta button:hover { background: var(--accent2); transform: translateY(-2px); }

  .lp-page-footer {
    background: var(--ink); border-top: 1px solid rgba(255,255,255,0.06);
    padding: 32px 60px; display: flex; align-items: center; justify-content: space-between;
  }
  .lp-page-footer p { font-size: 12px; color: rgba(250,248,244,0.4); margin: 0; }

  @keyframes fade-up   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fade-left { from { opacity:0; transform:translate(30px,-50%); } to { opacity:1; transform:translate(0,-50%); } }
  @keyframes count-up { from { opacity:0; } to { opacity:1; } }

  /* Scroll reveal */
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
`;

const FEATURES = [
  { icon: "🏢", title: "Vendor Onboarding", desc: "Streamlined registration with automated credential delivery and multi-stage approval workflows." },
  { icon: "📦", title: "Purchase Orders", desc: "Create, track, and advance orders through every stage from creation to completion." },
  { icon: "💳", title: "Payment Management", desc: "Record, track, and reconcile payments with full audit trail and status tracking." },
  { icon: "📄", title: "Document Control", desc: "Secure document uploads with S3 storage, approval workflows, and instant downloads." },
  { icon: "📊", title: "Performance Scoring", desc: "Multi-dimensional vendor scoring across delivery, quality, fulfillment, and compliance." },
  { icon: "🔐", title: "Role-Based Access", desc: "Granular permissions for Admin, Vendor, Procurement, and Finance with scoped data views." },
];

const ROLES = [
  { icon: "⚙️", title: "Administrator", desc: "Full system control, account creation, vendor approvals, and platform oversight." },
  { icon: "🏪", title: "Vendor", desc: "View own orders, payments, documents, and performance metrics securely." },
  { icon: "📋", title: "Procurement", desc: "Manage vendor relationships, create purchase orders, and review compliance docs." },
  { icon: "💰", title: "Finance", desc: "Process payments, review invoices, and access financial reporting." },
];

const STEPS = [
  { title: "Register a vendor", desc: "Admin or Procurement adds a vendor. Credentials are auto-generated and emailed instantly." },
  { title: "Approve & onboard", desc: "Admin reviews documents and approves the vendor, unlocking portal access." },
  { title: "Create purchase orders", desc: "Procurement raises orders against approved vendors with line-item detail." },
  { title: "Track & advance", desc: "Orders move through Created → Approved → Shipped → Delivered → Completed." },
  { title: "Process payment", desc: "Finance records payment against delivered orders and marks completion." },
  { title: "Evaluate performance", desc: "Scores are calculated across delivery, quality, fulfillment and compliance dimensions." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const revealRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const id = "lp-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id; el.textContent = STYLES;
      document.head.appendChild(el);
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ref = (i: number) => (el: HTMLDivElement | null) => { if (el) revealRefs.current[i] = el; };

  return (
    <div className="lp-root">
      {/* NAV */}
      <nav className="lp-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
  <svg viewBox="0 0 40 46" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="20,2 38,12 38,34 20,44 2,34 2,12" fill="#1a1510" />
    <path d="M11 16 L20 32 L29 16" stroke="#c8a96e" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
  <div style={{ display: "flex", flexDirection: "column" }}>
    <span className="lp-logo-mark">VMS</span>
    <span className="lp-logo-sub">Vendor Portal</span>
  </div>
</div>
        <button className="lp-nav-cta" onClick={() => navigate("/login")}>Sign In →</button>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-bg" />
        <div className="lp-hero-grid" />
        <div className="lp-hero-content">
          <div className="lp-eyebrow">
            <span className="lp-eyebrow-dot" />
            Enterprise Vendor Management
          </div>
          <h1 className="lp-h1">
            Manage vendors<br/>with <em>clarity</em><br/>and control.
          </h1>
          <p className="lp-lead">
            A unified platform for onboarding, orders, payments, documents, and performance — built for teams that demand precision.
          </p>
          <div className="lp-cta-row">
            <button className="lp-cta-primary" onClick={() => navigate("/login")}>Get Started →</button>
            <button className="lp-cta-secondary" onClick={() => navigate("/login")}>Sign In</button>
          </div>
        </div>
    
       {/* Hero visual — VMS Logo Mark */}
<div className="lp-hero-visual" style={{
  background: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}}>
  <svg viewBox="0 0 340 380" width="340" height="380" fill="none" xmlns="http://www.w3.org/2000/svg">

    {/* Outer hexagon ring */}
    <polygon
      points="170,18 310,95 310,285 170,362 30,285 30,95"
      fill="none"
      stroke="rgba(200,169,110,0.18)"
      strokeWidth="1.5"
    />
    {/* Middle hexagon ring */}
    <polygon
      points="170,44 286,110 286,260 170,336 54,260 54,110"
      fill="none"
      stroke="rgba(200,169,110,0.12)"
      strokeWidth="1"
    />

    {/* Solid hexagon background */}
    <polygon
      points="170,68 268,122 268,238 170,292 72,238 72,122"
      fill="#1a1510"
    />

    {/* Accent top bar */}
    <rect x="120" y="68" width="100" height="3" rx="1.5" fill="#c8a96e" opacity="0.6" />

    {/* V mark — bold serif-style chevron */}
    <path
      d="M112 148 L170 238 L228 148"
      stroke="#c8a96e"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* V inner highlight */}
    <path
      d="M112 148 L170 238 L228 148"
      stroke="rgba(200,169,110,0.25)"
      strokeWidth="28"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Corner tick marks */}
    {[
      [170, 68],
      [268, 122],
      [268, 238],
      [170, 292],
      [72, 238],
      [72, 122],
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="3.5" fill="#c8a96e" opacity="0.5" />
    ))}

    {/* VMS wordmark below hex */}
    <text
      x="170"
      y="334"
      textAnchor="middle"
      fontFamily="'Playfair Display', serif"
      fontSize="22"
      fontWeight="700"
      fill="#1a1510"
      letterSpacing="6"
    >VMS</text>

    {/* Subtitle */}
    <text
      x="170"
      y="356"
      textAnchor="middle"
      fontFamily="'Mulish', sans-serif"
      fontSize="9"
      fontWeight="700"
      fill="#c8a96e"
      letterSpacing="4"
    >VENDOR PORTAL</text>

    {/* Left decorative line */}
    <line x1="40" y1="345" x2="130" y2="345" stroke="rgba(26,21,16,0.12)" strokeWidth="1" />
    {/* Right decorative line */}
    <line x1="210" y1="345" x2="300" y2="345" stroke="rgba(26,21,16,0.12)" strokeWidth="1" />

  </svg>
</div>
      </section>

      {/* STATS */}
      <div className="lp-stats">
        {[
          { num: "500+", label: "Vendors managed" },
          { num: "12,000+", label: "Orders processed" },
          { num: "99.9%", label: "Uptime SLA" },
          { num: "4 roles", label: "Access levels" },
        ].map((s) => (
          <div key={s.label} className="lp-stat">
            <span className="lp-stat-num">{s.num}</span>
            <span className="lp-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section className="lp-section" ref={ref(0)}>
        <div className={`reveal`} ref={ref(1)}>
          <div className="lp-section-label">Platform capabilities</div>
          <h2 className="lp-section-h2">Everything in one place.</h2>
          <p className="lp-section-lead">From vendor registration to payment reconciliation — every workflow your procurement team needs, unified.</p>
        </div>
        <div className="lp-features-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`lp-feature reveal reveal-delay-${(i % 3) + 1}`} ref={ref(i + 2)}>
              <div className="lp-feature-icon">{f.icon}</div>
              <h3 className="lp-feature-h3">{f.title}</h3>
              <p className="lp-feature-p">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section className="lp-roles">
        <div className="lp-section-label">Role-based access</div>
        <h2 className="lp-section-h2" style={{ color: "var(--white)" }}>The right view for every team.</h2>
        <p className="lp-section-lead">Each role sees exactly what they need — nothing more, nothing less.</p>
        <div className="lp-roles-grid">
          {ROLES.map((r) => (
            <div key={r.title} className="lp-role-card">
              <div className="lp-role-icon">{r.icon}</div>
              <p className="lp-role-title">{r.title}</p>
              <p className="lp-role-desc">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="lp-section">
        <div className="lp-section-label">How it works</div>
        <h2 className="lp-section-h2">Six steps. Zero confusion.</h2>
        <p className="lp-section-lead">A clear, auditable workflow from vendor registration through final payment.</p>
        <div className="lp-steps">
          {STEPS.map((s, i) => (
            <div key={s.title} className={`lp-step reveal reveal-delay-${(i % 3) + 1}`} ref={ref(i + 10)}>
              <div className="lp-step-left">
                <div className="lp-step-num">{i + 1}</div>
                <div className="lp-step-line" />
              </div>
              <div className="lp-step-content">
                <h4 className="lp-step-h">{s.title}</h4>
                <p className="lp-step-p">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="lp-footer-cta">
        <h2>Ready to get started?</h2>
        <p>Sign in to your VMS portal and take control of your vendor relationships.</p>
        <button onClick={() => navigate("/login")}>Access the Portal →</button>
      </section>

      {/* PAGE FOOTER */}
      <footer className="lp-page-footer">
        <div className="lp-logo">
          <span className="lp-logo-mark" style={{ color: "rgba(250,248,244,0.8)", fontSize: 14 }}>VMS</span>
          <span className="lp-logo-sub" style={{ color: "rgba(200,169,110,0.7)" }}>Vendor Portal</span>
        </div>
        <p>&copy; 2026 Vendor Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}