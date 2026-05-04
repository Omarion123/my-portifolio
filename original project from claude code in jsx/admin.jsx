// Admin dashboard — login, sidebar shell, overview, Projects CRUD,
// list views for the other sections.

const { useState: useStateA, useMemo: useMemoA } = React;

function Admin({ data, setData, onExit }) {
  const [authed, setAuthed] = useStateA(false);
  if (!authed) return <AdminLogin onAuth={() => setAuthed(true)} onExit={onExit} />;
  return <AdminShell data={data} setData={setData} onExit={onExit} />;
}

function AdminLogin({ onAuth, onExit }) {
  const [email, setEmail] = useStateA("omar@khouri.dev");
  const [pass, setPass] = useStateA("••••••••••");
  const [busy, setBusy] = useStateA(false);
  const submit = (e) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => onAuth(), 700);
  };
  return (
    <div className="admin-login">
      <div className="login-card card">
        <div className="login-head">
          <div className="login-mark"><span /></div>
          <div>
            <span className="mono">portfolio.admin</span>
            <h1>Sign in</h1>
          </div>
        </div>
        <form onSubmit={submit} className="login-form">
          <div>
            <label className="field-label">Email</label>
            <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input className="field" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Authenticating…" : "Continue →"}
          </button>
          <div className="login-fine mono">
            <span>Single-admin · JWT 24h · 2FA enabled</span>
          </div>
        </form>
        <button className="btn btn-ghost btn-sm login-back" onClick={onExit}>← Back to site</button>
      </div>
      <div className="login-bg" aria-hidden>
        <div className="login-grid" />
      </div>
    </div>
  );
}

function AdminShell({ data, setData, onExit }) {
  const [view, setView] = useStateA("overview");
  const items = [
    { id: "overview", label: "Overview", icon: "◇" },
    { id: "about", label: "About", icon: "○" },
    { id: "projects", label: "Projects", icon: "□", count: data.projects.length },
    { id: "skills", label: "Skills", icon: "△", count: data.skills.length },
    { id: "experience", label: "Experience", icon: "▷", count: data.experience.length },
    { id: "education", label: "Education", icon: "▽", count: data.education.length },
    { id: "certs", label: "Certifications", icon: "✦", count: data.certifications.length },
    { id: "blog", label: "Blog", icon: "❡", count: data.posts.length },
    { id: "contact", label: "Contact info", icon: "@" },
  ];
  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-side-head">
          <div className="adm-mark"><span /></div>
          <div>
            <div className="adm-side-title">{data.identity.name}</div>
            <div className="mono adm-side-sub">admin · v2.4.1</div>
          </div>
        </div>
        <nav className="adm-nav">
          <div className="adm-nav-group mono">Manage</div>
          {items.map((it) => (
            <button
              key={it.id}
              className={`adm-nav-item ${view === it.id ? "adm-nav-active" : ""}`}
              onClick={() => setView(it.id)}
            >
              <span className="adm-nav-icon">{it.icon}</span>
              <span className="adm-nav-label">{it.label}</span>
              {it.count != null && <span className="adm-nav-count mono">{it.count}</span>}
            </button>
          ))}
        </nav>
        <div className="adm-side-foot">
          <button className="btn btn-sm" onClick={onExit}>↗ View site</button>
          <button className="btn btn-ghost btn-sm" onClick={onExit}>Sign out</button>
        </div>
      </aside>

      <main className="adm-main">
        <header className="adm-top">
          <div className="adm-crumbs mono">
            <span>admin</span>
            <span>/</span>
            <span className="adm-crumb-active">{items.find((i) => i.id === view)?.label}</span>
          </div>
          <div className="adm-top-actions">
            <div className="adm-search">
              <span className="mono">⌘K</span>
              <input placeholder="Search content…" />
            </div>
            <button className="adm-bell" title="Notifications">⚐<span className="adm-bell-dot" /></button>
            <div className="adm-avatar" title="Omar Khouri">OK</div>
          </div>
        </header>

        <div className="adm-body">
          {view === "overview" && <AdmOverview data={data} setView={setView} />}
          {view === "about" && <AdmAbout data={data} setData={setData} />}
          {view === "projects" && <AdmProjects data={data} setData={setData} />}
          {view === "skills" && <AdmSkills data={data} />}
          {view === "experience" && <AdmExperience data={data} />}
          {view === "education" && <AdmEducation data={data} />}
          {view === "certs" && <AdmCerts data={data} />}
          {view === "blog" && <AdmBlog data={data} />}
          {view === "contact" && <AdmContact data={data} setData={setData} />}
        </div>
      </main>
    </div>
  );
}

// ── Overview ────────────────────────────────────────────────────────────────
function AdmOverview({ data, setView }) {
  const stats = [
    { k: "Projects", v: data.projects.length, sub: `${data.projects.filter((p) => p.featured).length} featured`, trend: "+2" },
    { k: "Skills tracked", v: data.skills.reduce((a, g) => a + g.items.length, 0), sub: `${data.skills.length} groups`, trend: "—" },
    { k: "Posts", v: data.posts.length, sub: "1 draft", trend: "+1" },
    { k: "Visitors (30d)", v: "12.4k", sub: "vs 9.1k last", trend: "+36%" },
  ];
  const activity = [
    { t: "2 min ago", m: "Edited project Loom Realtime — updated tech stack" },
    { t: "1 h ago", m: "Published post On-call without resentment" },
    { t: "Yesterday", m: "Added certification AWS Solutions Architect" },
    { t: "2 days ago", m: "Updated About me — new paragraph on focus" },
    { t: "5 days ago", m: "Deployed v2.4.1" },
  ];
  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Welcome back, Omar.</h1>
          <p className="adm-page-sub">Here's what changed since you last logged in.</p>
        </div>
        <div className="adm-page-actions">
          <button className="btn btn-sm">Preview site</button>
          <button className="btn btn-primary btn-sm" onClick={() => setView("projects")}>+ New project</button>
        </div>
      </div>

      <div className="adm-stats">
        {stats.map((s) => (
          <div key={s.k} className="adm-stat card">
            <div className="adm-stat-k mono">{s.k}</div>
            <div className="adm-stat-v">{s.v}</div>
            <div className="adm-stat-sub">
              <span>{s.sub}</span>
              <span className={`adm-stat-trend ${s.trend.startsWith("+") ? "trend-up" : "trend-flat"}`}>{s.trend}</span>
            </div>
            <Sparkline />
          </div>
        ))}
      </div>

      <div className="adm-grid-2">
        <div className="card adm-panel">
          <div className="adm-panel-head">
            <h3>Recent activity</h3>
            <span className="mono">last 7d</span>
          </div>
          <ul className="adm-activity">
            {activity.map((a, i) => (
              <li key={i}>
                <span className="adm-activity-t mono">{a.t}</span>
                <span className="adm-activity-m">{a.m}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card adm-panel">
          <div className="adm-panel-head">
            <h3>Quick actions</h3>
            <span className="mono">shortcuts</span>
          </div>
          <div className="adm-quick">
            {[
              { l: "Add project", k: "P", v: "projects" },
              { l: "New post", k: "B", v: "blog" },
              { l: "Edit about", k: "A", v: "about" },
              { l: "Add skill", k: "S", v: "skills" },
              { l: "New experience", k: "E", v: "experience" },
              { l: "Update contact", k: "C", v: "contact" },
            ].map((q) => (
              <button key={q.l} className="adm-quick-item" onClick={() => setView(q.v)}>
                <span>{q.l}</span>
                <span className="mono adm-quick-k">⌘{q.k}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkline() {
  // small inline sparkline
  const points = [4, 6, 5, 8, 7, 10, 9, 12, 11, 14, 13, 16];
  const max = Math.max(...points);
  const w = 160, h = 32;
  const step = w / (points.length - 1);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - (p / max) * h).toFixed(1)}`).join(" ");
  return (
    <svg className="adm-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="var(--accent-soft)" />
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="1.5" />
    </svg>
  );
}

// ── About editor ────────────────────────────────────────────────────────────
function AdmAbout({ data, setData }) {
  const upd = (k, v) =>
    setData({ ...data, identity: { ...data.identity, [k]: v } });
  const updPara = (i, v) => {
    const ps = [...data.about.paragraphs];
    ps[i] = v;
    setData({ ...data, about: { ...data.about, paragraphs: ps } });
  };
  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>About me</h1>
          <p className="adm-page-sub">Edit hero name, tagline, and the about paragraphs.</p>
        </div>
        <div className="adm-page-actions">
          <button className="btn btn-sm">Discard</button>
          <button className="btn btn-primary btn-sm">Save changes</button>
        </div>
      </div>
      <div className="adm-form card">
        <div className="form-row form-row-2">
          <div>
            <label className="field-label">Name</label>
            <input className="field" value={data.identity.name} onChange={(e) => upd("name", e.target.value)} />
          </div>
          <div>
            <label className="field-label">Title</label>
            <input className="field" value={data.identity.title} onChange={(e) => upd("title", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="field-label">Tagline</label>
          <input className="field" value={data.identity.tagline} onChange={(e) => upd("tagline", e.target.value)} />
        </div>
        {data.about.paragraphs.map((p, i) => (
          <div key={i}>
            <label className="field-label">Paragraph {i + 1}</label>
            <textarea className="field" value={p} onChange={(e) => updPara(i, e.target.value)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Projects manager (full CRUD) ────────────────────────────────────────────
function AdmProjects({ data, setData }) {
  const [editing, setEditing] = useStateA(null);
  const [filter, setFilter] = useStateA("All");
  const cats = ["All", ...new Set(data.projects.map((p) => p.category))];
  const list = filter === "All" ? data.projects : data.projects.filter((p) => p.category === filter);

  const create = () => {
    const n = data.projects.length + 1;
    const np = {
      id: "p" + Date.now(),
      idx: String(n).padStart(2, "0"),
      title: "Untitled project",
      blurb: "",
      role: "Solo",
      year: String(new Date().getFullYear()),
      stack: [],
      category: "Product",
      featured: false,
      live: "",
      repo: "",
      status: "Draft",
    };
    setData({ ...data, projects: [...data.projects, np] });
    setEditing(np.id);
  };
  const remove = (id) => setData({ ...data, projects: data.projects.filter((p) => p.id !== id) });
  const update = (id, patch) =>
    setData({ ...data, projects: data.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });

  const editingP = data.projects.find((p) => p.id === editing);

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Projects</h1>
          <p className="adm-page-sub">{data.projects.length} total · {data.projects.filter((p) => p.featured).length} featured on home.</p>
        </div>
        <div className="adm-page-actions">
          <button className="btn btn-sm">Reorder</button>
          <button className="btn btn-primary btn-sm" onClick={create}>+ New project</button>
        </div>
      </div>

      <div className="adm-toolbar">
        <div className="adm-toolbar-chips">
          {cats.map((c) => (
            <button key={c} className={`chip ${c === filter ? "chip-active" : ""}`} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="adm-search adm-search-inline">
          <span className="mono">⌘F</span>
          <input placeholder="Search projects…" />
        </div>
      </div>

      <div className="card adm-table">
        <div className="adm-tr adm-tr-head mono">
          <span></span>
          <span>Title</span>
          <span>Category</span>
          <span>Year</span>
          <span>Status</span>
          <span>Featured</span>
          <span></span>
        </div>
        {list.map((p) => (
          <div key={p.id} className="adm-tr">
            <span className="adm-tr-idx mono">{p.idx}</span>
            <span className="adm-tr-title">
              <strong>{p.title}</strong>
              <span className="adm-tr-blurb">{p.blurb || <em>No description</em>}</span>
            </span>
            <span><span className="chip">{p.category}</span></span>
            <span className="mono">{p.year}</span>
            <span><span className="dot live" /> {p.status}</span>
            <span>
              <button
                className={`adm-toggle ${p.featured ? "adm-toggle-on" : ""}`}
                onClick={() => update(p.id, { featured: !p.featured })}
                aria-label="Toggle featured"
              >
                <span />
              </button>
            </span>
            <span className="adm-tr-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setEditing(p.id)}>Edit</button>
              <button className="btn btn-ghost btn-sm adm-danger" onClick={() => remove(p.id)}>Delete</button>
            </span>
          </div>
        ))}
      </div>

      {editingP && <ProjectEditor p={editingP} onChange={(patch) => update(editingP.id, patch)} onClose={() => setEditing(null)} />}
    </div>
  );
}

function ProjectEditor({ p, onChange, onClose }) {
  const [stackInput, setStackInput] = useStateA("");
  return (
    <div className="adm-drawer" role="dialog">
      <div className="adm-drawer-back" onClick={onClose} />
      <div className="adm-drawer-panel card">
        <div className="adm-drawer-head">
          <div>
            <span className="mono">Editing project · {p.idx}</span>
            <h2>{p.title}</h2>
          </div>
          <button className="adm-drawer-x" onClick={onClose}>×</button>
        </div>
        <div className="adm-drawer-body">
          <div className="form-row form-row-2">
            <div>
              <label className="field-label">Title</label>
              <input className="field" value={p.title} onChange={(e) => onChange({ title: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Year</label>
              <input className="field" value={p.year} onChange={(e) => onChange({ year: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea className="field" value={p.blurb} onChange={(e) => onChange({ blurb: e.target.value })} />
          </div>
          <div className="form-row form-row-3">
            <div>
              <label className="field-label">Category</label>
              <select className="field" value={p.category} onChange={(e) => onChange({ category: e.target.value })}>
                {["Product", "Infrastructure", "DevTools", "Experiment"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Role</label>
              <input className="field" value={p.role} onChange={(e) => onChange({ role: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Status</label>
              <select className="field" value={p.status} onChange={(e) => onChange({ status: e.target.value })}>
                {["Live", "Open source", "Internal", "Archived", "Draft"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row form-row-2">
            <div>
              <label className="field-label">Live URL</label>
              <input className="field" value={p.live} placeholder="https://…" onChange={(e) => onChange({ live: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Repo</label>
              <input className="field" value={p.repo} placeholder="github.com/…" onChange={(e) => onChange({ repo: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="field-label">Tech stack</label>
            <div className="stack-editor">
              {p.stack.map((s) => (
                <span key={s} className="stack-tag stack-tag-edit">
                  {s}
                  <button onClick={() => onChange({ stack: p.stack.filter((x) => x !== s) })} aria-label={`remove ${s}`}>×</button>
                </span>
              ))}
              <input
                className="stack-input"
                placeholder="Add tech, press Enter"
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && stackInput.trim()) {
                    e.preventDefault();
                    onChange({ stack: [...p.stack, stackInput.trim()] });
                    setStackInput("");
                  }
                }}
              />
            </div>
          </div>
          <div>
            <label className="field-label">Cover image</label>
            <div className="upload-zone">
              <div className="upload-icon">↑</div>
              <div>
                <strong>Drop an image here</strong> or <span className="ulink">browse</span>
                <div className="mono upload-hint">PNG, JPG, WebP · up to 5 MB · 16:9 recommended</div>
              </div>
            </div>
          </div>
          <div className="adm-drawer-meta">
            <label className="adm-check">
              <input type="checkbox" checked={p.featured} onChange={(e) => onChange({ featured: e.target.checked })} />
              <span>Feature on homepage</span>
            </label>
          </div>
        </div>
        <div className="adm-drawer-foot">
          <span className="mono adm-drawer-saved">● Saved · just now</span>
          <div>
            <button className="btn btn-sm" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={onClose}>Save & close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Generic list views ──────────────────────────────────────────────────────
function AdmSkills({ data }) {
  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div><h1>Skills</h1><p className="adm-page-sub">Grouped by layer. Drag to reorder.</p></div>
        <div className="adm-page-actions">
          <button className="btn btn-sm">+ New group</button>
          <button className="btn btn-primary btn-sm">+ New skill</button>
        </div>
      </div>
      <div className="adm-grid-skills">
        {data.skills.map((g) => (
          <div key={g.group} className="card adm-skill-card">
            <div className="adm-skill-head">
              <h3>{g.group}</h3>
              <button className="btn btn-ghost btn-sm">+ Add</button>
            </div>
            {g.items.map((s) => (
              <div key={s.name} className="adm-skill-row">
                <span>{s.name}</span>
                <input className="field adm-skill-field" type="number" defaultValue={s.level} />
                <button className="btn btn-ghost btn-sm">···</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdmExperience({ data }) {
  return <SimpleList title="Experience" subtitle="Roles ordered most-recent first." add="+ New role"
    rows={data.experience.map((e) => ({ id: e.id, title: e.role, sub: `${e.org} · ${e.where}`, meta: `${e.from}–${e.to}` }))} />;
}
function AdmEducation({ data }) {
  return <SimpleList title="Education" subtitle="Degrees and exchanges." add="+ New entry"
    rows={data.education.map((e) => ({ id: e.id, title: e.degree, sub: e.org, meta: `${e.from}–${e.to}` }))} />;
}
function AdmCerts({ data }) {
  return <SimpleList title="Certifications" subtitle="Badges and online courses." add="+ New cert"
    rows={data.certifications.map((c) => ({ id: c.id, title: c.name, sub: c.org, meta: c.year }))} />;
}
function AdmBlog({ data }) {
  return <SimpleList title="Blog" subtitle="Drafts and published posts." add="+ New post"
    rows={data.posts.map((p) => ({ id: p.id, title: p.title, sub: p.excerpt, meta: `${p.date} · ${p.readMin} min`, tag: p.tag }))} />;
}

function SimpleList({ title, subtitle, rows, add }) {
  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div><h1>{title}</h1><p className="adm-page-sub">{subtitle}</p></div>
        <div className="adm-page-actions">
          <button className="btn btn-sm">Reorder</button>
          <button className="btn btn-primary btn-sm">{add}</button>
        </div>
      </div>
      <div className="card adm-list">
        {rows.map((r) => (
          <div key={r.id} className="adm-list-row">
            <div className="adm-list-handle" aria-hidden>⋮⋮</div>
            <div className="adm-list-main">
              <h4>{r.title}</h4>
              <p>{r.sub}</p>
            </div>
            {r.tag && <span className="chip">{r.tag}</span>}
            <span className="mono adm-list-meta">{r.meta}</span>
            <div className="adm-list-actions">
              <button className="btn btn-ghost btn-sm">Edit</button>
              <button className="btn btn-ghost btn-sm adm-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdmContact({ data, setData }) {
  const upd = (k, v) => setData({ ...data, identity: { ...data.identity, [k]: v } });
  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div><h1>Contact info</h1><p className="adm-page-sub">Email and social links shown in the contact section.</p></div>
        <div className="adm-page-actions">
          <button className="btn btn-primary btn-sm">Save changes</button>
        </div>
      </div>
      <div className="adm-form card">
        <div className="form-row form-row-2">
          <div>
            <label className="field-label">Email</label>
            <input className="field" value={data.identity.email} onChange={(e) => upd("email", e.target.value)} />
          </div>
          <div>
            <label className="field-label">Location</label>
            <input className="field" value={data.identity.location} onChange={(e) => upd("location", e.target.value)} />
          </div>
        </div>
        <div className="form-row form-row-2">
          <div>
            <label className="field-label">GitHub</label>
            <input className="field" value={data.identity.github} onChange={(e) => upd("github", e.target.value)} />
          </div>
          <div>
            <label className="field-label">LinkedIn</label>
            <input className="field" value={data.identity.linkedin} onChange={(e) => upd("linkedin", e.target.value)} />
          </div>
        </div>
        <label className="adm-check">
          <input type="checkbox" checked={data.identity.available} onChange={(e) => upd("available", e.target.checked)} />
          <span>Currently available for new work (shows status dot)</span>
        </label>
      </div>
    </div>
  );
}

Object.assign(window, { Admin });
