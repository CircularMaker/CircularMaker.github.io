/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo } = React;

/* ============================================================
   DATA — drawn from the original poster
   ============================================================ */
const WORKSHOPS = [
{ id: "w1", date: "29 MAI", time: "17:00", title: "Åpningsfest", host: "Hele teamet", spots: 80, taken: 53, tag: "Event", img: "p4" },
{ id: "w2", date: "04 JUN", time: "18:00", title: "Synål & sytråd — reparasjon for nybegynnere", host: "Inga", spots: 12, taken: 9, tag: "Kurs", img: "p5" },
{ id: "w3", date: "08 JUN", time: "10:00", title: "Broderitreff — kom som du er", host: "Liv", spots: 15, taken: 6, tag: "Drop-in", img: "p6" },
{ id: "w4", date: "11 JUN", time: "17:30", title: "Heklet topp av rester", host: "Aïsha", spots: 10, taken: 10, tag: "Kurs", img: "p3" },
{ id: "w5", date: "15 JUN", time: "12:00", title: "Reparasjonscafé — gratis", host: "Drop-in", spots: 30, taken: 12, tag: "Gratis", img: "p1" },
{ id: "w6", date: "22 JUN", time: "18:00", title: "Redesign jeans → veske", host: "Mira", spots: 8, taken: 5, tag: "Kurs", img: "p2" }];


const SERVICES = [
{ id: "s1", title: "Reparasjon", desc: "Knapper, hull, ødelagte glidelåser, sliter, slitne sømmer. Ta med i butikken — vi gir pris på flekken.", price: "fra 80 kr", img: "p5", color: "#0da959" },
{ id: "s2", title: "Omsøm", desc: "Ta inn, slipp ut, korte ned. Klassisk skredderarbeid på dine egne plagg.", price: "fra 250 kr", img: "p2", color: "#0da959" },
{ id: "s3", title: "Broderi", desc: "Mono­grammer, logoer, motiv. Vi har en Melco 16-nålers maskin og digitaliserer ditt motiv.", price: "fra 150 kr", img: "p6", color: "#0da959" },
{ id: "s4", title: "Redesign", desc: "Snakk med oss om plagget du elsker men ikke bruker. Vi tegner det om til noe du faktisk vil ha på.", price: "individuelt", img: "p3", color: "#0da959" },
{ id: "s5", title: "2.hand", desc: "Kuratert utvalg av brukte plagg, materialer og rester — alt klart til nytt liv.", price: "varierer", img: "p4", color: "#0da959" },
{ id: "s6", title: "Materialbank", desc: "Stoff­rester, knapper, glidelåser, garn — gjenbruks­materialer du kan kjøpe på vekt.", price: "fra 40 kr/kg", img: "p1", color: "#0da959" }];


const PICKER_OPTIONS = [
{ q: "Glidelås røket", to: "s1", icon: "⌇" },
{ q: "For stort i livet", to: "s2", icon: "↤↦" },
{ q: "Hull i kneet", to: "s1", icon: "◌" },
{ q: "Vil ha logo / navn på", to: "s3", icon: "✦" },
{ q: "Kjedelig kjole jeg ikke bruker", to: "s4", icon: "↻" },
{ q: "Trenger stoff til prosjekt", to: "s6", icon: "▤" },
{ q: "Knapp falt av", to: "s1", icon: "●" },
{ q: "Vil lære selv", to: null, icon: "✎", workshop: true }];


const STATS = [
{ n: 1284, label: "plagg reparert" },
{ n: 312, label: "kg stoff i materialbanken" },
{ n: 47, label: "kurs holdt" },
{ n: 6, label: "dager til åpning" }];


/* ============================================================
   PRIMITIVES
   ============================================================ */
function Tag({ children, color = "var(--ink)", bg = "transparent", border = true }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: 999,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase",
      color, background: bg,
      border: border ? `1px solid ${color}` : "none",
      whiteSpace: "nowrap"
    }}>{children}</span>);

}

function Dot({ size = 8, color = "var(--green)" }) {
  return <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: color }} />;
}

/* ============================================================
   ANIMATED HERO ORBS — re-creating the poster's two big circles
   but alive: they breathe, drift, react to mouse
   ============================================================ */
function HeroOrbs({ mouseX, mouseY }) {
  const t = useRef(0);
  const [, force] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => {t.current += 0.006;force((n) => n + 1);raf = requestAnimationFrame(tick);};
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const phase = t.current;
  const sway = Math.sin(phase) * 18;
  const sway2 = Math.cos(phase * 0.8) * 12;
  const px = (mouseX - 0.5) * 30;
  const py = (mouseY - 0.5) * 20;

  return (
    <svg viewBox="0 0 1600 1100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} aria-hidden>
      {/* dark orb (left) — softened so text stays readable */}
      <g transform={`translate(${-180 + sway + px} ${160 + sway2 + py})`}>
        <path
          d="M965,924c-75,124 -198,233 -355,299c-338,142 -705,36 -821,-238c-115,-274 65,-612 402,-754c139,-58 284,-75 413,-55c-99,144 -132,310 -74,456c66,165 232,268 435,292Z"
          fill="#cfc7b3"
          opacity="0.55" />
        
      </g>
      {/* green orb (right) */}
      <g transform={`translate(${340 - sway - px * 0.6} ${160 - sway2 - py * 0.6})`}>
        <path
          d="M965,924c132,16 280,-3 424,-60c365,-145 573,-484 464,-757c-108,-273 -492,-377 -857,-232c-169,67 -305,176 -390,301c185,29 340,132 408,293c62,147 39,312 -49,455Z"
          fill="var(--green)"
          opacity="0.78" />
        
      </g>
      {/* small floating circles like in original */}
      <circle cx={1200 + sway * 2} cy={80 + sway2} r="55" fill="var(--green)" opacity="0.32" />
      <circle cx={150 - sway} cy={620 + sway2 * 1.5} r="42" fill="#cfc7b3" opacity="0.4" />
      <circle cx={1380 + sway2} cy={420 - sway} r="78" fill="#cfc7b3" opacity="0.28" />
    </svg>);

}

/* ============================================================
   HERO
   ============================================================ */
function Hero({ tweaks }) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [tagline, setTagline] = useState(0);
  const taglines = ["Reparasjon.", "Redesign.", "Håndarbeid.", "Kreativitet.", "Fellesskap."];

  useEffect(() => {
    const id = setInterval(() => setTagline((t) => (t + 1) % taglines.length), 1800);
    return () => clearInterval(id);
  }, []);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  };

  // countdown to opening: 29 May 2026, 17:00
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {const id = setInterval(() => setNow(new Date()), 1000);return () => clearInterval(id);}, []);
  const target = useMemo(() => new Date("2026-05-29T17:00:00+02:00"), []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff % 86400000 / 3600000);
  const mins = Math.floor(diff % 3600000 / 60000);
  const secs = Math.floor(diff % 60000 / 1000);

  return (
    <section className="hero" onMouseMove={onMove}>
      <HeroOrbs mouseX={mouse.x} mouseY={mouse.y} />

      <div className="hero-grid">
        <div className="hero-left">
          <div className="brand-stack">
            <div className="brand-row">CIRCULAR</div>
            <div className="brand-row">MAKER</div>
            <div className="brand-row">STUDIO</div>
          </div>
          <p className="hero-sub">
            Bærekraftig omstilling i praksis på{" "}
            <span className="addr">Sagene i Oslo</span>.
            2.hand, broderitjenester, kurs og samlinger.
          </p>
          <div className="hero-ctas">
            <a href="#schedule" className="btn btn-primary">Se kurs &amp; events</a>
            <a href="#services" className="btn btn-ghost">Tjenester →</a>
          </div>
        </div>

        <div className="hero-right">
          <div className="rotating-tag">
            <span className="tag-static">Vi driver med</span>
            <span className="tag-rotator">
              {taglines.map((t, i) =>
              <span key={t} className={"tag-word " + (i === tagline ? "is-active" : "")}>{t}</span>
              )}
            </span>
          </div>

          <div className="countdown" aria-label="Nedtelling til åpning">
            <div className="countdown-label">Åpning 29. mai • 17:00</div>
            <div className="countdown-grid">
              {[
              ["dager", days],
              ["timer", hours],
              ["min", mins],
              ["sek", secs]].
              map(([l, v]) =>
              <div className="cd-cell" key={l}>
                  <div className="cd-num">{String(v).padStart(2, "0")}</div>
                  <div className="cd-label">{l}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <NavStrip />
    </section>);

}

function NavStrip() {
  return (
    <div className="navstrip">
      <div className="nav-logo">
        <span className="nav-dot" /> CIRCULAR MAKER STUDIO
      </div>
      <nav className="nav-links">
        <a href="#schedule">Kurs &amp; events</a>
        <a href="#services">Tjenester</a>
        <a href="#klubben">Maker Klubben</a>
        <a href="#partners">Partnere</a>
        <a href="#visit">Besøk</a>
      </nav>
      <a href="#schedule" className="nav-cta">Påmelding</a>
    </div>);

}

/* ============================================================
   MARQUEE — values
   ============================================================ */
function Marquee() {
  const items = [
  "Reparasjon", "•", "Redesign", "•", "Håndarbeid", "•", "Kreativitet", "•", "Fellesskap",
  "•", "2.hand", "•", "Broderi", "•", "Materialbank", "•", "Reparasjonscafé"];

  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {[...items, ...items, ...items].map((it, i) =>
        <span key={i} className={it === "•" ? "m-dot" : "m-word"}>{it}</span>
        )}
      </div>
    </div>);

}

/* ============================================================
   STATS BAR (animated count up)
   ============================================================ */
function Counter({ to, duration = 1400 }) {
  const [v, setV] = useState(0);
  const ref = useRef();
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const step = (t) => {
            const p = Math.min(1, (t - t0) / duration);
            setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toLocaleString("nb-NO")}</span>;
}

function StatsBar() {
  return (
    <section className="stats">
      {STATS.map((s) =>
      <div key={s.label} className="stat">
          <div className="stat-n"><Counter to={s.n} /></div>
          <div className="stat-l">{s.label}</div>
        </div>
      )}
    </section>);

}

/* ============================================================
   SCHEDULE — interactive workshop list
   ============================================================ */
function Schedule() {
  const [filter, setFilter] = useState("Alle");
  const [hover, setHover] = useState(null);
  const [signed, setSigned] = useState({});
  const tags = ["Alle", "Kurs", "Drop-in", "Gratis", "Event"];
  const list = filter === "Alle" ? WORKSHOPS : WORKSHOPS.filter((w) => w.tag === filter);

  return (
    <section className="schedule" id="schedule">
      <header className="section-head">
        <div>
          <div className="eyebrow"><Dot /> Kurs &amp; events</div>
          <h2>Hva skjer</h2>
        </div>
        <div className="filter-pills">
          {tags.map((t) =>
          <button key={t} className={"pill " + (filter === t ? "is-on" : "")} onClick={() => setFilter(t)}>
              {t}
            </button>
          )}
        </div>
      </header>

      <ul className="ws-list">
        {list.map((w, i) => {
          const full = w.taken >= w.spots;
          const pct = Math.min(100, Math.round(w.taken / w.spots * 100));
          const isHover = hover === w.id;
          const isSigned = signed[w.id];
          return (
            <li
              key={w.id}
              className={"ws-row " + (isHover ? "is-hover" : "")}
              onMouseEnter={() => setHover(w.id)}
              onMouseLeave={() => setHover(null)}>
              
              <div className="ws-date">
                <div className="ws-date-day">{w.date.split(" ")[0]}</div>
                <div className="ws-date-mo">{w.date.split(" ")[1]}</div>
              </div>
              <div className="ws-time">{w.time}</div>
              <div className="ws-title">
                <div className="ws-tag-line"><Tag>{w.tag}</Tag></div>
                <div className="ws-h">{w.title}</div>
                <div className="ws-host">m/ {w.host}</div>
              </div>
              <div className="ws-spots">
                <div className="ws-spots-line">
                  <span className="ws-spots-n">{w.taken}/{w.spots}</span>
                  <span className="ws-spots-l">{full ? "fullt — venteliste" : "påmeldt"}</span>
                </div>
                <div className="ws-bar"><div className="ws-bar-fill" style={{ width: pct + "%" }} /></div>
              </div>
              <button
                className={"ws-cta " + (isSigned ? "is-signed" : "") + (full ? " is-full" : "")}
                onClick={() => setSigned((s) => ({ ...s, [w.id]: !s[w.id] }))}>
                
                {isSigned ? "✓ Påmeldt" : full ? "Venteliste" : "Meld på"}
              </button>
              <div className="ws-hover-img" aria-hidden>
                <img src={`images/${w.img}.${w.img === "p1" ? "jpg" : "png"}`} alt="" />
              </div>
            </li>);

        })}
      </ul>
    </section>);

}

/* ============================================================
   PICKER — "What did you bring in?"
   ============================================================ */
function Picker() {
  const [chosen, setChosen] = useState(null);
  const result = chosen ? PICKER_OPTIONS.find((o) => o.q === chosen) : null;
  const matched = result && result.to ? SERVICES.find((s) => s.id === result.to) : null;

  return (
    <section className="picker" id="picker">
      <div className="picker-grid">
        <div className="picker-left">
          <div className="eyebrow"><Dot color="#ff6161" /> Hjelp meg velge</div>
          <h2>Hva har du<br />med deg i dag?</h2>
          <p className="picker-sub">
            Klikk det som ligner mest. Vi viser deg hvilken tjeneste som passer — eller om det finnes et kurs der du kan lære å fikse det selv.
          </p>
        </div>
        <div className="picker-right">
          <div className="picker-options">
            {PICKER_OPTIONS.map((o) =>
            <button
              key={o.q}
              className={"picker-opt " + (chosen === o.q ? "is-on" : "")}
              onClick={() => setChosen(o.q)}>
              
                <span className="picker-icon">{o.icon}</span>
                <span className="picker-q">{o.q}</span>
              </button>
            )}
          </div>

          <div className={"picker-result " + (chosen ? "is-shown" : "")}>
            {matched &&
            <>
                <div className="pr-eyebrow">Vi anbefaler →</div>
                <div className="pr-title">{matched.title}</div>
                <div className="pr-desc">{matched.desc}</div>
                <div className="pr-meta">
                  <span>{matched.price}</span>
                  <a href="#services" className="btn btn-primary btn-sm">Bestill →</a>
                </div>
              </>
            }
            {result && result.workshop &&
            <>
                <div className="pr-eyebrow">Lær det selv →</div>
                <div className="pr-title">Kom på kurs</div>
                <div className="pr-desc">Vi har kurs hver uke der du lærer å reparere og sy om plagg selv. Ingen forkunnskaper.</div>
                <div className="pr-meta">
                  <span>fra 0 kr (drop-in)</span>
                  <a href="#schedule" className="btn btn-primary btn-sm">Se kurs →</a>
                </div>
              </>
            }
          </div>
        </div>
      </div>
    </section>);

}

/* ============================================================
   SERVICES GRID
   ============================================================ */
function Services() {
  const [open, setOpen] = useState(null);
  return (
    <section className="services" id="services">
      <header className="section-head">
        <div>
          <div className="eyebrow"><Dot /> Tjenester</div>
          <h2>Det vi gjør, hver dag</h2>
        </div>
        <p className="section-lede">Stikk innom på Maridalsveien 154 — eller bestill på forhånd.

        </p>
      </header>

      <div className="svc-grid">
        {SERVICES.map((s, i) =>
        <article
          key={s.id}
          className={"svc-card " + (open === s.id ? "is-open" : "")}
          onClick={() => setOpen(open === s.id ? null : s.id)}
          style={{ "--i": i }}>
          
            <div className="svc-img">
              <img src={`images/${s.img}.${s.img === "p1" ? "jpg" : "png"}`} alt="" />
            </div>
            <div className="svc-body">
              <div className="svc-head">
                <h3>{s.title}</h3>
                <span className="svc-price">{s.price}</span>
              </div>
              <p>{s.desc}</p>
              <div className="svc-foot">
                <span className="svc-cta">{open === s.id ? "Bestill nå →" : "Mer info"}</span>
                <span className="svc-arrow">↗</span>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>);

}

/* ============================================================
   MAKER KLUBBEN
   ============================================================ */
function Klubben() {
  const [tab, setTab] = useState("nights");

  const benefits = [
    { icon: "✦", t: "Gratis Maker Nights", d: "Alle torsdager kl. 16–20 — fri tilgang for medlemmer." },
    { icon: "%", t: "20 % rabatt på kurs", d: "Rabattkoden sendes sammen med faktura for medlemskapet og gjelder alle mini-kurs og workshops." },
    { icon: "◐", t: "Førvisninger", d: "Invitasjoner til medlemskvelder og spesielle arrangementer." },
    { icon: "↻", t: "Bruk verkstedet jevnlig", d: "Utvikle ferdighetene over tid i et fast fellesskap." },
  ];

  return (
    <section className="klubben" id="klubben">
      <div className="kl-bg" aria-hidden>
        <div className="kl-orb kl-orb-a" />
        <div className="kl-orb kl-orb-b" />
      </div>

      <div className="kl-inner">
        <div className="kl-head">
          <div className="eyebrow"><Dot color="var(--coral)" /> Circular Maker Club</div>
          <h2>Skap, reparer<br/>og jobb med egne<br/><em>prosjekter.</em></h2>
          <p className="kl-lede">
            Et åpent verksted og et kreativt fellesskap. Lån utstyr, få veiledning,
            og bli en del av miljøet — drop-in eller som medlem.
          </p>
        </div>

        <div className="kl-tabs" role="tablist">
          <button role="tab" className={"kl-tab " + (tab === "nights" ? "is-on" : "")} onClick={() => setTab("nights")}>
            <span className="kl-tab-n">01</span>
            <span className="kl-tab-l">Maker Nights</span>
            <span className="kl-tab-s">Drop-in · 350,–</span>
          </button>
          <button role="tab" className={"kl-tab " + (tab === "club" ? "is-on" : "")} onClick={() => setTab("club")}>
            <span className="kl-tab-n">02</span>
            <span className="kl-tab-l">Medlemskap</span>
            <span className="kl-tab-s">Fast tilgang &amp; rabatter</span>
          </button>
        </div>

        {tab === "nights" && (
          <div className="kl-panel">
            <div className="kl-panel-main">
              <h3>Drop-in Maker Nights</h3>
              <p>
                En åpen kveld der du jobber med dine egne sy- og redesign­prosjekter i verkstedet vårt.
                Reparer favoritt­plagget, test nye ideer, eller bare ta en kreativ pause i hverdagen —
                vi gir deg plass, utstyr og et inspirerende miljø.
              </p>
              <ul className="kl-list">
                <li><span className="kl-bullet">→</span> Tilgang til symaskiner og syutstyr</li>
                <li><span className="kl-bullet">→</span> Sosialt og kreativt arbeids­fellesskap</li>
                <li><span className="kl-bullet">→</span> Mulighet for veiledning på egne prosjekter</li>
              </ul>
            </div>
            <aside className="kl-meta">
              <div className="kl-meta-row"><span>Når</span><b>Torsdager 16:00–20:00</b></div>
              <div className="kl-meta-row"><span>Påmelding</span><b>Ingen — bare møt opp</b></div>
              <div className="kl-meta-row"><span>Pris</span><b>350,– per kveld</b></div>
              <div className="kl-meta-row"><span>Medlemmer</span><b style={{color:"var(--green)"}}>Gratis</b></div>
              <a href="#visit" className="btn btn-primary kl-btn">Stikk innom →</a>
            </aside>
          </div>
        )}

        {tab === "club" && (
          <div className="kl-panel">
            <div className="kl-panel-main">
              <h3>Bli medlem i Maker Klubben</h3>
              <p>
                For deg som vil bruke verkstedet jevnlig og utvikle ferdighetene dine
                over tid. Medlemskap gir både fri tilgang og rabatter — pluss invitasjoner
                til arrangementer som ikke er åpne for alle.
              </p>
              <div className="kl-benefits">
                {benefits.map(b => (
                  <div key={b.t} className="kl-benefit">
                    <span className="kl-benefit-icon">{b.icon}</span>
                    <div>
                      <div className="kl-benefit-t">{b.t}</div>
                      <div className="kl-benefit-d">{b.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <aside className="kl-meta">
              <div className="kl-meta-row"><span>Pris</span><b>350,– per måned</b></div>
              <div className="kl-meta-row"><span>Binding</span><b>Ingen — si opp når som helst</b></div>
              <div className="kl-meta-row"><span>For hvem</span><b>Faste brukere av verkstedet</b></div>
              <div className="kl-meta-row"><span>Innmelding</span><b>Via e-post</b></div>
              <a href="mailto:hei@circularmaker.no?subject=Maker%20Klubben" className="btn btn-primary kl-btn">Ta kontakt →</a>
              <div className="kl-meta-note">Fornyes månedlig. Rabattkode for kurs sendes sammen med faktura.</div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   PARTNERS / VISIT / FOOTER
   ============================================================ */
function Partners() {
  return (
    <section className="partners" id="partners">
      <div className="partners-inner">
        <div className="eyebrow"><Dot color="#fff" /> I sirkel med</div>
        <h2>Drevet av RELOVE & Re//Lab</h2>
        <p>
          Circular Maker Studio er et samarbeid mellom <a href="https://www.relove.info/" target="_blank" rel="noopener">Relove</a> og <a href="https://www.relab.no/" target="_blank" rel="noopener">Re//Lab</a> — to organisasjoner som jobber med å forlenge livet til klærne dine.
        </p>
        <div className="partner-logos">
          <div className="logo-card">
            <div className="logo-name">RELOVE</div>
            <div className="logo-tag">SOSIAL ENTERPRENØR</div>
          </div>
          <div className="logo-card">
            <div className="logo-name" style={{ fontFamily: "monospace", letterSpacing: 2 }}>RE//LAB</div>
            <div className="logo-tag">Tekstil-laboratorium</div>
          </div>
        </div>
      </div>
    </section>);

}

function Visit() {
  return (
    <section className="visit" id="visit">
      <div className="visit-grid">
        <div className="visit-left">
          <div className="eyebrow"><Dot /> Besøk oss</div>
          <h2>Maridalsveien 154</h2>
          <p>0461 Oslo </p>
          <dl className="hours">
            <div><dt>Man–Fre</dt><dd>10:00 — 16:00</dd></div>
            <div><dt>Lørdag</dt><dd>12:00 — 15:00</dd></div>
            <div><dt>Søndag</dt><dd>Stengt</dd></div>
          </dl>
          <div className="contact">
            <span>hei@circularmaker.no</span>
            <span>+47 22 00 00 00</span>
          </div>
        </div>
        <div className="visit-right">
          <div className="map-mock">
            <svg viewBox="0 0 600 500" width="100%" height="100%">
              <rect width="600" height="500" fill="#e9e6dd" />
              {/* roads */}
              <path d="M0 320 L600 280" stroke="#d4cfc1" strokeWidth="36" fill="none" />
              <path d="M180 0 L260 500" stroke="#d4cfc1" strokeWidth="28" fill="none" />
              <path d="M0 120 L600 100" stroke="#d4cfc1" strokeWidth="18" fill="none" />
              <path d="M450 0 L500 500" stroke="#d4cfc1" strokeWidth="14" fill="none" />
              {/* river */}
              <path d="M0 460 Q200 420 320 460 T 600 440" stroke="#bcd5cc" strokeWidth="22" fill="none" />
              {/* parks */}
              <circle cx="100" cy="200" r="60" fill="#cde0c5" />
              <rect x="380" y="180" width="120" height="80" fill="#cde0c5" />
              {/* pin */}
              <g transform="translate(232 305)">
                <circle r="44" fill="var(--green)" opacity="0.25" className="pin-pulse" />
                <circle r="22" fill="var(--green)" />
                <circle r="8" fill="#fff" />
              </g>
              <text x="270" y="312" fontFamily="ui-monospace, monospace" fontSize="13" fill="#2f2f2f">Maridalsv. 154</text>
            </svg>
          </div>
        </div>
      </div>
    </section>);

}

function Footer() {
  return (
    <footer className="foot">
      <div className="foot-row">
        <div className="foot-brand">
          <div className="foot-logo">CIRCULAR<br />MAKER<br />STUDIO</div>
          <div className="foot-circle"><span /><span /></div>
        </div>
        <div className="foot-cols">
          <div>
            <h4>Studio</h4>
            <a href="#services">Tjenester</a>
            <a href="#schedule">Kurs &amp; events</a>
            <a href="#visit">Besøk</a>
          </div>
          <div>
            <h4>Partnere</h4>
            <a href="https://www.relove.info/" target="_blank" rel="noopener">Relove</a>
            <a href="https://www.relab.no/" target="_blank" rel="noopener">Re//Lab</a>
          </div>
          <div>
            <h4>Følg</h4>
            <a href="#">Instagram</a>
            <a href="#">Nyhetsbrev</a>
          </div>
        </div>
      </div>
      <div className="foot-base">
        <span>© 2026 Circular Maker Studio</span>
        <span>Maridalsveien 154 · 0461 Oslo</span>
        <span></span>
      </div>
    </footer>);

}

/* ============================================================
   APP
   ============================================================ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#0da959",
  "coral": "#ff6161",
  "paper": "#f5f3ee",
  "fontMode": "Editorial",
  "denser": false
} /*EDITMODE-END*/;

function App() {
  const [t, setT] = useTweaks(TWEAK_DEFAULTS);

  // apply tweak vars
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--green", t.accent);
    r.style.setProperty("--coral", t.coral);
    r.style.setProperty("--paper", t.paper);
    r.style.setProperty("--font-display", t.fontMode === "Editorial" ?
    `"Fraunces", "Times New Roman", serif` :
    t.fontMode === "Grotesk" ?
    `"Space Grotesk", "Helvetica Neue", sans-serif` :
    `"Bebas Neue", Impact, sans-serif`);
    r.style.setProperty("--density", t.denser ? "0.85" : "1");
  }, [t]);

  return (
    <>
      <Hero tweaks={t} />
      <Marquee />
      <StatsBar />
      <Schedule />
      <Services />
      <Klubben />
      <Partners />
      <Visit />
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Palette">
          <TweakColor
            label="Accent"
            value={t.accent}
            options={["#0da959", "#1a3d2f", "#d97757", "#2b5fdb", "#111111"]}
            onChange={(v) => setT("accent", v)} />
          
          <TweakColor
            label="Coral / fun"
            value={t.coral}
            options={["#ff6161", "#ffb800", "#ff7ac6", "#9a6cff", "#0da959"]}
            onChange={(v) => setT("coral", v)} />
          
          <TweakColor
            label="Paper"
            value={t.paper}
            options={["#f5f3ee", "#f6efe2", "#ffffff", "#ecead8", "#1a1a18"]}
            onChange={(v) => setT("paper", v)} />
          
        </TweakSection>
        <TweakSection title="Type">
          <TweakRadio
            label="Display font"
            value={t.fontMode}
            options={["Editorial", "Grotesk", "Display"]}
            onChange={(v) => setT("fontMode", v)} />
          
          <TweakToggle label="Denser layout" value={t.denser} onChange={(v) => setT("denser", v)} />
        </TweakSection>
      </TweaksPanel>
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);