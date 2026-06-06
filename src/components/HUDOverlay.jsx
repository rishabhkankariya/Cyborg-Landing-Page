import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tiny live data counter hook
function useTicker(min, max, interval = 1200) {
  const [val, setVal] = useState(() => Math.floor(Math.random() * (max - min) + min));
  useEffect(() => {
    const t = setInterval(() => setVal(Math.floor(Math.random() * (max - min) + min)), interval);
    return () => clearInterval(t);
  }, [min, max, interval]);
  return val;
}

// Fake heartbeat spark line
function Heartbeat() {
  const points = "0,16 8,16 14,4 18,28 24,4 28,28 34,16 40,16 46,8 52,16 60,16";
  return (
    <svg viewBox="0 0 60 32" className="w-14 h-4 text-neon-pink" fill="none">
      <polyline points={points} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <animateTransform attributeName="transform" type="translate" from="0,0" to="-60,0"
          dur="1.2s" repeatCount="indefinite" />
      </polyline>
      <polyline points={points} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"
        transform="translate(60,0)">
        <animateTransform attributeName="transform" type="translate" from="60,0" to="0,0"
          dur="1.2s" repeatCount="indefinite" />
      </polyline>
    </svg>
  );
}

export default function HUDOverlay({ districtIdx, scrollPercent }) {
  const fps = useTicker(58, 62, 800);
  const ping = useTicker(1, 4, 1500);
  const temp = useTicker(62, 68, 2000);
  const uplink = useTicker(940, 999, 700);
  const [time, setTime] = useState('');
  const [glitch, setGlitch] = useState(false);

  // Live clock
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  // Random glitch flash
  useEffect(() => {
    const t = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(t);
  }, []);

  const districtNames = ['BOOT', 'CODE', 'A.I.', 'SEC', 'GPU', 'BOT', 'QNT', 'FUT'];
  const districtColors = [
    '#22d3ee', '#3b82f6', '#a855f7', '#ef4444',
    '#22c55e', '#f59e0b', '#10b981', '#22d3ee'
  ];
  const accentColor = districtColors[districtIdx] || '#22d3ee';

  const cornerBracket = (pos) => {
    const [top, right, bottom, left] = [
      pos === 'tl' || pos === 'tr',
      pos === 'tr' || pos === 'br',
      pos === 'bl' || pos === 'br',
      pos === 'tl' || pos === 'bl',
    ];
    return (
      <div className={`absolute w-12 h-12 sm:w-16 sm:h-16 pointer-events-none
        ${top ? 'top-3 sm:top-4' : 'bottom-3 sm:bottom-4'}
        ${left ? 'left-3 sm:left-4' : 'right-3 sm:right-4'}
      `}>
        <div className={`absolute w-full h-[2px] ${top ? 'top-0' : 'bottom-0'} ${left ? 'left-0' : 'right-0'}`}
          style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
        <div className={`absolute w-[2px] h-full ${top ? 'top-0' : 'bottom-0'} ${left ? 'left-0' : 'right-0'}`}
          style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
        {/* inner tick */}
        <div className={`absolute w-4 h-[1px] ${top ? 'bottom-0' : 'top-0'} ${left ? 'right-0' : 'left-0'}`}
          style={{ background: accentColor, opacity: 0.4 }} />
        <div className={`absolute h-4 w-[1px] ${top ? 'bottom-0' : 'top-0'} ${left ? 'right-0' : 'left-0'}`}
          style={{ background: accentColor, opacity: 0.4 }} />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden select-none">

      {/* ── Scanlines ── */}
      <div className="absolute inset-0 scanlines opacity-[0.025]" />

      {/* ── Sweep scan line ── */}
      <motion.div
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
        className="absolute left-0 right-0 h-[1px] pointer-events-none"
        style={{
          background: `linear-gradient(to right, transparent, ${accentColor}60, transparent)`,
          boxShadow: `0 0 12px ${accentColor}40`,
        }}
      />

      {/* ── Corner HUD brackets ── */}
      {cornerBracket('tl')}
      {cornerBracket('tr')}
      {cornerBracket('bl')}
      {cornerBracket('br')}

      {/* ── Top center — district progress bar ── */}
      <div className="absolute top-[52px] sm:top-[60px] left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="flex items-center gap-1.5 bg-cyber-dark/80 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
          {districtNames.map((name, idx) => (
            <div
              key={idx}
              className="h-1 w-6 sm:w-8 rounded-full transition-all duration-500"
              style={{
                background: idx <= districtIdx ? accentColor : 'rgba(255,255,255,0.15)',
                boxShadow: idx === districtIdx ? `0 0 10px ${accentColor}` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Targeting reticle (center of screen, over truck) ── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
        <div className="relative w-20 h-20">
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed"
            style={{ borderColor: `${accentColor}30` }}
          />
          {/* Inner ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-3 rounded-full border"
            style={{ borderColor: `${accentColor}50` }}
          />
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full"
              style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
          </div>
          {/* Crosshair lines */}
          {['top-1/2 left-0 w-3 h-[1px]', 'top-1/2 right-0 w-3 h-[1px]',
            'left-1/2 top-0 w-[1px] h-3', 'left-1/2 bottom-0 w-[1px] h-3'].map((cls, i) => (
            <div key={i} className={`absolute ${cls} -translate-y-1/2 -translate-x-0`}
              style={{ background: accentColor, opacity: 0.6 }} />
          ))}
          {/* Target label */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-orbitron text-[6px] font-bold"
            style={{ color: accentColor }}>
            TARGET LOCKED
          </div>
        </div>
      </div>

      {/* ── Right side — data readouts ── */}
      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 items-end">
        {[
          { label: 'SYS.FPS', val: `${fps}`, unit: 'hz' },
          { label: 'NET.RTT', val: `${ping}`, unit: 'ms' },
          { label: 'CPU.TMP', val: `${temp}`, unit: '°c' },
          { label: 'UPLINK', val: `${uplink}`, unit: 'mb/s' },
        ].map((item) => (
          <div key={item.label} className="text-right">
            <div className="font-orbitron text-[8px] text-slate-500 tracking-widest">{item.label}</div>
            <div className="font-mono text-xs font-bold leading-tight" style={{ color: accentColor }}>
              {item.val}<span className="text-[8px] opacity-60 ml-0.5">{item.unit}</span>
            </div>
          </div>
        ))}

        {/* Heartbeat */}
        <div className="mt-2 flex flex-col items-end gap-0.5">
          <span className="font-orbitron text-[7px] text-slate-500">BIO.PULSE</span>
          <div className="overflow-hidden w-14 h-4">
            <Heartbeat />
          </div>
        </div>
      </div>

      {/* ── Bottom status bar ── */}
      <div className="absolute bottom-0 left-0 right-0 h-7 sm:h-8 border-t flex items-center justify-between px-4 sm:px-6"
        style={{
          background: 'rgba(8,13,26,0.85)',
          borderColor: `${accentColor}25`,
          backdropFilter: 'blur(12px)',
        }}>
        {/* Left: System ID */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: accentColor, boxShadow: `0 0 6px ${accentColor}` }} />
            <span className="font-orbitron text-[8px] font-bold" style={{ color: accentColor }}>
              SYS ONLINE
            </span>
          </div>
          <span className="font-mono text-[7px] sm:text-[8px] text-slate-600 hidden sm:block">
            ID:SYNAPSE-CORE-{Math.floor(districtIdx * 1337 + 9001)}
          </span>
        </div>

        {/* Center: scroll progress */}
        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <span className="font-orbitron text-[7px] text-slate-600">PROGRESS</span>
          <div className="w-20 sm:w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ width: `${scrollPercent}%`, background: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
            />
          </div>
          <span className="font-orbitron text-[7px]" style={{ color: accentColor }}>
            {Math.round(scrollPercent)}%
          </span>
        </div>

        {/* Right: time + district */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[7px] sm:text-[8px] text-slate-500 hidden sm:block">{time}</span>
          <span className="font-orbitron text-[7px] sm:text-[8px] font-bold" style={{ color: accentColor }}>
            {districtNames[districtIdx]}
          </span>
        </div>
      </div>

      {/* ── Glitch flash ── */}
      <AnimatePresence>
        {glitch && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className="absolute inset-0"
            style={{ background: `${accentColor}04`, mixBlendMode: 'screen' }}
          />
        )}
      </AnimatePresence>

      {/* ── CLASSIFIED watermark ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-35deg] pointer-events-none hidden 2xl:block">
        <span className="font-orbitron font-black text-[80px] tracking-[0.3em] opacity-[0.015] text-white select-none">
          CLASSIFIED
        </span>
      </div>

      {/* ── Left edge — vertical data strip ── */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2 items-center">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent"
          style={{ background: `linear-gradient(to bottom, transparent, ${accentColor}40, transparent)` }} />
        {['01', '02', '03', '04', '05', '06', '07', '08'].map((n, i) => (
          <div key={n} className="font-orbitron text-[6px] font-bold transition-all duration-500"
            style={{ color: i === districtIdx ? accentColor : 'rgba(255,255,255,0.12)' }}>
            {n}
          </div>
        ))}
        <div className="w-[1px] h-16"
          style={{ background: `linear-gradient(to bottom, ${accentColor}40, transparent)` }} />
      </div>

      {/* ── Security district: alert flash ── */}
      <AnimatePresence>
        {districtIdx === 3 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: [0, 0.06, 0] }} exit={{ opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{ background: 'rgba(239,68,68,0.08)', pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
