import { type ReactNode, useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const SYSTEM_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Mulish:wght@300;400;500;600;700;800&display=swap');

  :root {
    --cream:         #faf8f4;
    --cream-2:       #f3f0eb;
    --cream-3:       #ece8e1;
    --white:         #ffffff;
    --ink:           #1a1510;
    --ink-2:         #2d2820;
    --ink-3:         #3d3830;
    --muted:         #7a7268;
    --muted-2:       #b5afa6;
    --muted-3:       #d4cfc8;
    --accent:        #c8a96e;
    --accent-dim:    rgba(200,169,110,0.12);
    --accent-dim2:   rgba(200,169,110,0.22);
    --accent-border: rgba(200,169,110,0.30);
    --border:        rgba(26,21,16,0.09);
    --border-2:      rgba(26,21,16,0.05);
    --green:         #059669;
    --green-bg:      rgba(5,150,105,0.08);
    --green-border:  rgba(5,150,105,0.25);
    --amber:         #d97706;
    --amber-bg:      rgba(217,119,6,0.08);
    --amber-border:  rgba(217,119,6,0.25);
    --red:           #dc2626;
    --red-bg:        rgba(220,38,38,0.08);
    --red-border:    rgba(220,38,38,0.25);
    --blue:          #2563eb;
    --sidebar-w:     248px;
    --topbar-h:      68px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }

  body {
    font-family: 'Mulish', sans-serif;
    background: var(--cream);
    color: var(--ink);
    overflow: hidden;
  }

  .serif { font-family: 'Playfair Display', serif; }

  ::-webkit-scrollbar       { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--muted-3); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--muted-2); }

  /* paper texture */
  body::after {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 9999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
    opacity: 0.018; mix-blend-mode: multiply;
  }

  .app-shell { display: flex; min-height: 100vh; background: var(--cream); }

  /* Sidebar slot: let the Sidebar component control its own width */
  .app-sidebar-slot {
    flex-shrink: 0;
    position: fixed; left: 0; top: 0; bottom: 0; z-index: 40;
    display: flex; flex-direction: column;
    box-shadow: 1px 0 0 var(--border), 4px 0 24px rgba(26,21,16,0.06);
  }

  /* Main column offset is now driven by a CSS variable the sidebar updates */
  .app-main-col {
    flex: 1; min-width: 0;
    margin-left: var(--sidebar-current-w, var(--sidebar-w));
    display: flex; flex-direction: column;
    height: 100vh; overflow: hidden;
    transition: margin-left 0.2s;
  }

  .app-topbar-slot {
    height: var(--topbar-h); flex-shrink: 0;
    position: relative; z-index: 30;
    border-bottom: 1px solid var(--border);
    background: rgba(250,248,244,0.93);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    display: flex; align-items: center;
  }
  .app-topbar-slot::after {
    content: ''; position: absolute; bottom: -1px; left: 0;
    height: 1.5px;
    background: linear-gradient(90deg, var(--accent) 0%, rgba(200,169,110,0.35) 55%, transparent 100%);
    width: 0; transition: width 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .app-topbar-slot.loaded::after { width: 100%; }

  .app-shimmer {
    position: absolute; inset: 0; pointer-events: none; z-index: 1;
    background: linear-gradient(90deg, transparent 0%, rgba(200,169,110,0.07) 40%, rgba(200,169,110,0.1) 60%, transparent 100%);
    transform: translateX(-100%);
    animation: shimmer-sweep 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  @keyframes shimmer-sweep { to { transform: translateX(100%); } }

  .app-scroll { flex: 1; overflow-y: auto; overflow-x: hidden; background: var(--cream); }

  .app-content {
    padding: 36px 44px 88px; min-height: 100%; position: relative;
    animation: content-in 0.45s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes content-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

  .app-corner-deco { position: fixed; top: 0; right: 0; width: 400px; height: 400px; pointer-events: none; z-index: 0; }
  .app-corner-deco::before {
    content: ''; position: absolute; top: -180px; right: -180px;
    width: 360px; height: 360px; border-radius: 50%;
    background: radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 70%);
  }

  @media (max-width: 768px) {
    .app-sidebar-slot { transform: translateX(-100%); transition: transform 0.3s; }
    .app-main-col { margin-left: 0; }
    .app-content { padding: 20px 18px 60px; }
  }
`;

export default function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const [loaded, setLoaded] = useState(false);
  const [shimmer, setShimmer] = useState(false);
  const prevTitle = useRef(title);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = "app-design-system";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id; el.textContent = SYSTEM_STYLES;
      document.head.appendChild(el);
    }
  }, []);

  useEffect(() => {
    const t = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    if (prevTitle.current !== title) {
      prevTitle.current = title;
      setShimmer(true);
      scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [title]);

  return (
    <div className="app-shell">
      <div className="app-corner-deco" />
      {/* Sidebar owns its own width — slot is unsized */}
      <aside className="app-sidebar-slot">
        <Sidebar />
      </aside>
      <div className="app-main-col">
        <header className={`app-topbar-slot ${loaded ? "loaded" : ""}`}>
          {shimmer && <div className="app-shimmer" onAnimationEnd={() => setShimmer(false)} />}
          {/* TopBar is the single source of truth for the topbar content */}
          <TopBar title={title} subtitle={subtitle} />
        </header>
        <div className="app-scroll" ref={scrollRef}>
          <main className="app-content" key={title}>{children}</main>
        </div>
      </div>
    </div>
  );
}