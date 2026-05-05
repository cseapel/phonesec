// extra-screens.jsx — Onboarding, Settings Detail, Threat History

// ── ONBOARDING ──────────────────────────────────────────────────────────────
function Onboarding({ step, onNext, onSkip }) {
  const steps = [
    {
      title: 'Watch every input device',
      sub: 'See which apps tap your mic, camera, GPS, keyboard, Wi-Fi & Bluetooth — in real time.',
      art: 'sensors',
    },
    {
      title: 'Catch them in the act',
      sub: 'A floating bubble appears the moment an app silently uses something it shouldn\u2019t.',
      art: 'bubble',
    },
    {
      title: 'Allow permission monitoring',
      sub: 'PhoneSec needs access to system usage stats. Your data never leaves the device.',
      art: 'permission',
    },
  ];
  const s = steps[step];
  return (
    <div style={{ padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* progress */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= step ? '#3df0ff' : 'rgba(255,255,255,.1)',
            transition: 'background .3s',
          }} />
        ))}
      </div>
      {/* art */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <OnboardingArt kind={s.art} />
      </div>
      <div>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase',
          color: '#3df0ff', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8,
        }}>step {step + 1} of {steps.length}</div>
        <div style={{
          fontSize: 26, fontWeight: 600, color: '#e8f0ff', lineHeight: 1.15,
          letterSpacing: '-0.02em',
        }}>{s.title}</div>
        <div style={{
          fontSize: 14, color: 'rgba(232,240,255,.6)', marginTop: 10, lineHeight: 1.5,
        }}>{s.sub}</div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
        {step < steps.length - 1 && (
          <button onClick={onSkip} style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
            color: '#e8f0ff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit',
          }}>Skip</button>
        )}
        <button onClick={onNext} style={{
          flex: 2, padding: '14px', borderRadius: 12,
          background: 'linear-gradient(135deg, #3df0ff 0%, #3d8aff 100%)',
          border: 0, color: '#0a1628', fontSize: 14, fontWeight: 700,
          cursor: 'pointer', letterSpacing: '.02em',
          boxShadow: '0 8px 24px rgba(61,240,255,.25)',
        }}>{step === steps.length - 1 ? 'Grant access' : 'Continue'}</button>
      </div>
    </div>
  );
}

function OnboardingArt({ kind }) {
  if (kind === 'sensors') {
    return (
      <div style={{ position: 'relative', width: 240, height: 240 }}>
        {/* center shield */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          width: 80, height: 80, borderRadius: 20,
          background: 'linear-gradient(135deg, #3df0ff 0%, #3d8aff 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#0a1628', boxShadow: '0 8px 32px rgba(61,240,255,.4)',
          zIndex: 2,
        }}>
          <Icon.shieldCheck width="40" height="40" />
        </div>
        {/* orbiting sensors */}
        {Object.keys(SENSORS).map((k, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const r = 90;
          const x = 120 + r * Math.cos(angle) - 22;
          const y = 120 + r * Math.sin(angle) - 22;
          const G = Icon[SENSORS[k].icon];
          return (
            <div key={k} style={{
              position: 'absolute', left: x, top: y,
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(61,240,255,.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#3df0ff',
            }}>
              <G width="20" height="20" />
            </div>
          );
        })}
        {/* connecting lines */}
        <svg width="240" height="240" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          {Object.keys(SENSORS).map((k, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const r = 90;
            const x = 120 + r * Math.cos(angle);
            const y = 120 + r * Math.sin(angle);
            return <line key={k} x1="120" y1="120" x2={x} y2={y}
                         stroke="rgba(61,240,255,.18)" strokeWidth="1" strokeDasharray="2 4" />;
          })}
        </svg>
      </div>
    );
  }
  if (kind === 'bubble') {
    return (
      <div style={{ position: 'relative', width: 240, height: 240 }}>
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          width: 88, height: 88, borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff4757 0%, #c92741 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', boxShadow: '0 0 0 0 rgba(255,71,87,.5), 0 12px 36px rgba(255,71,87,.4)',
          animation: 'mfs-pulse 1.6s ease-out infinite',
        }}>
          <Icon.mic width="40" height="40" />
        </div>
        <div style={{
          position: 'absolute', left: '50%', top: 'calc(50% + 70px)',
          transform: 'translateX(-50%)',
          padding: '8px 12px', borderRadius: 10,
          background: 'rgba(10,22,40,.95)', border: '1px solid rgba(255,71,87,.4)',
          fontSize: 11, color: '#ff6b7a', whiteSpace: 'nowrap',
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
        }}>● mozaic.social caught</div>
      </div>
    );
  }
  // permission
  return (
    <div style={{ position: 'relative', width: 240, height: 220,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 160, height: 160, borderRadius: 22,
        background: 'rgba(255,255,255,.025)',
        border: '1px dashed rgba(61,240,255,.4)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 12,
        color: '#3df0ff',
      }}>
        <Icon.scan width="48" height="48" />
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '.16em',
          fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase',
        }}>Usage Access</div>
      </div>
    </div>
  );
}

// ── THREAT HISTORY ──────────────────────────────────────────────────────────
function ThreatHistory({ apps, onPickApp, density }) {
  const pad = density === 'compact' ? 12 : density === 'comfy' ? 20 : 16;
  const incidents = [
    { day: 'Today',     items: [
      { app: 'mz', desc: 'Used mic 14× in background', sev: 'danger', t: '14:32' },
      { app: 'kb', desc: 'Sent keystrokes over Wi-Fi', sev: 'danger', t: '11:08' },
      { app: 'fl', desc: 'Pulled GPS while screen off', sev: 'warn',  t: '08:41' },
    ]},
    { day: 'Yesterday', items: [
      { app: 'mz', desc: 'Camera flashed for 0.3s',  sev: 'danger', t: '23:15' },
      { app: 'st', desc: 'Bluetooth scan',           sev: 'warn',   t: '19:02' },
    ]},
    { day: 'Sat May 3', items: [
      { app: 'fl', desc: 'New install — broad perms', sev: 'warn',  t: '12:50' },
    ]},
    { day: 'Fri May 2', items: [
      { app: 'wt', desc: 'Background GPS · 14 mins', sev: 'safe',   t: '07:22' },
    ]},
  ];

  return (
    <div style={{ padding: `${pad}px ${pad}px 80px`, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* summary */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
      }}>
        {[
          ['7d incidents', '23', 'red'],
          ['blocked', '4', 'cyan'],
          ['allowed', '19', 'green'],
        ].map(([l, v, tone]) => {
          const t = TONES[tone];
          return (
            <div key={l} style={{
              padding: '12px', borderRadius: 12,
              background: t.bg, border: `1px solid ${t.ring}`,
            }}>
              <div style={{
                fontSize: 9, color: 'rgba(232,240,255,.55)',
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '.12em', textTransform: 'uppercase',
              }}>{l}</div>
              <div style={{
                fontSize: 22, fontWeight: 600, marginTop: 4,
                fontFamily: 'JetBrains Mono, monospace', color: t.fg,
              }}>{v}</div>
            </div>
          );
        })}
      </div>

      {incidents.map(group => (
        <div key={group.day}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '.14em',
            color: 'rgba(232,240,255,.45)', textTransform: 'uppercase',
            fontFamily: 'JetBrains Mono, monospace', marginBottom: 8,
          }}>{group.day}</div>
          <div style={{
            borderRadius: 14,
            background: 'rgba(255,255,255,.025)',
            border: '1px solid rgba(255,255,255,.06)',
            overflow: 'hidden',
          }}>
            {group.items.map((it, i, arr) => {
              const app = apps.find(a => a.id === it.app);
              const t = TONES[it.sev === 'danger' ? 'red' : it.sev === 'warn' ? 'amber' : 'green'];
              return (
                <div key={i} onClick={() => onPickApp(app)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
                  borderBottom: i === arr.length - 1 ? 'none' : '1px solid rgba(255,255,255,.04)',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 4, alignSelf: 'stretch', borderRadius: 2,
                    background: t.fg, opacity: .7,
                  }} />
                  <AppGlyph name={app.name} color={app.color} size={32} radius={9} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#e8f0ff', fontWeight: 500 }}>
                      {app.name}
                    </div>
                    <div style={{
                      fontSize: 11, color: 'rgba(232,240,255,.55)', marginTop: 2,
                    }}>{it.desc}</div>
                  </div>
                  <div style={{
                    fontSize: 10, color: 'rgba(232,240,255,.4)',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}>{it.t}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── SETTINGS DETAIL (Notifications) ─────────────────────────────────────────
function SettingsDetail({ density }) {
  const [bubble, setBubble] = React.useState(true);
  const [sound, setSound] = React.useState(true);
  const [vibe, setVibe] = React.useState(true);
  const [bgOnly, setBgOnly] = React.useState(true);
  const [sensitivity, setSensitivity] = React.useState('high');
  const pad = density === 'compact' ? 12 : density === 'comfy' ? 20 : 16;

  return (
    <div style={{ padding: `${pad}px ${pad}px 80px`, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <SettingsGroup label="Alert delivery">
        <Switch label="Floating bubble"   sub="Persistent overlay over other apps" v={bubble} on={setBubble} />
        <Switch label="Sound"             sub="Play tone when caught"               v={sound}  on={setSound} />
        <Switch label="Vibration"         sub="Haptic pulse on alert"               v={vibe}   on={setVibe} />
      </SettingsGroup>

      <SettingsGroup label="When to alert">
        <Switch label="Background only" sub="Skip if app is in foreground" v={bgOnly} on={setBgOnly} />
        <SegRow label="Sensitivity" value={sensitivity} onChange={setSensitivity}
                options={[['low','Low'],['med','Medium'],['high','High']]} />
      </SettingsGroup>

      <SettingsGroup label="Per-sensor">
        {Object.keys(SENSORS).map(k => {
          const meta = SENSORS[k];
          const G = Icon[meta.icon];
          const t = TONES[meta.tone];
          return (
            <div key={k} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
              borderBottom: '1px solid rgba(255,255,255,.04)',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: t.bg, color: t.fg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><G width="16" height="16" /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: '#e8f0ff', fontWeight: 500 }}>{meta.label}</div>
                <div style={{
                  fontSize: 10, color: 'rgba(232,240,255,.5)', marginTop: 1,
                  fontFamily: 'JetBrains Mono, monospace',
                }}>alert on every access</div>
              </div>
              <Toggle on={true} />
            </div>
          );
        })}
      </SettingsGroup>
    </div>
  );
}

function SettingsGroup({ label, children }) {
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase',
        color: 'rgba(232,240,255,.45)', fontFamily: 'JetBrains Mono, monospace',
        marginBottom: 8,
      }}>{label}</div>
      <div style={{
        borderRadius: 14,
        background: 'rgba(255,255,255,.025)',
        border: '1px solid rgba(255,255,255,.06)',
        overflow: 'hidden',
      }}>{children}</div>
    </div>
  );
}

function Switch({ label, sub, v, on }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
      borderBottom: '1px solid rgba(255,255,255,.04)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: '#e8f0ff', fontWeight: 500 }}>{label}</div>
        {sub && <div style={{
          fontSize: 11, color: 'rgba(232,240,255,.5)', marginTop: 2,
        }}>{sub}</div>}
      </div>
      <Toggle on={v} onClick={() => on(!v)} />
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 38, height: 22, borderRadius: 100, padding: 0, border: 0,
      background: on ? '#3df0ff' : 'rgba(255,255,255,.15)',
      position: 'relative', cursor: 'pointer',
      transition: 'background .15s',
    }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? 18 : 2,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff', transition: 'left .15s',
        boxShadow: '0 1px 3px rgba(0,0,0,.3)',
      }} />
    </button>
  );
}

function SegRow({ label, value, options, onChange }) {
  return (
    <div style={{ padding: '12px' }}>
      <div style={{ fontSize: 13, color: '#e8f0ff', fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div style={{
        display: 'flex', padding: 3, borderRadius: 9,
        background: 'rgba(0,0,0,.3)',
      }}>
        {options.map(([k, l]) => (
          <button key={k} onClick={() => onChange(k)} style={{
            flex: 1, padding: '7px 0', border: 0,
            borderRadius: 7,
            background: value === k ? 'rgba(61,240,255,.2)' : 'transparent',
            color: value === k ? '#3df0ff' : 'rgba(232,240,255,.55)',
            fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
          }}>{l}</button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Onboarding, ThreatHistory, SettingsDetail });
