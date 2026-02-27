import { useEffect, useState, useRef } from "react";

/* ─────────────────────────────────────────────
   SVG paths for digits 0 and 4
   Drawn as single-stroke outlines so we can
   animate stroke-dashoffset (draw-on effect)
   plus a continuous zigzag jitter.
───────────────────────────────────────────── */
const DIGIT_PATHS = {
  // Digit "4"
  "4": "M60 10 L10 70 L75 70 M60 10 L60 100",
  // Digit "0"
  "0": "M35 10 C10 10 10 100 35 100 C60 100 60 10 35 10 Z",
};

const ZAG_COLORS = {
  primary: "#fb923c",
  secondary: "#f97316",
  glow: "rgba(251,146,60,0.4)",
};

/* Individual animated SVG digit */
function ZigDigit({ digit, delay = 0 }) {
  const pathRef = useRef(null);
  const [length, setLength] = useState(400);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (pathRef.current) {
        const l = pathRef.current.getTotalLength?.() ?? 400;
        setLength(l);
      }
      setDrawn(true);
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);

  const path = DIGIT_PATHS[digit];
  const vb = digit === "4" ? "0 0 80 110" : "0 0 70 110";

  return (
    <svg
      viewBox={vb}
      height="120"
      style={{ overflow: "visible", filter: `drop-shadow(0 0 10px ${ZAG_COLORS.glow})` }}
      aria-label={digit}
    >
      {/* Ghost / echo layer */}
      <path
        d={path}
        fill="none"
        stroke={ZAG_COLORS.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.08"
      />

      {/* Main draw-on stroke */}
      <path
        ref={pathRef}
        d={path}
        fill="none"
        stroke={ZAG_COLORS.primary}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={length}
        strokeDashoffset={drawn ? 0 : length}
        style={{
          transition: drawn ? `stroke-dashoffset ${0.9}s cubic-bezier(0.22,1,0.36,1) ${delay * 0.001}s` : "none",
          filter: `drop-shadow(0 0 6px ${ZAG_COLORS.glow})`,
        }}
      />

      {/* Travelling spark dot */}
      {drawn && (
        <circle r="3.5" fill={ZAG_COLORS.primary} style={{ filter: `drop-shadow(0 0 6px ${ZAG_COLORS.primary})` }}>
          <animateMotion
            dur="2.2s"
            repeatCount="indefinite"
            begin={`${delay * 0.001}s`}
          >
            <mpath href={`#zp-${digit}`} />
          </animateMotion>
        </circle>
      )}

      {/* Named path for animateMotion */}
      <defs>
        <path id={`zp-${digit}`} d={path} />
      </defs>
    </svg>
  );
}

/* Zigzag oscilloscope line drawn under the digits */
function ZigzagLine() {
  return (
    <svg width="100%" height="28" viewBox="0 0 540 28" preserveAspectRatio="none"
      style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="zzGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="20%" stopColor={ZAG_COLORS.primary} />
          <stop offset="80%" stopColor={ZAG_COLORS.primary} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <filter id="zzGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Static zigzag */}
      <polyline
        points="0,14 40,14 55,4 70,24 85,4 100,24 115,14 540,14"
        fill="none"
        stroke="url(#zzGrad)"
        strokeWidth="1.5"
        filter="url(#zzGlow)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Animated scanning dot */}
      <circle r="2.5" fill={ZAG_COLORS.primary} style={{ filter: `drop-shadow(0 0 5px ${ZAG_COLORS.primary})` }}>
        <animateMotion
          path="M0,14 L540,14"
          dur="2.8s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

/* Particles */
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  sz: `${Math.random() * 2.5 + 0.5}px`,
  dur: `${Math.random() * 14 + 8}s`,
  delay: `${Math.random() * 12}s`,
  drift: `${(Math.random() - 0.5) * 90}px`,
}));

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@200;300;400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ep { min-height:100vh; display:flex; align-items:center; justify-content:center;
    background:#07080d; font-family:'Outfit',sans-serif; padding:2rem;
    overflow:hidden; position:relative; color:#e2e8f0; }

  /* scanlines */
  .ep::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
    background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px); }

  .ep-glow { position:absolute; width:600px; height:600px; border-radius:50%;
    background:radial-gradient(circle, rgba(251,146,60,0.06) 0%, transparent 70%);
    animation:glowPulse 4s ease-in-out infinite; pointer-events:none; }
  @keyframes glowPulse { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.18);opacity:1} }

  .ep-ptcl { position:fixed; inset:0; pointer-events:none; z-index:0; }
  .ep-p { position:absolute; border-radius:50%; background:rgba(251,146,60,.4); animation:drift linear infinite; }
  @keyframes drift {
    from{transform:translateY(100vh) translateX(0);opacity:0}
    10%{opacity:1} 90%{opacity:.35}
    to{transform:translateY(-10vh) translateX(var(--dx));opacity:0}
  }

  .ep-card { max-width:560px; width:100%; position:relative; z-index:1;
    animation:cardIn .9s cubic-bezier(.22,1,.36,1) both; }
  @keyframes cardIn { from{opacity:0;transform:translateY(40px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }

  .ep-bwrap { padding:1px; border-radius:6px;
    background:linear-gradient(135deg,rgba(251,146,60,.35),rgba(100,116,139,.1),rgba(251,146,60,.15));
    background-size:300% 300%; animation:borderShift 6s linear infinite; }
  @keyframes borderShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

  .ep-inner { border-radius:5px; padding:2.5rem 2.75rem 2.5rem; background:#0d0f18; position:relative; overflow:hidden; }
  .ep-inner::after { content:''; position:absolute; top:0; right:0; width:180px; height:180px;
    background:radial-gradient(circle at top right, rgba(251,146,60,.07), transparent 70%); pointer-events:none; }

  /* topbar */
  .ep-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:2rem;
    animation:fadeUp .5s .2s both; }
  .ep-org { font-family:'Space Mono',monospace; font-size:.55rem; letter-spacing:.18em; text-transform:uppercase; color:#334155; }
  .ep-badge { font-family:'Space Mono',monospace; font-size:.55rem; letter-spacing:.12em;
    padding:.25rem .65rem; border:1px solid rgba(251,146,60,.25); border-radius:2px;
    color:rgba(251,146,60,.55); animation:badgePulse 2.5s ease-in-out infinite; }
  @keyframes badgePulse {
    0%,100%{border-color:rgba(251,146,60,.25);color:rgba(251,146,60,.55)}
    50%{border-color:rgba(251,146,60,.65);color:rgba(251,146,60,.95)}
  }

  /* digit row */
  .ep-digits { display:flex; align-items:center; gap:1rem; margin-bottom:.5rem;
    animation:fadeUp .5s .3s both; }
  .ep-dot { width:8px; height:8px; border-radius:50%; background:#fb923c; opacity:.5;
    animation:dotPulse 1.8s ease-in-out infinite; }
  @keyframes dotPulse { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.5);opacity:1} }

  .ep-zzline { margin-bottom:1.5rem; animation:fadeUp .5s .55s both; }

  .ep-title { font-size:1.05rem; font-weight:600; color:#f1f5f9; margin-bottom:.6rem; animation:fadeUp .5s .65s both; }
  .ep-msg { font-size:.82rem; font-weight:300; line-height:1.85; color:#475569; margin-bottom:2.25rem; animation:fadeUp .5s .75s both; }

  .ep-actions { display:flex; gap:.75rem; flex-wrap:wrap; animation:fadeUp .5s .85s both; }

  .ep-btn-p { font-family:'Space Mono',monospace; font-size:.65rem; letter-spacing:.1em; text-transform:uppercase;
    text-decoration:none; padding:.7rem 1.4rem; background:rgba(251,146,60,.08); color:#fb923c;
    border:1px solid rgba(251,146,60,.35); border-radius:3px; cursor:pointer;
    transition:all .25s ease; position:relative; overflow:hidden; display:inline-block; }
  .ep-btn-p::after { content:''; position:absolute; inset:0; background:rgba(251,146,60,.07);
    transform:translateX(-100%); transition:transform .3s ease; }
  .ep-btn-p:hover::after { transform:translateX(0); }
  .ep-btn-p:hover { border-color:rgba(251,146,60,.7); color:#fdba74; box-shadow:0 0 20px rgba(251,146,60,.12); }

  .ep-btn-s { font-family:'Space Mono',monospace; font-size:.65rem; letter-spacing:.1em; text-transform:uppercase;
    padding:.7rem 1.4rem; background:transparent; color:#334155;
    border:1px solid rgba(51,65,85,.45); border-radius:3px; cursor:pointer; transition:all .25s ease; }
  .ep-btn-s:hover { color:#64748b; border-color:rgba(100,116,139,.5); }

  .ep-footer { margin-top:2.25rem; padding-top:1.25rem; border-top:1px solid rgba(255,255,255,.04);
    font-family:'Space Mono',monospace; font-size:.55rem; letter-spacing:.1em; color:#1e293b;
    display:flex; justify-content:space-between; align-items:center; animation:fadeUp .5s .95s both; }
  .ep-clock { font-variant-numeric:tabular-nums; color:#334155; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
`;

export default function ErrorPage({
  code = "404",
  title = "Page Not Available",
  message = "The page you are trying to access may have been removed, renamed, or is temporarily unavailable.",
}) {
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-IN", { hour12: false }));
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-IN", { hour12: false })), 1000);
    return () => clearInterval(t);
  }, []);

  const digits = code.split("");

  return (
    <>
      <style>{css}</style>
      <div className="ep">
        <div className="ep-glow" />

        {/* Particles */}
        <div className="ep-ptcl">
          {PARTICLES.map(p => (
            <span key={p.id} className="ep-p" style={{
              left: p.left, bottom: "-8px",
              width: p.sz, height: p.sz,
              animationDuration: p.dur,
              animationDelay: p.delay,
              "--dx": p.drift,
            }} />
          ))}
        </div>

        <div className="ep-card">
          <div className="ep-bwrap">
            <div className="ep-inner">

              <div className="ep-top">
                <span className="ep-org">Western Odisha Development Council</span>
                <span className="ep-badge">ERR_{code}</span>
              </div>

              {/* Zigzag animated digits */}
              <div className="ep-digits">
                {digits.map((d, i) => (
                  <ZigDigit key={i} digit={d} delay={i * 280} />
                ))}
              </div>

              {/* Oscilloscope zigzag line */}
              <div className="ep-zzline">
                <ZigzagLine />
              </div>

              <h2 className="ep-title">{title}</h2>
              <p className="ep-msg">{message}</p>

              <div className="ep-actions">
                <a href="/dashboard" className="ep-btn-p">↑ Go to Home</a>
                <button className="ep-btn-s" onClick={() => window.location.reload()}>↻ Reload</button>
              </div>

              <div className="ep-footer">
                <span>© {new Date().getFullYear()} Govt. of Odisha</span>
                <span className="ep-clock">{time}</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}