// screens.jsx — Dashboard + AppList + AppDetail screens for PhoneSec
// Pulls from window.MOCK_APPS / window.MOCK_EVENTS

// ── theme tokens ─────────────────────────────────────────────────────────────
const TONES = {
  red:   { fg: '#ff4757', bg: 'rgba(255,71,87,.14)',  ring: 'rgba(255,71,87,.35)' },
  amber: { fg: '#ffb547', bg: 'rgba(255,181,71,.14)', ring: 'rgba(255,181,71,.35)' },
  cyan:  { fg: '#3df0ff', bg: 'rgba(61,240,255,.12)', ring: 'rgba(61,240,255,.30)' },
  green: { fg: '#3df0a8', bg: 'rgba(61,240,168,.12)', ring: 'rgba(61,240,168,.30)' },
};

const RISK = {
  safe:    { label: 'safe',    fg: '#3df0a8', bg: 'rgba(61,240,168,.14)', dot: '#3df0a8' },
  warn:    { label: 'warn',    fg: '#ffb547', bg: 'rgba(255,181,71,.14)', dot: '#ffb547' },
  danger:  { label: 'danger',  fg: '#ff4757', bg: 'rgba(255,71,87,.14)',  dot: '#ff4757' },
};

// ── Top bar (replaces android starter app bar with a custom one) ────────────
function TopBar({ title, sub, onBack, right }) {
  return (
    <div style={{
      padding: '8px 16px 12px', display: 'flex', alignItems: 'center', gap: 10,
      borderBottom: '1px solid rgba(255,255,255,.06)',
    }}>
      {onBack ? (
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,.08)',
          background: 'rgba(255,255,255,.03)', color: '#e8f0ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}><Icon.chevL width="18" height="18" /></button>
      ) : (
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #3df0ff 0%, #3d8aff 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#0a1628',
        }}><Icon.shieldCheck width="20" height="20" /></div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 17, fontWeight: 600, color: '#e8f0ff',
          fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.01em',
        }}>{title}</div>
        {sub && <div style={{
          fontSize: 11, color: 'rgba(232,240,255,.5)',
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.04em',
        }}>{sub}</div>}
      </div>
      {right || (
        <button style={{
          width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,.08)',
          background: 'rgba(255,255,255,.03)', color: '#e8f0ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}><Icon.bell width="18" height="18" /></button>
      )}
    </div>
  );
}

// ── Risk pill ───────────────────────────────────────────────────────────────
function RiskPill({ level, mono = false }) {
  const r = RISK[level];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 8px 3px 6px', borderRadius: 100,
      background: r.bg, color: r.fg,
      fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase',
      fontFamily: mono ? 'JetBrains Mono, monospace' : 'Inter, system-ui, sans-serif',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: r.dot,
        boxShadow: `0 0 8px ${r.dot}`,
      }} />
      {r.label}
    </div>
  );
}

// ── Sensor chip ─────────────────────────────────────────────────────────────
function SensorChip({ sensor, active, count, onClick }) {
  const meta = SENSORS[sensor];
  const tone = TONES[active ? meta.tone : 'green'];
  const G = Icon[meta.icon];
  return (
    <button onClick={onClick} style={{
      flex: 1, minWidth: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
      padding: '12px 12px 14px', borderRadius: 14,
      background: active ? tone.bg : 'rgba(255,255,255,.025)',
      border: `1px solid ${active ? tone.ring : 'rgba(255,255,255,.06)'}`,
      color: active ? tone.fg : 'rgba(232,240,255,.6)',
      cursor: 'pointer', textAlign: 'left',
      position: 'relative', overflow: 'hidden',
    }}>
      {active && (
        <span style={{
          position: 'absolute', top: 10, right: 10,
          width: 6, height: 6, borderRadius: '50%', background: tone.fg,
          boxShadow: `0 0 8px ${tone.fg}`,
          animation: 'mfs-blink 1.4s ease-in-out infinite',
        }} />
      )}
      <G width="18" height="18" />
      <div style={{ width: '100%' }}>
        <div style={{
          fontSize: 11, color: 'rgba(232,240,255,.55)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>{meta.label}</div>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2,
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: active ? tone.fg : '#e8f0ff' }}>
            {count}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(232,240,255,.4)' }}>apps</span>
        </div>
      </div>
    </button>
  );
}

// ── Scanner halo (decorative, sits behind score) ───────────────────────────
function ScoreRing({ score, intensity = 'balanced' }) {
  // Map intensity to ring color and pulse
  const isDanger = intensity === 'alarming';
  const ringColor = score > 70 ? '#3df0a8' : score > 40 ? '#ffb547' : '#ff4757';
  const r = 56, c = 2 * Math.PI * r;
  const off = c * (1 - score / 100);
  return (
    <div style={{ position: 'relative', width: 144, height: 144 }}>
      <svg width="144" height="144" viewBox="0 0 144 144"
           style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="mfs-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={ringColor} stopOpacity=".9" />
            <stop offset="100%" stopColor={ringColor} stopOpacity=".5" />
          </linearGradient>
        </defs>
        <circle cx="72" cy="72" r={r} fill="none"
                stroke="rgba(255,255,255,.06)" strokeWidth="6" />
        <circle cx="72" cy="72" r={r} fill="none"
                stroke="url(#mfs-grad)" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={off}
                style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      {/* tick marks */}
      <svg width="144" height="144" viewBox="0 0 144 144"
           style={{ position: 'absolute', inset: 0 }}>
        {[...Array(36)].map((_, i) => (
          <line key={i} x1="72" y1="10" x2="72" y2="14"
                stroke="rgba(255,255,255,.1)" strokeWidth="1"
                transform={`rotate(${i * 10} 72 72)`} />
        ))}
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 38, fontWeight: 600, color: '#e8f0ff',
          lineHeight: 1, letterSpacing: '-.02em',
        }}>{score}<span style={{ fontSize: 16, color: 'rgba(232,240,255,.4)' }}>/100</span></div>
        <div style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase',
          color: ringColor, marginTop: 6, fontFamily: 'JetBrains Mono, monospace',
        }}>{isDanger ? '⚠ exposed' : score > 70 ? '✓ protected' : '⚠ at risk'}</div>
      </div>
    </div>
  );
}

// ── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ apps, events, density, intensity, onPickApp, onOpenList, onOpenSensor, activeAlert }) {
  const pad = density === 'compact' ? 12 : density === 'comfy' ? 20 : 16;
  const gap = density === 'compact' ? 10 : density === 'comfy' ? 18 : 14;

  // Counts of currently-accessing
  const live = events.filter(e => e.live);
  const liveCounts = Object.keys(SENSORS).reduce((acc, k) => {
    acc[k] = live.filter(e => e.sensor === k).length; return acc;
  }, {});

  const score = intensity === 'alarming' ? 42 : intensity === 'calm' ? 88 : 64;
  const flagged = apps.filter(a => a.risk !== 'safe');

  return (
    <div style={{ padding: `${pad}px ${pad}px 80px`, display: 'flex', flexDirection: 'column', gap: gap + 4 }}>
      {/* score card */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 18, padding: '18px 16px 16px',
        background: 'linear-gradient(180deg, rgba(61,138,255,.08) 0%, rgba(10,22,40,0) 100%), rgba(255,255,255,.02)',
        border: '1px solid rgba(255,255,255,.06)',
      }}>
        {/* grid bg */}
        <svg width="100%" height="100%" style={{
          position: 'absolute', inset: 0, opacity: .35, pointerEvents: 'none',
        }}>
          <defs>
            <pattern id="mfs-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(61,240,255,.06)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mfs-grid)" />
        </svg>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
          <ScoreRing score={score} intensity={intensity} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase',
              color: 'rgba(61,240,255,.7)', fontFamily: 'JetBrains Mono, monospace',
            }}>privacy index</div>
            <div style={{
              fontSize: 18, fontWeight: 600, color: '#e8f0ff', marginTop: 4,
              lineHeight: 1.2, letterSpacing: '-0.01em',
            }}>
              {intensity === 'alarming'
                ? '3 apps acting suspicious right now'
                : 'Most of your apps are behaving'}
            </div>
            <div style={{
              fontSize: 11, color: 'rgba(232,240,255,.5)', marginTop: 6,
              fontFamily: 'JetBrains Mono, monospace',
            }}>last scan · {new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
          </div>
        </div>
      </div>

      {/* live sensors */}
      <div>
        <SectionHead title="Input devices" sub="tap to filter" right={<LiveDot />} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 10 }}>
          {Object.keys(SENSORS).map(k => (
            <SensorChip key={k} sensor={k} active={liveCounts[k] > 0}
                         count={liveCounts[k]} onClick={() => onOpenSensor(k)} />
          ))}
        </div>
      </div>

      {/* live activity */}
      <div>
        <SectionHead title="Live activity" sub="real-time access feed" />
        <div style={{
          marginTop: 10, borderRadius: 14,
          background: 'rgba(255,255,255,.025)',
          border: '1px solid rgba(255,255,255,.06)',
          overflow: 'hidden',
        }}>
          {events.slice(0, 5).map((ev, i) => (
            <EventRow key={i} ev={ev} app={apps.find(a => a.id === ev.appId)}
                       onClick={() => onPickApp(apps.find(a => a.id === ev.appId))}
                       last={i === 4} />
          ))}
        </div>
      </div>

      {/* flagged apps */}
      <div>
        <SectionHead title="Flagged apps" sub={`${flagged.length} need review`}
                     right={<button onClick={onOpenList} style={{
                       background: 'transparent', border: 0, color: '#3df0ff',
                       fontSize: 11, fontWeight: 600, letterSpacing: '.08em',
                       textTransform: 'uppercase', cursor: 'pointer',
                       fontFamily: 'JetBrains Mono, monospace',
                     }}>all apps →</button>} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
          {flagged.slice(0, 3).map(a => (
            <AppRow key={a.id} app={a} onClick={() => onPickApp(a)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHead({ title, sub, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
      <div>
        <div style={{
          fontSize: 13, fontWeight: 600, color: '#e8f0ff', letterSpacing: '-0.01em',
        }}>{title}</div>
        {sub && <div style={{
          fontSize: 10, color: 'rgba(232,240,255,.4)', marginTop: 2,
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.06em',
        }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function LiveDot() {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 10, fontWeight: 600, letterSpacing: '.14em',
      color: '#ff4757', textTransform: 'uppercase',
      fontFamily: 'JetBrains Mono, monospace',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', background: '#ff4757',
        boxShadow: '0 0 8px #ff4757',
        animation: 'mfs-blink 1.4s ease-in-out infinite',
      }} />
      live
    </div>
  );
}

function EventRow({ ev, app, onClick, last }) {
  if (!app) return null;
  const meta = SENSORS[ev.sensor];
  const G = Icon[meta.icon];
  const tone = TONES[meta.tone];
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 12px',
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,.04)',
      cursor: 'pointer',
    }}>
      <AppGlyph name={app.name} color={app.color} size={32} radius={9} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 6,
          fontSize: 13, fontWeight: 500, color: '#e8f0ff',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{app.name}</div>
        <div style={{
          fontSize: 11, color: 'rgba(232,240,255,.5)', marginTop: 2,
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          <span style={{ color: tone.fg }}>● </span>
          {ev.live ? 'using' : 'used'} {meta.label.toLowerCase()} · {ev.when}
        </div>
      </div>
      <div style={{ color: tone.fg, opacity: .9 }}>
        <G width="16" height="16" />
      </div>
    </div>
  );
}

function AppRow({ app, onClick, dense }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: dense ? '8px 12px' : '12px',
      background: 'rgba(255,255,255,.025)',
      border: '1px solid rgba(255,255,255,.06)',
      borderRadius: 12, cursor: 'pointer',
    }}>
      <AppGlyph name={app.name} color={app.color} size={dense ? 32 : 40} radius={dense ? 9 : 11} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: dense ? 13 : 14, fontWeight: 500, color: '#e8f0ff',
          letterSpacing: '-0.01em',
        }}>{app.name}</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginTop: 4,
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          {app.permissions.slice(0, 4).map(p => {
            const meta = SENSORS[p];
            const G = Icon[meta.icon];
            const t = TONES[meta.tone];
            return (
              <span key={p} title={meta.label} style={{ color: t.fg, opacity: .85 }}>
                <G width="13" height="13" />
              </span>
            );
          })}
          <span style={{
            fontSize: 10, color: 'rgba(232,240,255,.4)',
          }}>· {app.accesses24h}/24h</span>
        </div>
      </div>
      <RiskPill level={app.risk} mono />
    </div>
  );
}

// ── APP LIST ────────────────────────────────────────────────────────────────
function AppList({ apps, onPickApp, sensorFilter, onClearFilter, density }) {
  const [sort, setSort] = React.useState('risk');
  const [query, setQuery] = React.useState('');
  let filtered = apps;
  if (sensorFilter) filtered = filtered.filter(a => a.permissions.includes(sensorFilter));
  if (query) filtered = filtered.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
  const order = { danger: 0, warn: 1, safe: 2 };
  filtered = [...filtered].sort((a, b) =>
    sort === 'risk' ? order[a.risk] - order[b.risk]
    : sort === 'recent' ? b.lastAccessTs - a.lastAccessTs
    : a.name.localeCompare(b.name));

  const pad = density === 'compact' ? 12 : density === 'comfy' ? 20 : 16;

  return (
    <div style={{ padding: `${pad}px ${pad}px 80px`, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 12,
        background: 'rgba(255,255,255,.04)',
        border: '1px solid rgba(255,255,255,.06)',
      }}>
        <Icon.search width="16" height="16" style={{ color: 'rgba(232,240,255,.5)' }} />
        <input value={query} onChange={e => setQuery(e.target.value)}
               placeholder="search 247 apps…" style={{
          flex: 1, border: 0, background: 'transparent', color: '#e8f0ff', outline: 'none',
          fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13,
        }} />
      </div>

      {/* filter chip */}
      {sensorFilter && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
          borderRadius: 100, background: TONES[SENSORS[sensorFilter].tone].bg,
          border: `1px solid ${TONES[SENSORS[sensorFilter].tone].ring}`,
          alignSelf: 'flex-start',
          color: TONES[SENSORS[sensorFilter].tone].fg,
          fontSize: 11, fontWeight: 600,
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.06em',
        }}>
          filter: {SENSORS[sensorFilter].label.toLowerCase()}
          <button onClick={onClearFilter} style={{
            border: 0, background: 'transparent', color: 'inherit', cursor: 'pointer',
            fontSize: 14, lineHeight: 1, padding: 0,
          }}>✕</button>
        </div>
      )}

      {/* sort tabs */}
      <div style={{
        display: 'flex', gap: 0, padding: 3, borderRadius: 10,
        background: 'rgba(255,255,255,.04)',
        border: '1px solid rgba(255,255,255,.06)',
      }}>
        {[
          ['risk', 'Risk'],
          ['recent', 'Recent'],
          ['name', 'A-Z'],
        ].map(([k, l]) => (
          <button key={k} onClick={() => setSort(k)} style={{
            flex: 1, padding: '7px 0', border: 0,
            borderRadius: 7,
            background: sort === k ? 'rgba(61,240,255,.14)' : 'transparent',
            color: sort === k ? '#3df0ff' : 'rgba(232,240,255,.55)',
            fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
          }}>{l}</button>
        ))}
      </div>

      {/* list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(a => <AppRow key={a.id} app={a} onClick={() => onPickApp(a)} dense={density==='compact'} />)}
      </div>
    </div>
  );
}

// ── APP DETAIL ──────────────────────────────────────────────────────────────
function AppDetail({ app, events, density }) {
  const pad = density === 'compact' ? 12 : density === 'comfy' ? 20 : 16;
  const myEvents = events.filter(e => e.appId === app.id);
  // bucket per sensor
  const bySensor = {};
  app.permissions.forEach(p => { bySensor[p] = myEvents.filter(e => e.sensor === p); });

  return (
    <div style={{ padding: `${pad}px ${pad}px 80px`, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* hero */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 18, padding: 18,
        background: `linear-gradient(135deg, ${app.color}22 0%, rgba(10,22,40,0) 60%), rgba(255,255,255,.025)`,
        border: '1px solid rgba(255,255,255,.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <AppGlyph name={app.name} color={app.color} size={56} radius={14} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 18, fontWeight: 600, color: '#e8f0ff',
              letterSpacing: '-0.01em',
            }}>{app.name}</div>
            <div style={{
              fontSize: 11, color: 'rgba(232,240,255,.45)', marginTop: 2,
              fontFamily: 'JetBrains Mono, monospace',
            }}>{app.bundle}</div>
            <div style={{ marginTop: 10 }}>
              <RiskPill level={app.risk} mono />
            </div>
          </div>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0,
          marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,.06)',
        }}>
          {[
            ['accesses', `${app.accesses24h}`, '/ 24h'],
            ['background', `${app.bgPct}%`, ''],
            ['installed', app.installed, ''],
          ].map(([k, v, suf]) => (
            <div key={k}>
              <div style={{
                fontSize: 9, color: 'rgba(232,240,255,.4)',
                fontFamily: 'JetBrains Mono, monospace',
                textTransform: 'uppercase', letterSpacing: '.12em',
              }}>{k}</div>
              <div style={{
                fontSize: 16, color: '#e8f0ff', marginTop: 3,
                fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
              }}>{v}<span style={{
                fontSize: 10, color: 'rgba(232,240,255,.4)', marginLeft: 3, fontWeight: 400,
              }}>{suf}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <ActionBtn icon="block" label="Block" tone="red" />
        <ActionBtn icon="bell" label="Alert me" tone="cyan" />
        <ActionBtn icon="more" label="More" />
      </div>

      {/* per-sensor accesses */}
      <div>
        <SectionHead title="Permission activity" sub="last 24 hours" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
          {app.permissions.map(p => (
            <SensorActivity key={p} sensor={p} events={bySensor[p]} />
          ))}
        </div>
      </div>

      {/* timeline */}
      <div>
        <SectionHead title="Timeline" sub={`${myEvents.length} events`} />
        <div style={{
          marginTop: 10, borderRadius: 14,
          background: 'rgba(255,255,255,.025)',
          border: '1px solid rgba(255,255,255,.06)',
          overflow: 'hidden',
        }}>
          {myEvents.slice(0, 6).map((ev, i, arr) => {
            const meta = SENSORS[ev.sensor];
            const G = Icon[meta.icon];
            const t = TONES[meta.tone];
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px',
                borderBottom: i === arr.length - 1 ? 'none' : '1px solid rgba(255,255,255,.04)',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: t.bg, color: t.fg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}><G width="15" height="15" /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: '#e8f0ff' }}>
                    {ev.live ? 'Currently using ' : 'Used '}
                    <span style={{ color: t.fg }}>{meta.label.toLowerCase()}</span>
                    {ev.duration && <span style={{ color: 'rgba(232,240,255,.5)' }}> · {ev.duration}</span>}
                  </div>
                  <div style={{
                    fontSize: 10, color: 'rgba(232,240,255,.4)', marginTop: 2,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}>{ev.when} · {ev.bg ? 'background' : 'foreground'}</div>
                </div>
                {ev.live && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '.14em',
                    color: '#ff4757', textTransform: 'uppercase',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}>● live</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, tone }) {
  const t = tone ? TONES[tone] : null;
  const G = Icon[icon];
  return (
    <button style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '11px 8px', borderRadius: 12,
      background: t ? t.bg : 'rgba(255,255,255,.04)',
      border: `1px solid ${t ? t.ring : 'rgba(255,255,255,.06)'}`,
      color: t ? t.fg : '#e8f0ff',
      fontSize: 12, fontWeight: 600, letterSpacing: '.04em',
      cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <G width="15" height="15" /> {label}
    </button>
  );
}

function SensorActivity({ sensor, events }) {
  const meta = SENSORS[sensor];
  const G = Icon[meta.icon];
  const t = TONES[meta.tone];
  // build a 24-segment bar (one per hour) — fill if there was access in that hour
  const bars = [...Array(24)].map((_, i) => events.some(e => e.hour === i));
  const live = events.some(e => e.live);
  return (
    <div style={{
      padding: '12px', borderRadius: 12,
      background: 'rgba(255,255,255,.025)',
      border: '1px solid rgba(255,255,255,.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: t.bg, color: t.fg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><G width="15" height="15" /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: '#e8f0ff', fontWeight: 500 }}>{meta.label}</div>
          <div style={{
            fontSize: 10, color: 'rgba(232,240,255,.45)', marginTop: 1,
            fontFamily: 'JetBrains Mono, monospace',
          }}>{events.length} accesses · last {events[0]?.when || '—'}</div>
        </div>
        {live && <RiskPill level="danger" mono />}
      </div>
      {/* 24-hour heatmap */}
      <div style={{ display: 'flex', gap: 2, marginTop: 10 }}>
        {bars.map((on, i) => (
          <div key={i} style={{
            flex: 1, height: 18, borderRadius: 2,
            background: on ? t.fg : 'rgba(255,255,255,.05)',
            opacity: on ? (live && i === 23 ? 1 : .65) : 1,
            boxShadow: on && live && i === 23 ? `0 0 6px ${t.fg}` : 'none',
          }} />
        ))}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 4,
        fontSize: 9, color: 'rgba(232,240,255,.35)',
        fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.06em',
      }}>
        <span>00:00</span><span>12:00</span><span>now</span>
      </div>
    </div>
  );
}

// ── BOTTOM TAB BAR ──────────────────────────────────────────────────────────
function TabBar({ tab, onTab }) {
  const tabs = [
    ['home',   'Home',  'shieldCheck'],
    ['apps',   'Apps',  'scan'],
    ['feed',   'Feed',  'pulse'],
    ['set',    'You',   'more'],
  ];
  return (
    <div style={{
      display: 'flex', padding: '8px 6px',
      borderTop: '1px solid rgba(255,255,255,.06)',
      background: 'rgba(8,17,32,.92)',
    }}>
      {tabs.map(([k, l, i]) => {
        const G = Icon[i];
        const on = tab === k;
        return (
          <button key={k} onClick={() => onTab(k)} style={{
            flex: 1, padding: '6px 0', border: 0, background: 'transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: on ? '#3df0ff' : 'rgba(232,240,255,.4)',
            cursor: 'pointer',
          }}>
            <G width="20" height="20" />
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '.06em',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}>{l}</span>
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { Dashboard, AppList, AppDetail, TopBar, TabBar, RISK, TONES });
