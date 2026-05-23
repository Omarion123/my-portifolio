// Public-site sections: Nav, Hero, About, Projects, Skills, Experience,
// Education, Certifications, Blog, Contact, Footer.
// All read from a `data` prop so the admin can edit and see updates live.

const { useState, useEffect, useRef, useMemo } = React;

// ─── Reveal-on-scroll hook ──────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  return ref;
}

function Reveal({
  children,
  delay = 0,
  as: As = "div",
  className = "",
  ...rest
}) {
  const ref = useReveal();
  return (
    <As
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </As>
  );
}

// ─── Nav ────────────────────────────────────────────────────────────────────
function Nav({ data, theme, onTheme, route, onRoute }) {
  const links = [
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "writing", label: "Writing" },
    { id: "contact", label: "Contact" },
  ];
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <button
          className="nav-brand"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="nav-mark" aria-hidden>
            <span className="nav-mark-dot" />
          </span>
          <span className="nav-name">{data.identity.name}</span>
          <span className="nav-slash">/</span>
          <span className="nav-role mono">{data.identity.title}</span>
        </button>
        <div className="nav-links">
          {links.map((l) => (
            <button key={l.id} className="nav-link" onClick={() => go(l.id)}>
              {l.label}
            </button>
          ))}
        </div>
        <div className="nav-actions">
          <button
            className="nav-icon"
            onClick={onTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? "☾" : "☀"}
          </button>
          <button className="btn btn-sm" onClick={() => onRoute("admin")}>
            Admin <span style={{ opacity: 0.5 }}>↗</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────
function Hero({ data }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="hero">
      <div className="hero-grid" aria-hidden />
      <div className="hero-glow" aria-hidden />
      <div className="wrap hero-inner">
        <Reveal className="hero-meta mono">
          <span>
            <span className="dot live" /> Available for new work · Q3 2026
          </span>
          <span>
            {data.identity.location} · {time} local
          </span>
        </Reveal>

        <Reveal delay={80} className="hero-title">
          <h1>
            <span className="hero-line">Building</span>
            <span className="hero-line">
              <em className="hero-em">durable</em> software
            </span>
            <span className="hero-line">
              for the <em className="hero-em hero-em-2">people</em> who use it.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={180} className="hero-tagline">
          <p>{data.identity.tagline}</p>
        </Reveal>

        <Reveal delay={260} className="hero-cta">
          <button
            className="btn btn-primary"
            onClick={() =>
              document
                .getElementById("work")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View selected work <span aria-hidden>→</span>
          </button>
          <button
            className="btn"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get in touch
          </button>
        </Reveal>

        <Reveal delay={360} className="hero-foot">
          <div className="hero-foot-col">
            <span className="mono">Currently</span>
            <span>Senior Engineer at Sundial Labs</span>
          </div>
          <div className="hero-foot-col">
            <span className="mono">Focus</span>
            <span>{data.about.focus.join(" · ")}</span>
          </div>
          <div className="hero-foot-col">
            <span className="mono">Stack</span>
            <span>TypeScript · Rust · Postgres</span>
          </div>
        </Reveal>
      </div>

      <div className="hero-marquee" aria-hidden>
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="marquee-row">
              <span>Realtime systems</span>
              <span>·</span>
              <span>Frontend platform</span>
              <span>·</span>
              <span>Distributed data</span>
              <span>·</span>
              <span>Developer experience</span>
              <span>·</span>
              <span>Honest UX</span>
              <span>·</span>
              <span>Boring infrastructure</span>
              <span>·</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

// ─── About ──────────────────────────────────────────────────────────────────
function About({ data }) {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="sec-idx">01 / About</span>
          <h2 className="sec-title">A short introduction.</h2>
          <span className="sec-meta">~ 2 min read</span>
        </Reveal>

        <div className="about-grid">
          <Reveal className="about-portrait">
            <div className="portrait-frame">
              <div className="portrait-img" aria-label="Portrait placeholder">
                <span className="mono portrait-tag">portrait.jpg · 4×5</span>
              </div>
              <div className="portrait-meta">
                <span className="mono">{data.identity.location}</span>
                <span className="mono">EST. 2018</span>
              </div>
            </div>
          </Reveal>

          <div className="about-body">
            {data.about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={120 + i * 80} as="p" className="about-p">
                {p}
              </Reveal>
            ))}

            <Reveal delay={320} className="about-focus">
              <span className="mono">I focus on</span>
              <ul>
                {data.about.focus.map((f, i) => (
                  <li key={f}>
                    <span className="focus-num mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={420} className="about-stats">
              {data.about.stats.map((s) => (
                <div key={s.k} className="stat">
                  <span className="stat-v">{s.v}</span>
                  <span className="stat-k mono">{s.k}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Projects ───────────────────────────────────────────────────────────────
function Projects({ data }) {
  const cats = useMemo(() => {
    const set = new Set(data.projects.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [data.projects]);
  const [active, setActive] = useState("All");
  const [hover, setHover] = useState(null);

  const list =
    active === "All"
      ? data.projects
      : data.projects.filter((p) => p.category === active);

  return (
    <section id="work" className="section section-work">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="sec-idx">02 / Selected Work</span>
          <h2 className="sec-title">Things I've built recently.</h2>
          <span className="sec-meta">{data.projects.length} projects</span>
        </Reveal>

        <Reveal className="proj-filter">
          <span className="mono">Filter</span>
          <div className="proj-filter-chips">
            {cats.map((c) => (
              <button
                key={c}
                className={`chip ${c === active ? "chip-active" : ""}`}
                onClick={() => setActive(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="mono proj-count">
            {list.length.toString().padStart(2, "0")} shown
          </span>
        </Reveal>

        <div className="proj-list" onMouseLeave={() => setHover(null)}>
          {list.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <ProjectRow
                p={p}
                hovered={hover === p.id}
                onHover={() => setHover(p.id)}
              />
            </Reveal>
          ))}
          {list.length === 0 && (
            <div className="proj-empty mono">
              No projects in this category yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ p, hovered, onHover }) {
  return (
    <article
      className={`proj-row ${hovered ? "proj-row-hover" : ""}`}
      onMouseEnter={onHover}
    >
      <div className="proj-row-idx mono">{p.idx}</div>
      <div className="proj-row-main">
        <div className="proj-row-top">
          <h3 className="proj-row-title">{p.title}</h3>
          <span
            className={`proj-row-status mono status-${p.status.toLowerCase().replace(/\s/g, "-")}`}
          >
            <span className="dot" /> {p.status}
          </span>
        </div>
        <p className="proj-row-blurb">{p.blurb}</p>
        <div className="proj-row-stack">
          {p.stack.map((s) => (
            <span key={s} className="stack-tag">
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="proj-row-side">
        <div className="proj-row-meta">
          <span className="mono">{p.year}</span>
          <span className="mono">{p.role}</span>
        </div>
        <div className="proj-row-links">
          {p.live && (
            <a
              className="proj-link"
              href={p.live}
              onClick={(e) => e.preventDefault()}
            >
              Live <span aria-hidden>↗</span>
            </a>
          )}
          {p.repo && (
            <a
              className="proj-link"
              href={`https://${p.repo}`}
              onClick={(e) => e.preventDefault()}
            >
              Code <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      </div>
      <div className="proj-row-preview" aria-hidden>
        <div className="preview-frame">
          <div className="preview-stripes" />
          <span className="mono preview-tag">
            {p.title.toLowerCase().replace(/\s/g, "-")}.png
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Skills ─────────────────────────────────────────────────────────────────
function Skills({ data }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setShown(true)),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="skills" ref={ref} className="section">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="sec-idx">03 / Skills</span>
          <h2 className="sec-title">Tools I reach for.</h2>
          <span className="sec-meta">By layer</span>
        </Reveal>
        <div className="skills-grid">
          {data.skills.map((g, gi) => (
            <Reveal key={g.group} delay={gi * 80} className="skill-col">
              <div className="skill-col-head">
                <span className="mono">{String(gi + 1).padStart(2, "0")}</span>
                <h3>{g.group}</h3>
              </div>
              <ul className="skill-list">
                {g.items.map((s, si) => (
                  <li key={s.name} className="skill-item">
                    <div className="skill-row">
                      <span>{s.name}</span>
                      <span className="mono skill-pct">
                        {shown ? s.level : 0}
                      </span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className="skill-bar-fill"
                        style={{
                          width: shown ? `${s.level}%` : "0%",
                          transitionDelay: `${gi * 80 + si * 80}ms`,
                        }}
                      />
                      <div className="skill-bar-tick" style={{ left: "25%" }} />
                      <div className="skill-bar-tick" style={{ left: "50%" }} />
                      <div className="skill-bar-tick" style={{ left: "75%" }} />
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Experience timeline ────────────────────────────────────────────────────
function Experience({ data }) {
  return (
    <section id="experience" className="section">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="sec-idx">04 / Experience</span>
          <h2 className="sec-title">Where I've shipped.</h2>
          <span className="sec-meta">2019 — Present</span>
        </Reveal>
        <div className="timeline">
          {data.experience.map((e, i) => (
            <Reveal key={e.id} delay={i * 100} className="tl-item">
              <div className="tl-rail" aria-hidden>
                <span className="tl-dot" />
              </div>
              <div className="tl-side">
                <div className="tl-years mono">
                  <span>{e.from}</span>
                  <span className="tl-years-sep">—</span>
                  <span>{e.to}</span>
                </div>
                <div className="tl-where mono">{e.where}</div>
              </div>
              <div className="tl-card card">
                <div className="tl-card-head">
                  <h3>{e.role}</h3>
                  <span className="tl-org">{e.org}</span>
                </div>
                <p className="tl-summary">{e.summary}</p>
                {e.bullets.length > 0 && (
                  <ul className="tl-bullets">
                    {e.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Education + Certifications side-by-side ────────────────────────────────
function EduCerts({ data }) {
  return (
    <section id="education" className="section">
      <div className="wrap">
        <div className="ec-grid">
          <div>
            <Reveal className="sec-head">
              <span className="sec-idx">05 / Education</span>
              <h2 className="sec-title">Studied.</h2>
            </Reveal>
            <div className="edu-list">
              {data.education.map((e, i) => (
                <Reveal key={e.id} delay={i * 80} className="edu-item">
                  <div className="edu-years mono">
                    {e.from}–{e.to}
                  </div>
                  <h3 className="edu-degree">{e.degree}</h3>
                  <div className="edu-org">{e.org}</div>
                  <p className="edu-note">{e.note}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <div>
            <Reveal className="sec-head">
              <span className="sec-idx">06 / Certifications</span>
              <h2 className="sec-title">Earned.</h2>
            </Reveal>
            <div className="cert-list">
              {data.certifications.map((c, i) => (
                <Reveal key={c.id} delay={i * 80} className="cert-item card">
                  <div className="cert-badge" aria-hidden>
                    <svg viewBox="0 0 40 40" width="32" height="32">
                      <circle
                        cx="20"
                        cy="20"
                        r="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.8"
                        opacity="0.5"
                      />
                      <circle cx="20" cy="20" r="3" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="cert-body">
                    <h3 className="cert-name">{c.name}</h3>
                    <div className="cert-meta mono">
                      <span>{c.org}</span>
                      <span>·</span>
                      <span>{c.year}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Blog ───────────────────────────────────────────────────────────────────
function Blog({ data }) {
  return (
    <section id="writing" className="section">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="sec-idx">07 / Writing</span>
          <h2 className="sec-title">Recent posts.</h2>
          <span className="sec-meta">{data.posts.length} essays</span>
        </Reveal>
        <div className="blog-list">
          {data.posts.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <a
                className="blog-row"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                <div className="blog-date mono">{p.date}</div>
                <div className="blog-main">
                  <h3 className="blog-title">{p.title}</h3>
                  <p className="blog-excerpt">{p.excerpt}</p>
                </div>
                <div className="blog-meta">
                  <span className="chip">{p.tag}</span>
                  <span className="mono blog-read">{p.readMin} min</span>
                  <span className="blog-arrow" aria-hidden>
                    →
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ────────────────────────────────────────────────────────────────
function Contact({ data }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "Project",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!form.email || !form.message) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", topic: "Project", message: "" });
    }, 3200);
  };

  return (
    <section id="contact" className="section section-contact">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="sec-idx">08 / Contact</span>
          <h2 className="sec-title">Let's build something.</h2>
          <span className="sec-meta">Replies within 48h</span>
        </Reveal>
        <div className="contact-grid">
          <Reveal className="contact-aside">
            <div className="contact-block">
              <span className="mono">Email</span>
              <a
                className="ulink contact-big"
                href={`mailto:${data.identity.email}`}
              >
                {data.identity.email}
              </a>
            </div>
            <div className="contact-block">
              <span className="mono">Elsewhere</span>
              <ul className="contact-links">
                <li>
                  <a
                    className="ulink"
                    href={`https://${data.identity.github}`}
                    onClick={(e) => e.preventDefault()}
                  >
                    {data.identity.github} ↗
                  </a>
                </li>
                <li>
                  <a
                    className="ulink"
                    href={`https://${data.identity.linkedin}`}
                    onClick={(e) => e.preventDefault()}
                  >
                    {data.identity.linkedin} ↗
                  </a>
                </li>
              </ul>
            </div>
            <div className="contact-block">
              <span className="mono">Status</span>
              <span className="contact-avail">
                <span className="dot live" /> Booking projects for Q3 2026
              </span>
            </div>
          </Reveal>

          <Reveal delay={140} className="contact-form-wrap">
            <form className="contact-form" onSubmit={submit}>
              <div className="form-row form-row-2">
                <div>
                  <label className="field-label">Your name</label>
                  <input
                    className="field"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ada Lovelace"
                  />
                </div>
                <div>
                  <label className="field-label">Email *</label>
                  <input
                    className="field"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="ada@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="field-label">Topic</label>
                <div className="topic-row">
                  {["Project", "Hire", "Speaking", "Just hi"].map((t) => (
                    <button
                      type="button"
                      key={t}
                      className={`chip ${form.topic === t ? "chip-active" : ""}`}
                      onClick={() => setForm({ ...form, topic: t })}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="field-label">Message *</label>
                <textarea
                  className="field"
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="What are you working on?"
                />
              </div>
              <div className="form-actions">
                <span className="mono form-hint">
                  {form.message.length} / 1000
                </span>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sent}
                >
                  {sent ? "Sent ✓" : "Send message →"}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────
function Footer({ data }) {
  return (
    <footer className="foot">
      <div className="wrap foot-inner">
        <div className="foot-big">
          <span>{data.identity.name.split(" ")[0]}.</span>
          <span className="foot-big-dim">
            {data.identity.name.split(" ").slice(1).join(" ")}
          </span>
        </div>
        <div className="foot-cols">
          <div>
            <span className="mono">Local</span>
            <span>{data.identity.location}</span>
          </div>
          <div>
            <span className="mono">Email</span>
            <a className="ulink" href={`mailto:${data.identity.email}`}>
              {data.identity.email}
            </a>
          </div>
          <div>
            <span className="mono">Year</span>
            <span>2026</span>
          </div>
        </div>
        <div className="foot-fine mono">
          <button
            className="ulink"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Nav,
  Hero,
  About,
  Projects,
  Skills,
  Experience,
  EduCerts,
  Blog,
  Contact,
  Footer,
  Reveal,
});
