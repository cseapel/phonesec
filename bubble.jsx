// bubble.jsx — floating "chat-head" alert bubble. The hero moment.
// Pulses + drops in when an app secretly accesses an input device.

function AlertBubble({ alert, onTap, onDismiss, density = 'regular' }) {
  if (!alert) return null;
  const sensor = SENSORS[alert.sensor];
  const Glyph = Icon[sensor.icon];
  return (
    <>
      <style>{`
        @keyframes mfs-bubble-in {
          0% { transform: translate(0, -120%) scale(.6); opacity: 0; }
          70% { transform: translate(0, 4px) scale(1.05); opacity: 1; }
          100% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes mfs-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,71,87,.55), 0 8px 32px rgba(0,0,0,.5); }
          50%      { box-shadow: 0 0 0 14px rgba(255,71,87,0), 0 8px 32px rgba(0,0,0,.5); }
        }
        @keyframes mfs-radar {
          0%   { transform: scale(.6); opacity: .8; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .mfs-bubble {
          position: absolute; right: 14px; top: 96px; z-index: 20;
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, #ff4757 0%, #c92741 100%);
          color: #fff; display: flex; align-items: center; justify-content: center;
          animation: mfs-bubble-in .45s cubic-bezier(.2,1.4,.4,1) both,
                     mfs-pulse 1.6s ease-out infinite .45s;
          cursor: pointer;
        }
        .mfs-bubble::before, .mfs-bubble::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          border: 1.5px solid rgba(255,71,87,.6);
          animation: mfs-radar 2s ease-out infinite;
          pointer-events: none;
        }
        .mfs-bubble::after { animation-delay: 1s; }
        .mfs-bubble-card {
          position: absolute; right: 76px; top: 100px; z-index: 21;
          background: rgba(10,22,40,.92); backdrop-filter: blur(20px);
          border: 1px solid rgba(255,71,87,.4);
          border-radius: 14px; padding: 10px 12px; min-width: 180px;
          color: #e8f0ff; font-family: Inter, system-ui, sans-serif;
          box-shadow: 0 12px 32px rgba(0,0,0,.5);
          animation: mfs-bubble-in .5s cubic-bezier(.2,1.4,.4,1) .15s both;
        }
        .mfs-bubble-card::after {
          content: ''; position: absolute; right: -6px; top: 18px;
          width: 12px; height: 12px; background: rgba(10,22,40,.92);
          border-right: 1px solid rgba(255,71,87,.4);
          border-top: 1px solid rgba(255,71,87,.4);
          transform: rotate(45deg);
        }
      `}</style>
      <div className="mfs-bubble" onClick={onTap}>
        <Glyph width="22" height="22" />
      </div>
      <div className="mfs-bubble-card" onClick={onTap}>
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '.14em',
          color: '#ff6b7a', textTransform: 'uppercase',
          fontFamily: 'JetBrains Mono, monospace',
        }}>● Live · caught</div>
        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 3 }}>
          {alert.app} is using {sensor.label.toLowerCase()}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(232,240,255,.55)', marginTop: 2 }}>
          background · tap to inspect
        </div>
      </div>
    </>
  );
}

Object.assign(window, { AlertBubble });
