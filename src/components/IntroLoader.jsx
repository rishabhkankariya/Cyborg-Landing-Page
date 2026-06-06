import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal } from 'lucide-react';

export default function IntroLoader({ onComplete, progressOverride = 0 }) {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('booting');

  const progressOverrideRef = useRef(progressOverride);
  useEffect(() => {
    progressOverrideRef.current = progressOverride;
  }, [progressOverride]);

  useEffect(() => {
    if (progressOverride === 100) {
      setProgress(100);
    } else if (progressOverride > 0) {
      setProgress((prev) => Math.max(prev, Math.round(progressOverride)));
    }
  }, [progressOverride]);

  const bootLogs = [
    'gcc -O3 -march=native cybercore.c -o protocols/cybercore',
    'INIT: Target architecture detected: x86_64-quantum-neural',
    'LOAD: Parsing C_CORE kernel symbols...',
    'SYNC: Initializing sub-dermal transceiver links...',
    'WARN: High cognitive latency detected on node #19. Re-routing path.',
    'LOAD: Loading dynamic shared library: libsynapse_fw.so (v9.8)',
    'EXEC: Running boot checks for C PROTOCOL C_2090...',
    'OK: Neural linkage handshake established (2.4 TB/S).',
    'OK: Central hardware firewall deployed (AES-256-Q).',
    'OK: AI Core synchronized: [STABLE].'
  ];

  useEffect(() => {
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < bootLogs.length) {
        const nextLog = bootLogs[logIndex];
        setLogs((prev) => [...prev, nextLog]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 280);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const currentOverride = progressOverrideRef.current;
        const isModelLoading = currentOverride > 0 && currentOverride < 100;
        const cap = isModelLoading ? 95 : 100;

        if (prev >= cap) {
          if (cap === 100) {
            clearInterval(progressInterval);
          }
          return prev;
        }

        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next >= cap) {
          if (cap === 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return cap;
        }
        return next;
      });
    }, 120);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[999999] bg-[#080d1a] flex flex-col items-center justify-center p-4 sm:p-6 text-left"
    >
      {/* Neon scanline & grids */}
      <div className="absolute inset-0 scanlines opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-[0.02] pointer-events-none" />

      {/* Central Console Frame */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-cyber-dark border border-neon-cyan/20 p-5 sm:p-8 rounded-xl sm:rounded-2xl relative overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.1)]"
      >
        {/* Holographic scanner laser line */}
        <motion.div
          animate={{ translateY: [-200, 200] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', repeatType: 'reverse' }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_15px_#22c55e] pointer-events-none"
        />

        {/* Header branding */}
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-3 mb-4 sm:pb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-neon-cyan animate-pulse" />
            <span className="font-orbitron font-black text-xs sm:text-sm tracking-widest text-white">
              CYBERCORE PROTOCOL v1.0
            </span>
          </div>
          <span className="font-mono text-[8px] sm:text-[9px] text-slate-500 hidden sm:block">ID: SECURE_CORE_BOOT</span>
        </div>

        {/* Logger lines output */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 sm:p-5 font-mono text-[9px] sm:text-[11px] text-green-400 h-[160px] sm:h-[220px] overflow-y-auto space-y-2 sm:space-y-2.5 shadow-inner text-left">
          {logs.map((log, idx) => (
            <div key={idx} className="leading-relaxed break-all">
              <span className="text-neon-cyan/40 font-bold font-orbitron">&gt;</span>{' '}
              <span className={log.startsWith('gcc') ? 'text-cyan-300 font-bold' : log.startsWith('OK:') ? 'text-green-300' : log.startsWith('WARN:') ? 'text-neon-pink font-bold' : 'text-slate-300'}>
                {log}
              </span>
            </div>
          ))}
          {progress < 100 && (
            <div className="flex items-center gap-1.5 animate-pulse text-slate-500">
              <span>&gt; compiling system dependencies</span>
              <span className="w-1.5 h-3 bg-green-500 inline-block align-middle" />
            </div>
          )}
        </div>

        {/* Bottom Progress Bar block */}
        <div className="mt-5 sm:mt-8 text-left">
          <div className="flex justify-between font-orbitron text-[8px] sm:text-[10px] font-bold text-slate-500 mb-2">
            <span>LOAD STATUS</span>
            <span className="text-neon-cyan">{progress}%</span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-slate-800 border border-slate-700 rounded-full overflow-hidden p-0.5 relative">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple shadow-[0_0_8px_rgba(34,211,238,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* System ready output banner */}
        <div className="mt-4 sm:mt-6 flex justify-between items-center text-[8px] sm:text-[9px] font-orbitron text-slate-500 border-t border-slate-700/50 pt-3 sm:pt-4 text-left">
          <span>STATUS: {progress >= 100 ? 'BOOT COMPLETED' : 'BOOTING CORE SERVICES'}</span>
          <span>HOST: LOCALHOST</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
