/* global React, ReactDOM */
const { useState } = React;

const COURSES = [
{ id: "symaskin", cat: "Nybegynner", title: "Symaskin-intro", desc: "Bli kjent med symaskinen! Lær å tre maskinen, sy rette sømmer og bli trygg på de viktigste funksjonene gjennom enkle øvelser.", img: "images/ws-symaskin.jpg" },
{ id: "hekle", cat: "Nybegynner", title: "Lær å hekle", sub: "nybegynnerkurs", desc: "Lær grunnleggende hekleteknikker og lag din første telefonveske eller pulsvarmere av restegarn.", img: "images/ws-hekling.jpg" },
{ id: "strikke", cat: "Nybegynner", title: "Lær å strikke", sub: "nybegynnerkurs", desc: "En introduksjon til strikking hvor du lærer opplegg, rette og vrange masker og lager et lite prosjekt.", img: "images/ws-strikking.jpg" },
{ id: "brodere", cat: "Nybegynner", title: "Lær å brodere", sub: "nybegynnerkurs", desc: "Start på din bunadsdrøm – lær grunnleggende broderiteknikker.", img: "images/jul-broderi.jpg" },
{ id: "handsom", cat: "Nybegynner", title: "Håndsøm", sub: "grunnkurs", desc: "Lær de viktigste håndsømteknikkene og oppdag hvordan du kan reparere, dekorere og sy enkle prosjekter uten symaskin.", img: "images/jul-handsom.jpg" },
{ id: "glidelas", cat: "Søm & reparasjon", title: "Lær å sy glidelås", desc: "Mestre glidelåssøm gjennom et praktisk prosjekt og lær en teknikk du kan bruke i vesker, mapper og klær.", img: "images/jul-glidelas.jpg" },
{ id: "jeans", cat: "Søm & reparasjon", title: "Jeans-reparasjon", desc: "Gi favorittjeansen nytt liv! Lær kreative og solide reparasjonsteknikker som forlenger levetiden og gjør reparasjonen til en del av designet.", img: "images/ws-jeans.jpg" },
{ id: "tote", cat: "Søm & reparasjon", title: "Sy tote-bag med franske sømmer", desc: "Lær en elegant og bærekraftig sømteknikk og sy en tote-bag med profesjonell finish og påsydd lomme.", img: "images/jul-totebag.jpg" },
{ id: "skjort", cat: "Søm & reparasjon", title: "Konstruer og sy sirkelskjørt", desc: "Lær å konstruere og sy et sirkelskjørt tilpasset dine mål. Du får innføring i mønsterberegning, tilpasning og enkle sømteknikker.", img: "images/jul-sirkelskjort.jpg" },
{ id: "nalefilting", cat: "Kunst & uttrykk", title: "Nålefilting", desc: "Lær grunnleggende teknikker innen nålefilting og form myk ull til dekorasjoner, figurer eller små kunstverk.", img: "images/jul-nalefilting.jpg" },
{ id: "kunsthekling", cat: "Kunst & uttrykk", title: "Kunsthekling", sub: "skap uten oppskrift", desc: "Bruk hekling som et kunstnerisk uttrykk! Eksperimenter med former, teksturer og farger og skap et unikt tekstilkunstverk.", img: "images/jul-kunsthekling.jpg" },
{ id: "trykk", cat: "Kunst & uttrykk", title: "Trykk med tetrapack", desc: "Lær dyptrykk med resirkulert Tetrapak og pastamaskin som trykkpresse. Lag egne trykk på papir eller tekstil.", img: "images/jul-trykk.jpg" },
{ id: "tekstil", cat: "Kunst & uttrykk", title: "Tekstilillustrasjon & håndsøm", desc: "Utforsk tekstilkunst gjennom broderi, applikasjon og dekorativ håndsøm. Design din egen kunstpatch av gjenbruksmaterialer.", img: "images/jul-tekstil.jpg" }];

const NEW_COURSES = [
{ title: "Sy quiltejakke", desc: "Sy din egen unike quiltejakke av nye eller gjenbrukte tekstiler. Et fordypningskurs over flere dager hvor du lærer mønstertilpasning, quilting og montering av et plagg med profesjonell finish." },
{ title: "Sy egen festdrakt", desc: "Drømmer du om å sy din egen festdrakt? På dette fordypningskurset over flere dager lærer du konstruksjon, tilpasning og sømteknikker som hjelper deg å skape en personlig festdrakt." },
{ title: "Overlock-intro", desc: "Er du nysgjerrig på overlockmaskinen? Lær hvordan du trer maskinen, justerer innstillinger og syr pene, elastiske og profesjonelle sømmer. Et praktisk introduksjonskurs som gir deg trygghet til å bruke overlock i egne syprosjekter." }];

const CATS = ["Alle", "Nybegynner", "Søm & reparasjon", "Kunst & uttrykk"];
const GROUP_MAIL = "mailto:kontakt@relove.info?subject=Gruppebestilling%20%E2%80%93%20kurs%20eller%20Sip%20%26%20Sew";

function KDot({ color = "var(--green)" }) {
  return <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: color }}></span>;
}

function KursNav() {
  return (
    <div className="k-nav">
      <a href="Home.html" className="nav-logo"><span className="nav-dot"></span> CIRCULAR MAKER STUDIO</a>
      <nav className="nav-links">
        <a href="Home.html#schedule">Kalender</a>
        <a href="#kurs">Kurs</a>
        <a href="#sipsew">Sip &amp; Sew</a>
        <a href="#kursrekke">Kursrekke</a>
        <a href="#grupper">Grupper</a>
        <a href="Home.html#visit">Besøk</a>
      </nav>
    </div>);
}

function CourseCard({ c }) {
  return (
    <article className="k-card">
      <div className="k-card-img"><img src={c.img} alt="" /></div>
      <div className="k-card-body">
        <div className="k-card-cat">{c.cat}</div>
        <h3>{c.title}</h3>
        {c.sub && <div className="k-card-sub">{c.sub}</div>}
        <p>{c.desc}</p>
        <a className="k-card-link" href="Home.html#schedule">Se datoer i kalenderen →</a>
      </div>
    </article>);
}

function KursPage() {
  const [cat, setCat] = useState("Alle");
  const list = cat === "Alle" ? COURSES : COURSES.filter((c) => c.cat === cat);
  return (
    <>
      <header className="k-hero">
        <KursNav />
        <div className="k-hero-inner">
          <div className="eyebrow"><KDot /> Kursmeny</div>
          <h1 className="k-title">Kurs<br /><em>oversikt</em></h1>
          <p className="k-lede">Små kurs i håndarbeid, søm, reparasjon og tekstilkunst.</p>
          <div className="hero-ctas">
            <a href="Home.html#schedule" className="btn btn-primary">Se kalenderen</a>
            <a href="#grupper" className="btn btn-ghost">Bestill for gruppe →</a>
          </div>
        </div>
      </header>

      <section className="k-section" id="kurs">
        <header className="section-head">
          <div>
            <div className="eyebrow"><KDot /> {COURSES.length} kurs</div>
            <h2>Velg ditt kurs</h2>
          </div>
          <div className="filter-pills">
            {CATS.map((t) =>
            <button key={t} className={"pill " + (cat === t ? "is-on" : "")} onClick={() => setCat(t)}>{t}</button>
            )}
          </div>
        </header>
        <div className="k-grid">
          {list.map((c) => <CourseCard key={c.id} c={c} />)}
        </div>
      </section>

      <section className="k-sip" id="sipsew">
        <div className="k-sip-grid">
          <div className="k-sip-img"><img src="images/jul-sipsew.jpg" alt="" /></div>
          <div className="k-sip-text">
            <div className="eyebrow"><KDot color="var(--coral)" /> Vennedating</div>
            <h2>Sip &amp; Sew</h2>
            <p className="k-sip-lede">En kreativ kveld for deg som vil møte nye mennesker, teste nye teknikker og skape noe sammen.</p>
            <p>Er du glad i håndarbeid, nysgjerrig på nye materialer eller bare lyst på en annerledes fredagskveld? Bli med på Sip &amp; Sew en sosial og leken kreativ kveld hos RELOVE.</p>
            <p>Du kan komme alene eller sammen med venner. Her handler det ikke om å være flink, men om å utforske, prøve og ha det gøy sammen. I løpet av 3 timer får du teste ulike tekstilteknikker, materialer og kreative uttrykk. Vi serverer kaffe og kjeks, og du kan ta med egen drikke om du ønsker noe annet.</p>
            <p>Det unike med Sip &amp; Sew er at vi lager sammen. Du starter med ditt eget prosjekt, men underveis får verkene “vandre” mellom deltakerne. Alle bidrar med små detaljer og ideer til hverandres arbeid som gjør at kreativiteten får flyte uten prestasjonspress. Resultatet blir et helt unikt tekstilkunstverk skapt av flere hender.</p>
          </div>
        </div>
      </section>

      <section className="k-series" id="kursrekke">
        <div className="k-series-inner">
          <div className="k-series-text">
            <div className="eyebrow"><KDot /> Kursrekke · 4 × 3 timer</div>
            <h2>Søm &amp; redesign for voksne</h2>
            <p className="k-series-lede">Har du lyst til å lære mer om søm og redesign, men er usikker på hvor du skal begynne? Dette kurset gir deg en trygg og praktisk introduksjon til søm, reparasjon og redesign – slik at du kan lage, tilpasse og reparere klær og samtidig bygge en mer bærekraftig garderobe.</p>
            <p>Kurset er for voksne fra 18 år og bygger på erfaringene fra våre populære kurs for barn og unge. Her har vi fokus på mestring, fordypning og praktiske ferdigheter du kan bruke i hverdagen.</p>
          </div>
          <div className="k-series-side">
            <h3>Dette lærer du</h3>
            <p>Vi tilpasser kurset etter dine ønsker og interesser. Du kan blant annet:</p>
            <ul className="k-series-list">
              <li>redesigne eller sy om eksisterende klær</li>
              <li>reparere og tilpasse plagg</li>
              <li>lære grunnleggende sømteknikker</li>
              <li>sy noe helt fra bunnen av</li>
            </ul>
            <p className="k-series-note">Du trenger ikke ha et bestemt prosjekt klart på forhånd – vi finner ut sammen hva du har lyst til å lage.</p>
            <div className="k-series-price">
              <div><div className="k-price-n">3500,–</div><div className="k-price-s">per deltaker · 4 ganger à 3 timer · min. 5 deltakere</div></div>
              <a href="mailto:kontakt@relove.info?subject=Bestilling%20%E2%80%93%20kursrekke%20s%C3%B8m%20og%20redesign" className="btn btn-primary">Bestill kursrekke →</a>
            </div>
          </div>
        </div>
      </section>

      <section className="k-group" id="grupper">
        <div className="k-group-inner">
          <div className="eyebrow k-group-eyebrow"><KDot color="#fff" /> For grupper</div>
          <h2>Bestill et kurs eller en Sip &amp; Sew-kveld for gruppen deres</h2>
          <div className="k-group-grid">
            <p className="k-group-lede">Vennegjengen, jobben, bursdagen eller utdrikningslaget? Velg et kurs fra kursmenyen eller en Sip &amp; Sew-kveld, så finner vi en tid som passer for dere.</p>
            <ol className="k-steps">
              <li><span>01</span><div><b>Velg aktivitet</b>Et kurs fra menyen, en kursrekke eller en Sip &amp; Sew-kveld.</div></li>
              <li><span>02</span><div><b>Send oss en e-post</b>Fortell hvor mange dere er og hvilke dager som passer.</div></li>
              <li><span>03</span><div><b>Vi finner tiden</b>Vi foreslår et tidspunkt og sender et tilbud.</div></li>
            </ol>
          </div>
          <div className="k-prices">
            <div className="k-price"><div className="k-price-l">Kurs · 2 timer</div><div className="k-price-n">750,–</div><div className="k-price-s">per deltaker · min. 4 deltakere</div></div>
            <div className="k-price"><div className="k-price-l">Kurs · 3 timer</div><div className="k-price-n">940,–</div><div className="k-price-s">per deltaker · min. 4 deltakere</div></div>
            <div className="k-price"><div className="k-price-l">Sip &amp; Sew · 3 timer</div><div className="k-price-n">750,–</div><div className="k-price-s">per deltaker · min. 6 deltakere</div></div>
            <div className="k-price"><div className="k-price-l">Kursrekke · 4 × 3 timer</div><div className="k-price-n">3500,–</div><div className="k-price-s">per deltaker · min. 5 deltakere</div></div>
            <div className="k-price k-price-place"><div className="k-price-l">Sted</div><div className="k-price-place-n">Circular Maker Studio, Sagene<br />eller Nordstrand Kulturarena, Ekebergveien 243</div></div>
          </div>
          <p className="k-price-note">Prisene er orienterende.</p>
          <div className="k-group-ctas">
            <a href={GROUP_MAIL} className="btn k-btn-light">Send forespørsel →</a>
            <span className="k-group-contact">kontakt@relove.info · <a href="tel:+4798442960">+47 984 42 960</a></span>
          </div>
        </div>
      </section>

      <section className="k-section k-new">
        <header className="section-head">
          <div>
            <div className="eyebrow"><KDot color="var(--coral)" /> Kommer snart</div>
            <h2>Nye kurs</h2>
          </div>
        </header>
        <div className="k-new-grid">
          {NEW_COURSES.map((c, i) =>
          <article key={c.title} className="k-new-card">
              <div className="k-new-n">{String(i + 1).padStart(2, "0")}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </article>
          )}
        </div>
      </section>

      <footer className="foot k-foot">
        <div className="foot-base">
          <span>© 2026 Circular Maker Studio</span>
          <a href="Home.html">← Til forsiden</a>
          <span>kontakt@relove.info</span>
        </div>
      </footer>
    </>);
}

ReactDOM.createRoot(document.getElementById("root")).render(<KursPage />);
