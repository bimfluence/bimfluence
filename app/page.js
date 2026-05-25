"use client";
import { useState, useEffect, useRef } from "react";

"use client";
import { useState, useEffect, useRef } from "react";

const T = {
  bg:         "#F7F6F2",
  bgCard:     "#FFFFFF",
  ink:        "#1A1917",
  inkMuted:   "#6B6860",
  inkFaint:   "#A8A59E",
  border:     "rgba(26,25,23,0.10)",
  borderMed:  "rgba(26,25,23,0.18)",
  accent:     "#2B4FD4",
  accentLight:"#E8EDFA",
  serif:      "'DM Serif Display', Georgia, serif",
  sans:       "'DM Sans', system-ui, sans-serif",
};

const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; font-family: ${T.sans}; color: ${T.ink}; -webkit-font-smoothing: antialiased; }
  a { color: inherit; text-decoration: none; }
  button { font-family: ${T.sans}; cursor: pointer; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes lineGrow {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
  .fade-up { animation: fadeUp 0.7s cubic-bezier(.22,.68,0,1.1) both; }
  .fade-in { animation: fadeIn 0.45s ease both; }

  .nav-link {
    font-size: 13px; font-weight: 400; color: ${T.inkMuted};
    letter-spacing: 0.01em; transition: color 0.15s;
    position: relative; padding-bottom: 2px;
  }
  .nav-link:hover { color: ${T.ink}; }
  .nav-link.active { color: ${T.ink}; font-weight: 500; }
  .nav-link.active::after {
    content: ''; position: absolute;
    bottom: -2px; left: 0; right: 0;
    height: 1px; background: ${T.ink};
  }

  .cta-primary {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 500; color: ${T.bgCard};
    background: ${T.ink}; border: none; border-radius: 6px;
    padding: 10px 20px; transition: opacity 0.15s, transform 0.12s;
  }
  .cta-primary:hover { opacity: 0.85; transform: translateY(-1px); }

  .cta-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 400; color: ${T.inkMuted};
    background: transparent; border: 0.5px solid ${T.borderMed};
    border-radius: 6px; padding: 10px 20px;
    transition: border-color 0.15s, color 0.15s, transform 0.12s;
  }
  .cta-ghost:hover { border-color: ${T.ink}; color: ${T.ink}; transform: translateY(-1px); }

  .pillar-card {
    background: ${T.bgCard}; border: 0.5px solid ${T.border};
    border-radius: 10px; padding: 1.5rem;
    transition: border-color 0.2s, transform 0.18s, box-shadow 0.2s;
  }
  .pillar-card:hover {
    border-color: ${T.borderMed}; transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(26,25,23,0.05);
  }

  .article-row {
    display: flex; align-items: baseline; gap: 1rem;
    padding: 1rem 0; border-bottom: 0.5px solid ${T.border};
    transition: opacity 0.15s; cursor: pointer;
  }
  .article-row:hover { opacity: 0.65; }

  .tag-pill {
    display: inline-block; font-size: 11px; font-weight: 400;
    color: ${T.inkMuted}; border: 0.5px solid ${T.border};
    border-radius: 100px; padding: 3px 10px;
  }

  .framework-card {
    background: ${T.bgCard}; border: 0.5px solid ${T.border};
    border-radius: 12px; padding: 2rem;
    transition: border-color 0.2s, box-shadow 0.2s; cursor: pointer;
  }
  .framework-card:hover {
    border-color: ${T.accent};
    box-shadow: 0 0 0 3px ${T.accentLight};
  }

  .divider { border: none; border-top: 0.5px solid ${T.border}; margin: 0; }

  .micro-label {
    font-size: 11px; font-weight: 400; letter-spacing: 0.12em;
    text-transform: uppercase; color: ${T.inkFaint};
  }

  input[type="text"], input[type="email"], textarea {
    width: 100%; font-family: ${T.sans}; font-size: 14px;
    color: ${T.ink}; background: ${T.bg};
    border: 0.5px solid ${T.border}; border-radius: 8px;
    padding: 10px 14px; outline: none; transition: border-color 0.15s;
  }
  input[type="text"]:focus, input[type="email"]:focus, textarea:focus {
    border-color: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentLight};
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
`;

function injectGlobal() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('bimfluence-global')) return;
  const s = document.createElement('style');
  s.id = 'bimfluence-global';
  s.textContent = globalCSS;
  document.head.appendChild(s);
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300;1,9..40,400&display=swap';
  document.head.appendChild(fontLink);
}
injectGlobal();

// NAV
const NAV_ITEMS = [
  { id: "thinking",   label: "Thinking"    },
  { id: "frameworks", label: "Frameworks"  },
  { id: "fieldnotes", label: "Field Notes" },
  { id: "library",    label: "Library"     },
  { id: "about",      label: "About"       },
];

function Nav({ page, setPage, scrolled }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(247,246,242,0.93)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? `0.5px solid ${T.border}` : "none",
      transition: "background 0.25s, border-color 0.25s",
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 2rem", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", fontFamily: T.sans, fontSize: 14, fontWeight: 500, color: T.ink, letterSpacing: "0.06em", cursor: "pointer" }}>
          BIMfluence
        </button>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {NAV_ITEMS.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`nav-link${page === n.id ? " active" : ""}`}
              style={{ background: "none", border: "none" }}>
              {n.label}
            </button>
          ))}
          <button onClick={() => setPage("connect")} className="cta-primary" style={{ padding: "7px 16px", fontSize: 12 }}>
            Connect
          </button>
        </div>
      </div>
    </nav>
  );
}

// HOME
function Home({ setPage }) {
  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 1000, margin: "0 auto", padding: "0 2rem", paddingTop: 56, position: "relative" }}>
        <div style={{ maxWidth: 620 }}>
          <p className="micro-label fade-up" style={{ marginBottom: "1.75rem", animationDelay: "0.05s" }}>
            Construction × Adoption × Intelligence
          </p>
          <h1 className="fade-up" style={{ fontFamily: T.serif, fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 400, lineHeight: 1.18, color: T.ink, marginBottom: "2.25rem", animationDelay: "0.12s" }}>
            Construction's constraint is not technology. It's decision velocity.
          </h1>
          <p className="fade-up" style={{ fontSize: 16, lineHeight: 1.8, color: T.inkMuted, maxWidth: 460, marginBottom: "0.75rem", animationDelay: "0.22s" }}>
            I'm Endreas Aberra. I've worked across construction delivery, BIM, and technology adoption for over a decade — close enough to understand where things actually break.
          </p>
          <p className="fade-up" style={{ fontSize: 16, lineHeight: 1.8, color: T.inkMuted, maxWidth: 460, marginBottom: "0.6rem", animationDelay: "0.28s" }}>
            There is a discipline that sits between construction delivery and applied intelligence. It does not have a name yet.
          </p>
          <p className="fade-up" style={{ fontSize: 16, lineHeight: 1.8, color: T.inkMuted, maxWidth: 460, marginBottom: "2.5rem", animationDelay: "0.3s" }}>
            BIMfluence is where I build the vocabulary for it.
          </p>
          <div className="fade-up" style={{ display: "flex", gap: 10, animationDelay: "0.38s" }}>
            <button className="cta-primary" onClick={() => setPage("thinking")}>Read thinking</button>
            <button className="cta-ghost" onClick={() => setPage("frameworks")}>See frameworks</button>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "2.5rem", left: "2rem", display: "flex", alignItems: "center", gap: 8, opacity: 0.28 }}>
          <div style={{ width: 1, height: 32, background: T.ink, transformOrigin: "top", animation: "lineGrow 1s 1.2s ease both" }} />
          <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>Scroll</span>
        </div>
      </section>

      {/* CLAIM */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "5rem 2rem" }}>
        <hr className="divider" style={{ marginBottom: "4rem" }} />
        <blockquote style={{ fontFamily: T.serif, fontSize: "clamp(21px, 3vw, 30px)", fontWeight: 400, lineHeight: 1.42, color: T.ink, fontStyle: "italic", maxWidth: 660 }}>
          "Construction doesn't need more software. It needs better systems for turning information into decisions."
        </blockquote>
      </section>

      {/* THE PROBLEM */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 2rem 5rem" }}>
        <hr className="divider" style={{ marginBottom: "4rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", alignItems: "start" }}>
          <p className="micro-label" style={{ paddingTop: 4 }}>The problem</p>
          <div>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: T.inkMuted, marginBottom: "1.1rem" }}>
              Construction spent years building better information. Richer models, cleaner data, more structured handovers. BIM was meant to close the loop between design intent and delivery reality.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: T.inkMuted, marginBottom: "1.1rem" }}>
              The information got better. The decisions didn't.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: T.inkMuted }}>
              The gap between what a project knows and what it acts on is where margin disappears, where rework originates, and where most technology investments quietly fail. That gap is measurable. It has a structure. It can be closed.
            </p>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 2rem 5rem" }}>
        <hr className="divider" style={{ marginBottom: "4rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", alignItems: "start" }}>
          <p className="micro-label" style={{ paddingTop: 4 }}>Principles</p>
          <div>
            {[
              "Information only creates value at the moment of decision.",
              "Technology does not change behavior. Workflow design does.",
              "Learning that stays inside a single project is waste.",
              "The organizations that improve fastest are not the ones with the best tools.",
            ].map((p, i, arr) => (
              <div key={i} style={{ display: "flex", gap: "1.5rem", alignItems: "baseline", padding: "1.1rem 0", borderBottom: i < arr.length - 1 ? `0.5px solid ${T.border}` : "none" }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: T.accent, letterSpacing: "0.06em", flexShrink: 0, width: 22 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: T.ink }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LINES OF INQUIRY */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 2rem 5rem" }}>
        <hr className="divider" style={{ marginBottom: "4rem" }} />
        <p className="micro-label" style={{ marginBottom: "2.5rem" }}>Lines of inquiry</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
          {[
            { title: "The Decision Gap",             body: "Every project has a measurable window between when information becomes available and when it changes a decision. Closing that window is the highest-value intervention most organizations aren't making." },
            { title: "Adoption as a structural problem", body: "Most implementations fail because the economic structure of construction makes adoption irrational. That's not a training problem. It requires a different kind of design." },
            { title: "AI in the workflow",           body: "Not AI as a category. AI at specific decision points where the cost of slow judgment is measurable and the data to support faster judgment already exists." },
            { title: "Organizational learning rate", body: "Some construction firms get better at delivery year over year. Most repeat the same failures under different names. The difference is not talent. It's whether learning is systemic." },
          ].map(p => (
            <div key={p.title} className="pillar-card">
              <p style={{ fontSize: 14, fontWeight: 500, color: T.ink, marginBottom: "0.6rem" }}>{p.title}</p>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: T.inkMuted }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* IN PROGRESS */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 2rem 5rem" }}>
        <hr className="divider" style={{ marginBottom: "4rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", alignItems: "start" }}>
          <div>
            <p className="micro-label" style={{ marginBottom: "1.5rem" }}>Published as</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Essays", "Frameworks", "Field Notes", "AI Workflows"].map(t => (
                <span key={t} className="tag-pill">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="micro-label" style={{ marginBottom: "1.5rem" }}>In progress</p>
            {[
              { title: "The Decision Gap: a measurable framework for construction performance", tag: "Framework" },
              { title: "Why technology adoption fails structurally, not culturally",           tag: "Essay"     },
              { title: "Orchestrated intelligence: AI at defined points in the construction workflow", tag: "Applied AI" },
            ].map((a, i) => (
              <div key={i} className="article-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: T.ink, lineHeight: 1.55, marginBottom: 4 }}>{a.title}</p>
                  <span className="tag-pill">{a.tag}</span>
                </div>
                <span style={{ fontSize: 12, color: T.inkFaint, whiteSpace: "nowrap", flexShrink: 0 }}>Soon</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section style={{ background: T.ink, padding: "4rem 2rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: T.serif, fontSize: 15, color: "rgba(255,255,255,0.85)", fontStyle: "italic" }}>EA</span>
            </div>
            <p style={{ fontFamily: T.serif, fontSize: 19, color: "rgba(255,255,255,0.9)", lineHeight: 1.4 }}>Endreas Aberra</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 5, letterSpacing: "0.03em" }}>bimfluence.se</p>
          </div>
          <div>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>
              A decade across construction delivery, BIM, customer success, and technology adoption. Long enough to watch the same project failures repeat under different names.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: "rgba(255,255,255,0.6)", marginBottom: "1.75rem" }}>
              The work here is an attempt to name the underlying patterns and build frameworks that might actually change how decisions get made on projects.
            </p>
            <p style={{ fontFamily: T.serif, fontSize: 17, color: "rgba(255,255,255,0.88)", fontStyle: "italic" }}>
              "Capability, not software, is the competitive advantage."
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ maxWidth: 1000, margin: "0 auto", padding: "1.75rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>BIMfluence</span>
        <span style={{ fontSize: 12, color: T.inkFaint }}>Construction × Adoption × Intelligence</span>
      </footer>
    </div>
  );
}

// THINKING
const ARTICLES = [
  { title: "The Decision Gap: a measurable framework for construction performance",           tag: "Framework",  level: "Intermediate" },
  { title: "Construction doesn't have a technology problem",                                  tag: "Essay",      level: "Beginner"     },
  { title: "Orchestrated intelligence: AI at defined points in the construction workflow",    tag: "Applied AI", level: "Advanced"     },
  { title: "The Adoption Ceiling: why the economic structure of construction resists change", tag: "Essay",      level: "Intermediate" },
  { title: "Why 3% margins make every decision harder than it looks",                        tag: "Systems",    level: "Beginner"     },
  { title: "The Construction Intelligence Stack",                                             tag: "Framework",  level: "Advanced"     },
  { title: "BIM underdelivered. That's worth understanding.",                                tag: "Contrarian", level: "Contrarian"   },
  { title: "The Adoption Flywheel: what makes implementations compound instead of collapse", tag: "Framework",  level: "Intermediate" },
  { title: "What digital adoption actually requires on site",                                tag: "Essay",      level: "Beginner"     },
  { title: "The organizational learning rate and why it compounds",                          tag: "Systems",    level: "Advanced"     },
];

function Thinking() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Essays", "Frameworks", "Applied AI", "Contrarian", "Systems"];
  const filtered = filter === "All" ? ARTICLES : ARTICLES.filter(a => a.tag === filter);

  return (
    <PageShell title="Thinking" subtitle="Arguments about construction, decision systems, and what applied intelligence looks like when it's actually applied.">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "3rem" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ fontSize: 12, padding: "5px 14px", borderRadius: 100, border: `0.5px solid ${filter === f ? T.ink : T.border}`, background: filter === f ? T.ink : "transparent", color: filter === f ? "#fff" : T.inkMuted, cursor: "pointer", transition: "all 0.15s" }}>
            {f}
          </button>
        ))}
      </div>
      <div>
        {filtered.map((a, i) => (
          <div key={i} className="article-row">
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, color: T.ink, lineHeight: 1.55, marginBottom: 6 }}>{a.title}</p>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span className="tag-pill">{a.tag}</span>
                <span className="tag-pill" style={{ color: T.inkFaint }}>{a.level}</span>
              </div>
            </div>
            <span style={{ fontSize: 12, color: T.inkFaint, whiteSpace: "nowrap" }}>Upcoming</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "3rem", padding: "2rem", background: T.accentLight, borderRadius: 10, border: `0.5px solid rgba(43,79,212,0.12)` }}>
        <p style={{ fontSize: 13, color: T.accent, marginBottom: 6, fontWeight: 500 }}>In progress</p>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: T.inkMuted }}>Ten pieces in draft. The opening argument is that construction's delivery problem is not a technology gap but a decision architecture problem. The frameworks build from there.</p>
      </div>
    </PageShell>
  );
}

// FRAMEWORKS
const FRAMEWORKS = [
  {
    name: "The Decision Gap",
    tagline: "The measurable distance between when information is available and when it changes a decision.",
    status: "In development",
    body: "On most construction projects, the gap between data arriving and someone with authority acting on it is measured in days or weeks. That window is not random. It has a structure determined by workflow design, authority distribution, and information routing. The Decision Gap framework makes it measurable, comparable across project types, and reducible through specific interventions rather than general technology adoption.",
    tags: ["Decision Intelligence", "Operations"],
  },
  {
    name: "The Construction Intelligence Stack",
    tagline: "A layered model of how organizations build capacity to act on what they know.",
    status: "In development",
    body: "Between raw project data and an operational decision, at least five distinct transformations must occur: structuring, contextualizing, pattern recognition, judgment, execution. Most construction organizations have strong data infrastructure and weak everything above it. AI is useful at several layers, but only where the layer beneath it has already been designed. This framework maps where most organizations are losing intelligence, and where to intervene.",
    tags: ["Systems", "Applied AI"],
  },
  {
    name: "The Adoption Flywheel",
    tagline: "What separates implementations that compound from those that collapse.",
    status: "In development",
    body: "A well-implemented tool produces reliable data. Reliable data enables decisions that visibly work. Visible results reduce resistance to the next change. Most technology programs in construction never enter this cycle because the first implementation is either under-designed or disconnected from a decision anyone cares about. The framework identifies the entry conditions and the points where the cycle most commonly breaks.",
    tags: ["Digital Adoption", "Systems"],
  },
];

function Frameworks() {
  return (
    <PageShell title="Frameworks" subtitle="Working models for how construction organizations make decisions, build operational capability, and change how they work.">
      <div style={{ display: "grid", gap: 14, marginBottom: "3.5rem" }}>
        {FRAMEWORKS.map((f, i) => (
          <div key={i} className="framework-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.1rem" }}>
              <div>
                <p style={{ fontFamily: T.serif, fontSize: 21, color: T.ink, marginBottom: 5 }}>{f.name}</p>
                <p style={{ fontSize: 13, color: T.inkMuted, fontStyle: "italic" }}>{f.tagline}</p>
              </div>
              <span style={{ fontSize: 11, color: T.accent, background: T.accentLight, borderRadius: 100, padding: "3px 10px", whiteSpace: "nowrap", flexShrink: 0, marginLeft: 16 }}>{f.status}</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: T.inkMuted, marginBottom: "1.1rem" }}>{f.body}</p>
            <div style={{ display: "flex", gap: 6 }}>
              {f.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
      <hr className="divider" style={{ marginBottom: "2.5rem" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem" }}>
        <p className="micro-label" style={{ paddingTop: 4 }}>On these models</p>
        <div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.inkMuted, marginBottom: "0.85rem" }}>These are built from field observation and tested against source material. Not management frameworks adapted for construction. Not borrowed from adjacent industries.</p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.inkMuted }}>Some will hold. Some will need revision. Publishing them before they're finished is deliberate.</p>
        </div>
      </div>
    </PageShell>
  );
}

// FIELD NOTES
function FieldNotes() {
  return (
    <PageShell title="Field Notes" subtitle="Shorter observations. Patterns that aren't yet frameworks. Things worth writing down before the explanation gets tidied into something less true.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", marginBottom: "4rem" }}>
        <p className="micro-label" style={{ paddingTop: 4 }}>What this section is</p>
        <div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.inkMuted, marginBottom: "0.85rem" }}>Field Notes is for things that don't have a complete argument behind them yet. A pattern observed on a project. A tool that worked in one specific context and failed in another. A failure worth recording before the post-mortem makes it sound more avoidable than it was.</p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.inkMuted }}>Published when useful. Not when polished.</p>
        </div>
      </div>
      <hr className="divider" style={{ marginBottom: "2.5rem" }} />
      <div>
        {[
          "On measuring adoption without vanity metrics",
          "The first time I saw an early warning system change an actual decision",
          "Why the pilot never becomes the program",
          "What a 14-day Decision Gap looks like when you're inside one",
          "Building AI workflows for construction: what breaks first",
        ].map((title, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: `0.5px solid ${T.border}` }}>
            <p style={{ fontSize: 14, color: T.ink, lineHeight: 1.5 }}>{title}</p>
            <span style={{ fontSize: 12, color: T.inkFaint, marginLeft: "2rem", flexShrink: 0 }}>Upcoming</span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// LIBRARY
const BOOKS = [
  { title: "BIM Demystified",                 author: "Steve Hamil",       theme: "Information architecture", note: "Useful for understanding why BIM is an information management approach that got named after its most visible artifact. That naming confusion has cost the industry a decade of clearer thinking." },
  { title: "Civil Engineering Procedure",     author: "ICE",               theme: "Systems & process",        note: "The procedural structure of civil projects laid out without interpretation. Useful for seeing exactly where decision authority sits and how information is supposed to reach it." },
  { title: "Managing Performance in Construction", author: "Bernold & AbouRizk", theme: "Operations",       note: "Treats communication as the primary operating system of a project rather than a support function. The information logistics framing in chapter 10 is more useful than most BIM literature on the same problem." },
  { title: "Global Construction Success",     author: "Charles O'Neil",    theme: "Risk & failure",           note: "Honest about why construction firms fail. The pattern in almost every case is not technical failure. It is a series of decisions made too late or with the wrong information, compounded by structures that punished honest reporting." },
  { title: "Construction Contracts",          author: "Murdoch & Hughes",  theme: "Risk allocation",          note: "Contracts redistribute risk rather than reduce it. That distinction matters when people propose contract reform as a solution to construction's performance problems. It addresses symptoms." },
  { title: "Engineering Project Management",  author: "Maylor et al.",     theme: "Decision systems",         note: "Covers the decision architecture that project delivery requires. Most useful for understanding which decisions break down under schedule pressure and why the sequence matters." },
  { title: "The Coming Wave",                 author: "Mustafa Suleyman",  theme: "AI & technology",          note: "The exponential capability vs. linear adoption argument is the one worth carrying into construction. The gap between what AI can do and what organizations are structured to absorb is the actual problem space." },
  { title: "AI Engineering",                  author: "Chip Huyen",        theme: "Applied AI",               note: "Practical. Focused on what matters when building applications on top of existing models. More useful than most AI writing for anyone thinking about near-term construction applications." },
  { title: "AI Agents: The Definitive Guide", author: "Koenigstein",       theme: "Applied AI",               note: "The distinction between orchestrated and autonomous systems is the most important idea here. Nearly all viable construction AI use cases are orchestrated. That is a design constraint, not a limitation." },
  { title: "AI Agents with MCP",              author: "Kyle Stratis",      theme: "Applied AI",               note: "Covers the protocol layer that allows AI agents to interact with external tools. Relevant for anyone designing construction AI workflows that need to reach into existing project data environments." },
];

function Library() {
  const [theme, setTheme] = useState("All");
  const themes = ["All", ...Array.from(new Set(BOOKS.map(b => b.theme)))];
  const filtered = theme === "All" ? BOOKS : BOOKS.filter(b => b.theme === theme);

  return (
    <PageShell title="Library" subtitle="The sources behind the frameworks. Each entry is here for a specific reason — noted below rather than described.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", marginBottom: "3rem" }}>
        <p className="micro-label" style={{ paddingTop: 4 }}>On this list</p>
        <p style={{ fontSize: 15, lineHeight: 1.85, color: T.inkMuted }}>Not a reading list. These are the books I pulled from when building the frameworks. The note says what each one contributed, not what it covers.</p>
      </div>
      <hr className="divider" style={{ marginBottom: "2rem" }} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "2rem" }}>
        {themes.map(t => (
          <button key={t} onClick={() => setTheme(t)}
            style={{ fontSize: 12, padding: "5px 14px", borderRadius: 100, border: `0.5px solid ${theme === t ? T.ink : T.border}`, background: theme === t ? T.ink : "transparent", color: theme === t ? "#fff" : T.inkMuted, cursor: "pointer", transition: "all 0.15s" }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {filtered.map((b, i) => (
          <div key={i} style={{ background: T.bgCard, border: `0.5px solid ${T.border}`, borderRadius: 10, padding: "1.25rem 1.5rem", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", alignItems: "start" }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 500, color: T.ink, marginBottom: 3 }}>{b.title}</p>
              <p style={{ fontSize: 12, color: T.inkMuted, marginBottom: "0.75rem" }}>{b.author}</p>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: T.inkMuted }}>{b.note}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span className="tag-pill">{b.theme}</span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ABOUT
function About({ setPage }) {
  return (
    <PageShell title="About" subtitle="">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", marginBottom: "4rem" }}>
        <div>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: T.serif, fontSize: 16, color: "rgba(255,255,255,0.88)", fontStyle: "italic" }}>EA</span>
          </div>
          <p style={{ fontSize: 16, fontWeight: 500, color: T.ink, marginBottom: 4 }}>Endreas Aberra</p>
          <p style={{ fontSize: 13, color: T.inkMuted }}>bimfluence.se</p>
        </div>
        <div>
          <p style={{ fontFamily: T.serif, fontSize: 21, color: T.ink, lineHeight: 1.5, marginBottom: "2.25rem", fontStyle: "italic" }}>
            "I've spent a decade close enough to construction technology to understand why it keeps disappointing people."
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.inkMuted, marginBottom: "1rem" }}>
            I've worked across construction delivery, BIM and VDC, customer success, and technology adoption programs. Different organizations, different roles, but the same underlying problem kept surfacing: good information was not reaching the people with the authority and timing to act on it.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.inkMuted, marginBottom: "1rem" }}>
            BIMfluence is the attempt to name that problem precisely, build frameworks for diagnosing it, and eventually develop products that address it. The essays, frameworks, and field notes here are the visible part of that work.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.inkMuted, marginBottom: "2.75rem" }}>
            I think of this as working in the early stages of a discipline that doesn't quite have a name yet. Construction Intelligence is the closest I have.
          </p>
          <hr className="divider" style={{ marginBottom: "2rem" }} />
          <p className="micro-label" style={{ marginBottom: "1.5rem" }}>Background</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              { label: "Construction Operator",  current: false },
              { label: "Digital Translator",     current: false },
              { label: "Systems Thinker",        current: false },
              { label: "Applied AI Explorer",    current: true  },
            ].map((s, i, arr) => (
              <div key={s.label}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.current ? T.accent : T.borderMed, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: s.current ? T.accent : T.inkMuted, fontWeight: s.current ? 500 : 400 }}>{s.label}</span>
                </div>
                {i < arr.length - 1 && <div style={{ marginLeft: 3, width: 0.5, height: 14, background: T.border }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: T.ink, borderRadius: 12, padding: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "2.5rem" }}>
        <p style={{ fontFamily: T.serif, fontSize: 19, color: "rgba(255,255,255,0.82)", fontStyle: "italic", maxWidth: 420, lineHeight: 1.5 }}>
          If any of this connects with something you're working through, I'd like to hear about it.
        </p>
        <button className="cta-primary" onClick={() => setPage("connect")} style={{ background: "#fff", color: T.ink, flexShrink: 0 }}>
          Get in touch
        </button>
      </div>
    </PageShell>
  );
}

// CONNECT
function Connect() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  return (
    <PageShell title="Connect" subtitle="Open to conversations about construction, decision systems, AI in practice, and ideas I haven't thought of yet.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "4rem", alignItems: "start" }}>
        <div>
          <p className="micro-label" style={{ marginBottom: "1.5rem" }}>Good reasons to write</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: "3rem" }}>
            {[
              "You've seen a Decision Gap close, or fail to close, on a specific project",
              "You're building something at the intersection of construction and AI",
              "You think one of the frameworks is wrong",
              "You work inside an organization trying to change how decisions get made",
              "Something here connected with a problem you haven't been able to name",
            ].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.inkFaint, flexShrink: 0, marginTop: 7 }} />
                <span style={{ fontSize: 14, color: T.inkMuted, lineHeight: 1.65 }}>{t}</span>
              </div>
            ))}
          </div>
          <hr className="divider" style={{ marginBottom: "1.5rem" }} />
          <p style={{ fontSize: 13, lineHeight: 1.75, color: T.inkFaint }}>This site is not a front for consulting. If that's what you're looking for, say so and I'll be direct about what's possible.</p>
        </div>
        <div>
          {sent ? (
            <div style={{ padding: "2.5rem", border: `0.5px solid ${T.border}`, borderRadius: 12, textAlign: "center" }}>
              <p style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, marginBottom: "0.75rem", fontStyle: "italic" }}>Sent.</p>
              <p style={{ fontSize: 14, color: T.inkMuted }}>I read everything. Reply time varies.</p>
            </div>
          ) : (
            <div style={{ background: T.bgCard, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: "2rem" }}>
              {[
                { label: "Name",  key: "name",  type: "text",  placeholder: "Your name"      },
                { label: "Email", key: "email", type: "email", placeholder: "your@email.com" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: 12, color: T.inkMuted, marginBottom: 5 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: 12, color: T.inkMuted, marginBottom: 5 }}>Message</label>
                <textarea rows={5} placeholder="What's on your mind?" value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: "vertical" }} />
              </div>
              <button className="cta-primary" style={{ width: "100%", justifyContent: "center" }}
                onClick={() => form.name && form.email && setSent(true)}>
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

// PAGE SHELL
function PageShell({ title, subtitle, children }) {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "5rem 2rem 6rem", paddingTop: "calc(56px + 4rem)" }}>
      <div style={{ marginBottom: "4rem" }}>
        <h1 className="fade-up" style={{ fontFamily: T.serif, fontSize: "clamp(30px, 4vw, 42px)", fontWeight: 400, color: T.ink, marginBottom: subtitle ? "1rem" : 0 }}>
          {title}
        </h1>
        {subtitle && (
          <p className="fade-up" style={{ fontSize: 16, lineHeight: 1.75, color: T.inkMuted, maxWidth: 520, animationDelay: "0.1s" }}>
            {subtitle}
          </p>
        )}
      </div>
      <hr className="divider" style={{ marginBottom: "3rem" }} />
      {children}
    </div>
  );
}

// APP
export default function App() {
  const [page, setPage]     = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 40);
    el.addEventListener("scroll", fn);
    return () => el.removeEventListener("scroll", fn);
  }, []);

  const go = (p) => { setPage(p); if (ref.current) ref.current.scrollTop = 0; };

  const PAGES = {
    home:       <Home setPage={go} />,
    thinking:   <Thinking />,
    frameworks: <Frameworks />,
    fieldnotes: <FieldNotes />,
    library:    <Library />,
    about:      <About setPage={go} />,
    connect:    <Connect />,
  };

  return (
    <div ref={ref} style={{ height: "100vh", overflowY: "auto", background: T.bg }}>
      <Nav page={page} setPage={go} scrolled={scrolled} />
      <div key={page} className="fade-in">
        {PAGES[page] || <Home setPage={go} />}
      </div>
    </div>
  );
}
