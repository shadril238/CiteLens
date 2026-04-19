const { useState, useEffect, useRef, useMemo } = React;

/* Icons */
const Icon = {
  Arrow: () => <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Sparkle: () => <svg viewBox="0 0 16 16" fill="none"><path d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M12 4l-2 2M6 10l-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  Chevron: ({open}) => <svg viewBox="0 0 16 16" fill="none" style={{transform:`rotate(${open?180:0}deg)`, transition:'transform .2s ease'}}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Reset: () => <svg viewBox="0 0 16 16" fill="none"><path d="M3 8a5 5 0 1 0 1.5-3.5M3 3v2h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  External: () => <svg viewBox="0 0 16 16" fill="none"><path d="M6 3H3v10h10v-3M9 3h4v4M13 3L7 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Sort: () => <svg viewBox="0 0 16 16" fill="none"><path d="M4 4h10M5 8h8M7 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  Search: () => <svg viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/><path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
};

function LogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{display:'block'}}>
      <rect x="1" y="1" width="22" height="22" rx="7" fill="var(--ink)"/>
      <circle cx="10" cy="12" r="5" stroke="var(--bg)" strokeWidth="1.8" fill="none"/>
      <circle cx="10" cy="12" r="1.5" fill="var(--bg)"/>
      <path d="M14 16l4 4" stroke="var(--bg)" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function Navbar() {
  return (
    <nav className="nav">
      <div className="logo">
        <LogoMark/>
        <span>CiteLens</span>
      </div>
      <div className="nav-right">
        <a href="#" className="nav-link">Methodology</a>
        <a href="#" className="nav-link">Docs</a>
        <a href="#" className="nav-link">Changelog</a>
        <button className="nav-cmd">
          <Icon.Search/>
          <span>Search</span>
          <span className="kbd">⌘K</span>
        </button>
      </div>
    </nav>
  );
}

const MODES = [
  { id: 'influential', label: 'Most Influential' },
  { id: 'relevant', label: 'Most Relevant' },
  { id: 'recent', label: 'Recent' },
  { id: 'reviews', label: 'Reviews' },
];

function Hero({ onAnalyze, mode, setMode, query, setQuery }) {
  const ref = useRef(null);
  const example = (t) => { setQuery(t); ref.current?.focus(); };
  return (
    <section className="hero">
      <div className="hero-eyebrow">
        <span className="pill">NEW</span>
        <span>Impact + network scoring, now with citation context</span>
      </div>
      <h1>Find the follow-up papers<br/>that <em>matter most.</em></h1>
      <p>Paste a paper — URL, DOI, or title — and CiteLens surfaces the citing work that's actually worth reading next.</p>

      <div className="input-wrap">
        <textarea
          ref={ref} rows={2}
          placeholder="Paste an arXiv link, DOI, Semantic Scholar URL, or a paper title…"
          value={query} onChange={e => setQuery(e.target.value)}
        />
        <div className="input-bar">
          <div className="mode-toggle">
            {MODES.map(m => (
              <button key={m.id} className={mode === m.id ? 'active' : ''} onClick={() => setMode(m.id)}>{m.label}</button>
            ))}
          </div>
          <button className={`submit-btn ${query.trim() ? '' : 'disabled'}`} onClick={() => query.trim() && onAnalyze()}>
            <span>Find citing papers</span>
            <span className="kbd">↵</span>
          </button>
        </div>
      </div>

      <div className="chips">
        <button className="chip arxiv" onClick={() => example('https://arxiv.org/abs/1706.03762')}><span className="dot"/>arXiv:1706.03762</button>
        <button className="chip doi" onClick={() => example('10.48550/arXiv.1706.03762')}><span className="dot"/>DOI</button>
        <button className="chip ss" onClick={() => example('https://www.semanticscholar.org/paper/...')}><span className="dot"/>Semantic Scholar</button>
        <button className="chip title" onClick={() => example('Attention Is All You Need')}><span className="dot"/>Paper title</button>
      </div>
    </section>
  );
}

function SeedCard() {
  const s = window.SEED_PAPER;
  return (
    <div className="seed fade-in">
      <div>
        <div className="seed-eyebrow"><span className="dot"/>Seed paper</div>
        <h2>{s.title}</h2>
        <div className="seed-meta">
          <span>{s.authors}</span>
          <span className="sep"/>
          <span>{s.venue} · {s.year}</span>
          <span className="sep"/>
          <span>{s.citations} citations</span>
        </div>
        <p className="seed-abstract">{s.abstract}</p>
        <div className="seed-sources">
          {s.sources.map(src => <span key={src} className="source-badge">{src}</span>)}
        </div>
      </div>
      <div className="seed-stat">
        <div className="seed-stat-num">{s.citingCount}</div>
        <div className="seed-stat-label">citing papers indexed</div>
        <div className="seed-stat-recipe">
          <span className="pill">impact</span>
          <span className="pill">network</span>
          <span className="pill">relevance</span>
          <span className="pill">context</span>
        </div>
        <div className="seed-stat-sub">Each paper scored on four signals and ranked by their weighted blend.</div>
      </div>
    </div>
  );
}

function Filters({ filters, setFilters }) {
  const reset = () => setFilters({ yearStart: 2018, yearEnd: 2024, relevance: 0.5, influential: false, reviews: false });
  const pct = Math.round(filters.relevance * 100);
  return (
    <aside className="filters">
      <div className="filter-group">
        <h4>Year range</h4>
        <div className="range-bar">
          <div className="fill" style={{
            left: `${((filters.yearStart - 2017) / 7) * 100}%`,
            right: `${100 - ((filters.yearEnd - 2017) / 7) * 100}%`
          }}/>
          <div className="handle" style={{ left: `${((filters.yearStart - 2017) / 7) * 100}%` }}/>
          <div className="handle" style={{ left: `${((filters.yearEnd - 2017) / 7) * 100}%` }}/>
        </div>
        <div className="range-values"><span>{filters.yearStart}</span><span>{filters.yearEnd}</span></div>
      </div>

      <div className="filter-group">
        <h4>Relevance threshold</h4>
        <div className="relevance-bar" style={{ '--p': `${pct}%` }}>
          <div className="fill"/><div className="handle"/>
        </div>
        <div className="range-values" style={{marginTop:8}}>
          <span>loose</span><span>{pct}%</span><span>strict</span>
        </div>
      </div>

      <div className="filter-group">
        <h4>Signals</h4>
        <button className="toggle-row" onClick={() => setFilters({...filters, influential: !filters.influential})}>
          <span>Highly influential only</span>
          <span className={`switch ${filters.influential ? 'on' : ''}`}/>
        </button>
        <button className="toggle-row" onClick={() => setFilters({...filters, reviews: !filters.reviews})}>
          <span>Review papers only</span>
          <span className={`switch ${filters.reviews ? 'on' : ''}`}/>
        </button>
      </div>

      <div className="filter-group">
        <button className="reset-btn" onClick={reset}><Icon.Reset/> Reset filters</button>
      </div>
    </aside>
  );
}

/* FOCUS layout card */
function PaperFocus({ paper, idx, expanded, onToggle }) {
  const weights = { impact: 0.3, network: 0.3, relevance: 0.25, context: 0.15 };
  return (
    <article className={`paper ${expanded ? 'selected' : ''}`}>
      <div className="paper-grid">
        <div>
          <div className="paper-head">
            <span className="paper-rank">#{String(idx + 1).padStart(2, '0')}</span>
            <div className="paper-badges">
              {paper.badges.includes('High Impact') && <span className="badge impact"><span className="dot"/>High impact</span>}
              {paper.badges.includes('Highly Influential') && <span className="badge influential"><span className="dot"/>Highly influential</span>}
              {paper.review && <span className="badge review"><span className="dot"/>Review paper</span>}
            </div>
          </div>
          <h3 className="paper-title"><a href="#">{paper.title}</a></h3>
          <div className="paper-meta">
            <span>{paper.authors}</span>
            <span className="sep"/>
            <span className="venue">{paper.venue}</span>
            <span className="sep"/>
            <span>{paper.year}</span>
            <span className="sep"/>
            <span className="cite-count">{paper.citations} citations</span>
          </div>
          <p className="why">{paper.why}</p>
          <div className="paper-actions">
            <a href="#" className="ghost-btn primary">Open paper <Icon.External/></a>
            <button className={`ghost-btn ${expanded ? 'active' : ''}`} onClick={onToggle}>
              Why ranked here <Icon.Chevron open={expanded}/>
            </button>
          </div>
        </div>

        <div className="score-tile">
          <div>
            <div className="score-headline">
              <span className="num">{paper.final}</span>
              <span className="denom">/100</span>
            </div>
            <div className="score-label">CiteLens score</div>
          </div>
          <div className="recipe">
            <RecipeRow cls="impact" label="Impact" val={paper.impact}/>
            <RecipeRow cls="network" label="Network" val={paper.network}/>
            <RecipeRow cls="relevance" label="Relevance" val={paper.relevance}/>
            <RecipeRow cls="context" label="Context" val={paper.context}/>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="explain">
          <div className="formula">
            <span className="term impact"><span className="dot"/>Impact × 30%</span>
            <span className="op">+</span>
            <span className="term network"><span className="dot"/>Network × 30%</span>
            <span className="op">+</span>
            <span className="term relevance"><span className="dot"/>Relevance × 25%</span>
            <span className="op">+</span>
            <span className="term context"><span className="dot"/>Context × 15%</span>
            <span className="op">=</span>
            <span className="result">{paper.final}/100</span>
          </div>
          <div className="explain-grid">
            <Metric cls="impact" name="Impact" val={paper.impact} text={paper.breakdown.impact}/>
            <Metric cls="network" name="Network influence" val={paper.network} text={paper.breakdown.network}/>
            <Metric cls="relevance" name="Relevance" val={paper.relevance} text={paper.breakdown.relevance}/>
            <Metric cls="context" name="Citation context" val={paper.context} text={paper.breakdown.context}/>
          </div>
        </div>
      )}
    </article>
  );
}

function RecipeRow({ cls, label, val }) {
  return (
    <div className={`recipe-row ${cls}`}>
      <span className="lbl"><span className="dot"/>{label}</span>
      <span className="bar"><span className="fill" style={{width: `${val}%`}}/></span>
      <span className="val">{val}</span>
    </div>
  );
}

function Metric({ cls, name, val, text }) {
  return (
    <div className={`metric ${cls}`}>
      <h5><span className="lbl"><span className="dot"/>{name}</span><span className="val">{val}/100</span></h5>
      <div className="micro-bar"><div className="fill" style={{width:`${val}%`}}/></div>
      <p>{text}</p>
    </div>
  );
}

/* STREAM layout — dense list */
function StreamList({ papers, onRowClick, selectedId }) {
  return (
    <div className="stream-list">
      <div className="stream-row head">
        <span>#</span>
        <span>Paper</span>
        <span>Signals</span>
        <span style={{textAlign:'right'}}>Score</span>
        <span style={{textAlign:'right'}}>Year</span>
      </div>
      {papers.map((p, i) => (
        <div key={p.id} className="stream-row" style={selectedId === p.id ? {background:'var(--bg-2)'} : null}
             onClick={() => onRowClick?.(p)}>
          <span className="rank">{String(i + 1).padStart(2, '0')}</span>
          <div style={{minWidth:0}}>
            <div className="title" style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{p.title}</div>
            <div className="sub" style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
              {p.authors} · {p.venue} · {p.citations} citations
            </div>
          </div>
          <div className="signals">
            <div className="seg impact"><div className="fill" style={{width:`${p.impact}%`}}/></div>
            <div className="seg network"><div className="fill" style={{width:`${p.network}%`}}/></div>
            <div className="seg relevance"><div className="fill" style={{width:`${p.relevance}%`}}/></div>
            <div className="seg context"><div className="fill" style={{width:`${p.context}%`}}/></div>
          </div>
          <span className="score">{p.final}</span>
          <span className="year">{p.year}</span>
        </div>
      ))}
    </div>
  );
}

/* SPLIT layout */
function SplitList({ papers, selected, setSelected }) {
  return (
    <div className="split-list">
      {papers.map((p, i) => (
        <button key={p.id}
          className={`split-item ${selected?.id === p.id ? 'selected' : ''}`}
          onClick={() => setSelected(p)}>
          <span className="sr">#{String(i + 1).padStart(2, '0')}</span>
          <div style={{minWidth:0, textAlign:'left'}}>
            <div className="ti">{p.title}</div>
            <div className="mt">
              <span>{p.venue} · {p.year}</span>
              {p.badges.includes('Highly Influential') && <span className="badge influential" style={{padding:'0 6px', fontSize:10}}><span className="dot"/>Influential</span>}
              {p.review && <span className="badge review" style={{padding:'0 6px', fontSize:10}}><span className="dot"/>Review</span>}
            </div>
          </div>
          <span className="sc">{p.final}</span>
        </button>
      ))}
    </div>
  );
}

function SplitPreview({ paper }) {
  if (!paper) {
    return <div className="split-preview" style={{color:'var(--ink-3)', textAlign:'center', padding:'80px 32px'}}>
      <div style={{fontFamily:'var(--font-serif)', fontSize:24, color:'var(--ink-2)', marginBottom:8}}>Select a paper</div>
      <p style={{margin:0, fontSize:13}}>The details, score breakdown, and reasoning will appear here.</p>
    </div>;
  }
  return (
    <div className="split-preview fade-in" key={paper.id}>
      <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:6}}>
        {paper.badges.includes('High Impact') && <span className="badge impact"><span className="dot"/>High impact</span>}
        {paper.badges.includes('Highly Influential') && <span className="badge influential"><span className="dot"/>Highly influential</span>}
        {paper.review && <span className="badge review"><span className="dot"/>Review paper</span>}
      </div>
      <h3>{paper.title}</h3>
      <div style={{color:'var(--ink-3)', fontSize:12.5, marginBottom:2}}>{paper.authors}</div>
      <div style={{color:'var(--ink-2)', fontSize:12.5}}>{paper.venue} · {paper.year} · {paper.citations} citations</div>

      <div className="big-score">
        <span className="num">{paper.final}</span>
        <span className="denom">/100</span>
        <div className="labeled">
          <div className="k">CiteLens score</div>
          <div className="v">Rank high</div>
        </div>
      </div>

      <p className="why" style={{margin:'0 0 18px'}}>{paper.why}</p>

      <div style={{display:'flex', flexDirection:'column', gap:10}}>
        <Metric cls="impact" name="Impact" val={paper.impact} text={paper.breakdown.impact}/>
        <Metric cls="network" name="Network" val={paper.network} text={paper.breakdown.network}/>
        <Metric cls="relevance" name="Relevance" val={paper.relevance} text={paper.breakdown.relevance}/>
        <Metric cls="context" name="Context" val={paper.context} text={paper.breakdown.context}/>
      </div>

      <div style={{display:'flex', gap:6, marginTop:18}}>
        <a href="#" className="ghost-btn primary" style={{flex:1, justifyContent:'center'}}>Open paper <Icon.External/></a>
        <button className="ghost-btn">Save</button>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="paper-list fade-in">
      {[0,1,2].map(i => (
        <div className="skel-paper" key={i}>
          <div>
            <div className="skeleton" style={{height:14, width:'65%', marginBottom:14}}/>
            <div className="skeleton" style={{height:11, width:'40%', marginBottom:18}}/>
            <div className="skeleton" style={{height:40, width:'100%', marginBottom:14, borderRadius:10}}/>
            <div className="skeleton" style={{height:10, width:'30%'}}/>
          </div>
          <div style={{borderLeft:'1px solid var(--line)', paddingLeft:24, display:'flex', flexDirection:'column', gap:12}}>
            <div className="skeleton" style={{height:36, width:80, borderRadius:6}}/>
            {[0,1,2,3].map(j => <div key={j} className="skeleton" style={{height:6, width:'100%'}}/>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function Timeline() {
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const highlights = window.TIMELINE_HIGHLIGHTS;
  const posFor = (y) => ((y - 2018) / 6) * 100;
  return (
    <div className="timeline-wrap fade-in">
      <div className="timeline-head">
        <h3>The citation arc</h3>
        <p>How the seed paper's influence expanded over time.</p>
      </div>
      <div className="timeline">
        <div className="timeline-axis"/>
        <div className="timeline-points">
          {highlights.map((h, i) => (
            <div key={i} className={`tl-point ${i % 2 === 0 ? 'top' : 'bottom'}`} style={{ left: `${posFor(h.year)}%` }}>
              {i % 2 === 0 ? (<>
                <div className="tl-card">
                  <div className="lbl">{h.label}</div>
                  <div className="note">{h.note}</div>
                </div>
                <div className="tl-line"/>
                <div className="tl-dot"/>
              </>) : (<>
                <div className="tl-dot"/>
                <div className="tl-line"/>
                <div className="tl-card">
                  <div className="lbl">{h.label}</div>
                  <div className="note">{h.note}</div>
                </div>
              </>)}
            </div>
          ))}
        </div>
        <div className="timeline-years">{years.map(y => <span key={y}>{y}</span>)}</div>
      </div>
    </div>
  );
}

/* Tweaks */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "indigo",
  "layout": "focus",
  "theme": "light",
  "density": "cozy",
  "viewport": "desktop",
  "tone": "emphasized"
}/*EDITMODE-END*/;

const ACCENTS = {
  indigo:   { a: 'oklch(52% 0.18 275)', w: 'oklch(95.5% 0.03 275)', i: 'oklch(40% 0.16 275)', l: 'oklch(88% 0.06 275)',
              ad:'oklch(72% 0.16 275)', wd: 'oklch(28% 0.08 275)',  id: 'oklch(85% 0.12 275)', ld: 'oklch(40% 0.1 275)'},
  teal:     { a: 'oklch(55% 0.12 195)', w: 'oklch(94% 0.03 195)',  i: 'oklch(38% 0.1 195)',  l: 'oklch(86% 0.05 195)',
              ad:'oklch(72% 0.12 195)', wd: 'oklch(28% 0.06 195)',  id: 'oklch(84% 0.1 195)', ld: 'oklch(40% 0.08 195)'},
  plum:     { a: 'oklch(50% 0.16 330)', w: 'oklch(95% 0.03 330)',  i: 'oklch(36% 0.14 330)', l: 'oklch(86% 0.06 330)',
              ad:'oklch(70% 0.15 330)', wd: 'oklch(28% 0.07 330)',  id: 'oklch(85% 0.12 330)', ld: 'oklch(40% 0.1 330)'},
  forest:   { a: 'oklch(50% 0.1 155)',  w: 'oklch(94% 0.025 155)', i: 'oklch(34% 0.09 155)', l: 'oklch(85% 0.04 155)',
              ad:'oklch(70% 0.1 155)',  wd: 'oklch(28% 0.05 155)',  id: 'oklch(84% 0.09 155)', ld: 'oklch(40% 0.08 155)'},
  graphite: { a: 'oklch(30% 0.01 270)', w: 'oklch(94% 0.004 270)', i: 'oklch(22% 0.01 270)', l: 'oklch(86% 0.008 270)',
              ad:'oklch(82% 0.008 270)',wd: 'oklch(30% 0.01 270)',  id: 'oklch(92% 0.006 270)', ld: 'oklch(45% 0.01 270)'},
};

function TweaksPanel({ tweaks, setTweaks, visible }) {
  useEffect(() => {
    const a = ACCENTS[tweaks.accent];
    const dark = tweaks.theme === 'dark';
    document.documentElement.style.setProperty('--accent', dark ? a.ad : a.a);
    document.documentElement.style.setProperty('--accent-weak', dark ? a.wd : a.w);
    document.documentElement.style.setProperty('--accent-ink', dark ? a.id : a.i);
    document.documentElement.style.setProperty('--accent-line', dark ? a.ld : a.l);
    document.body.classList.toggle('dark', dark);
    document.body.classList.toggle('density-compact', tweaks.density === 'compact');
    document.body.classList.toggle('tone-plain', tweaks.tone === 'plain');
    document.body.classList.toggle('viewport-mobile', tweaks.viewport === 'mobile');
  }, [tweaks]);

  if (!visible) return null;

  const update = (patch) => {
    const next = { ...tweaks, ...patch };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };

  return (
    <div className="tweaks-panel">
      <h5>Tweaks <span style={{fontFamily:'var(--font-mono)', fontSize:10, color:'var(--ink-4)', letterSpacing:0}}>v2</span></h5>

      <div className="tweak-row">
        <label>Layout</label>
        <div className="tweak-seg">
          {['focus', 'split', 'stream'].map(l => (
            <button key={l} className={tweaks.layout === l ? 'active' : ''} onClick={() => update({layout: l})}>{l}</button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <label>Theme</label>
        <div className="tweak-seg">
          {['light', 'dark'].map(t => (
            <button key={t} className={tweaks.theme === t ? 'active' : ''} onClick={() => update({theme: t})}>{t}</button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <label>Viewport</label>
        <div className="tweak-seg">
          {['desktop', 'mobile'].map(v => (
            <button key={v} className={tweaks.viewport === v ? 'active' : ''} onClick={() => update({viewport: v})}>{v}</button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <label>Accent</label>
        <div className="swatches">
          {Object.entries(ACCENTS).map(([k, v]) => (
            <button key={k}
              className={`swatch ${tweaks.accent === k ? 'active' : ''}`}
              style={{ background: tweaks.theme === 'dark' ? v.ad : v.a }}
              onClick={() => update({accent: k})} aria-label={k}/>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <label>Density</label>
        <div className="tweak-seg">
          {['cozy', 'compact'].map(d => (
            <button key={d} className={tweaks.density === d ? 'active' : ''} onClick={() => update({density: d})}>{d}</button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <label>Reasoning tone</label>
        <div className="tweak-seg">
          <button className={tweaks.tone === 'emphasized' ? 'active' : ''} onClick={() => update({tone: 'emphasized'})}>Accented</button>
          <button className={tweaks.tone === 'plain' ? 'active' : ''} onClick={() => update({tone: 'plain'})}>Plain</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [stage, setStage] = useState('idle');
  const [mode, setMode] = useState('influential');
  const [query, setQuery] = useState('Attention Is All You Need');
  const [tab, setTab] = useState('results');
  const [expanded, setExpanded] = useState(1);
  const [splitSelected, setSplitSelected] = useState(null);
  const [filters, setFilters] = useState({ yearStart: 2018, yearEnd: 2024, relevance: 0.5, influential: false, reviews: false });
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [tweaksVisible, setTweaksVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksVisible(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksVisible(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const analyze = () => { setStage('loading'); setTimeout(() => setStage('results'), 1100); };

  const papers = useMemo(() => {
    let list = [...window.CITING_PAPERS];
    if (filters.influential) list = list.filter(p => p.badges.includes('Highly Influential'));
    if (filters.reviews) list = list.filter(p => p.review);
    list = list.filter(p => p.relevance / 100 >= filters.relevance);
    list = list.filter(p => p.year >= filters.yearStart && p.year <= filters.yearEnd);
    if (mode === 'influential') list.sort((a, b) => b.network + b.impact - a.network - a.impact);
    else if (mode === 'relevant') list.sort((a, b) => b.relevance - a.relevance);
    else if (mode === 'recent') list.sort((a, b) => b.year - a.year);
    else if (mode === 'reviews') list.sort((a, b) => (b.review ? 1 : 0) - (a.review ? 1 : 0) || b.final - a.final);
    return list;
  }, [filters, mode, stage]);

  useEffect(() => {
    if (tweaks.layout === 'split' && papers[0] && !splitSelected) setSplitSelected(papers[0]);
  }, [tweaks.layout, papers]);

  const content = (
    <>
      <Navbar/>
      <Hero onAnalyze={analyze} mode={mode} setMode={setMode} query={query} setQuery={setQuery}/>

      {stage !== 'idle' && (
        <div className="results-shell">
          {stage === 'results' && <SeedCard/>}

          {stage === 'results' && (
            <div className="tabs">
              <button className={`tab ${tab === 'results' ? 'active' : ''}`} onClick={() => setTab('results')}>
                Ranked results <span className="count">{papers.length}</span>
              </button>
              <button className={`tab ${tab === 'timeline' ? 'active' : ''}`} onClick={() => setTab('timeline')}>
                Timeline
              </button>
              <button className={`tab ${tab === 'network' ? 'active' : ''}`} onClick={() => setTab('network')}>
                Network <span className="count">soon</span>
              </button>
            </div>
          )}

          {tab === 'results' && (
            <>
              <div className="toolbar">
                <div className="left">
                  <b>{window.SEED_PAPER.citingCount}</b> citing papers · showing <b>{papers.length}</b> ranked by <b>{MODES.find(m => m.id === mode)?.label}</b>
                </div>
                <div className="right">
                  <button className="ghost-btn"><Icon.Sort/> Custom weights</button>
                </div>
              </div>

              <div className={`layout ${tweaks.layout}`}>
                <Filters filters={filters} setFilters={setFilters}/>

                {tweaks.layout === 'focus' && (
                  <div>
                    {stage === 'loading' ? <Skeleton/> : (
                      <div className="paper-list fade-in">
                        {papers.map((p, i) => (
                          <PaperFocus key={p.id} paper={p} idx={i}
                            expanded={expanded === p.id}
                            onToggle={() => setExpanded(expanded === p.id ? null : p.id)}/>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {tweaks.layout === 'stream' && (
                  <div>
                    {stage === 'loading' ? <Skeleton/> : <StreamList papers={papers}/>}
                  </div>
                )}

                {tweaks.layout === 'split' && <>
                  <SplitList papers={papers} selected={splitSelected} setSelected={setSplitSelected}/>
                  <SplitPreview paper={splitSelected}/>
                </>}
              </div>
            </>
          )}

          {tab === 'timeline' && <Timeline/>}
          {tab === 'network' && (
            <div className="timeline-wrap" style={{textAlign:'center', padding:'70px 40px'}}>
              <div className="seed-eyebrow" style={{justifyContent:'center'}}><span className="dot"/>Coming soon</div>
              <h3 style={{fontFamily:'var(--font-serif)', fontWeight:400, fontSize:26, margin:'12px 0 6px'}}>Citation network view</h3>
              <p style={{color:'var(--ink-3)', margin:0}}>See how top citing papers cluster around shared methods.</p>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      {tweaks.viewport === 'mobile' ? (
        <div style={{minHeight:'100vh', background: 'var(--bg-2)', padding: '20px 0'}}>
          <div className="mobile-frame"><div className="inner">{content}</div></div>
        </div>
      ) : content}
      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={tweaksVisible}/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
