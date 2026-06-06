import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Terminal, RefreshCw, X, ShieldAlert, ChevronRight } from 'lucide-react';
import CustomCursor from './components/CustomCursor';
import City3DScene from './components/City3DScene';
import IntroLoader from './components/IntroLoader';
import Navbar from './components/Navbar';
import CoreSection from './sections/CoreSection';
import InteractiveTerminal from './components/InteractiveTerminal';
import HUDOverlay from './components/HUDOverlay';

function App() {
  const [bootCompleted, setBootCompleted] = useState(false);
  const [modelProgress, setModelProgress] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeDistrictIdx, setActiveDistrictIdx] = useState(0);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncLogs, setSyncLogs] = useState([]);
  const [syncCompleted, setSyncCompleted] = useState(false);

  const triggerSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncCompleted(false);
    setSyncLogs(['[SYS_INIT] Requesting operator neural handshake...']);
  };

  useEffect(() => {
    if (!isSyncing || syncCompleted) return;
    const syncSteps = [
      { progress: 20, log: '[HANDSHAKE] Scanning user biometric ocular array: OK' },
      { progress: 40, log: '[HANDSHAKE] Verifying carbon memory coherence: 99.9%' },
      { progress: 60, log: '[ALLOCATION] Injecting micro-graphene nodes...' },
      { progress: 80, log: '[COMPILER] Binding C_CORE register maps...' },
      { progress: 95, log: '[SECURITY] Syncing cryptographic firewall: ACTIVE' },
      { progress: 100, log: '[SUCCESS] Neural synchronization established.' }
    ];
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < syncSteps.length) {
        const step = syncSteps[stepIdx];
        setSyncProgress(step.progress);
        setSyncLogs((prev) => [...prev, step.log]);
        stepIdx++;
        if (step.progress === 100) { clearInterval(interval); setTimeout(() => setSyncCompleted(true), 500); }
      }
    }, 800);
    return () => clearInterval(interval);
  }, [isSyncing, syncCompleted]);

  useEffect(() => {
    if (!bootCompleted) return;
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollPercent(pct);
      setActiveDistrictIdx(Math.min(7, Math.floor(pct / 12.5)));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [bootCompleted]);

  const districts = [
    { id: 'boot',     name: 'DISTRICT 01', status: 'RUNTIME ACTIVE', title: 'CYBERCORE CITY', subtitle: 'A city powered entirely by code.', desc: 'Digital systems initializing. Core grid sync active. Scroll to travel through the city parameters inside your self-driving cyber truck.' },
    { id: 'code',     name: 'DISTRICT 02', status: 'KERNEL STABLE', title: 'C LANGUAGE CORE', subtitle: 'Low-level protocols driving machine hardware.', desc: 'The truck enters a sector surrounded by giant holographic C code projections.', items: ['Programming', 'Embedded Systems', 'Operating Systems', 'Performance'] },
    { id: 'ai',       name: 'DISTRICT 03', status: 'COGNITIVE SYNC', title: 'NEURAL CONSCIOUSNESS', subtitle: 'Self-governing artificial neural matrices.', desc: 'Passing giant neural network towers. Orbiting AI data packets sync with direct memory buffers.', items: ['Artificial Intelligence', 'Machine Learning', 'Neural Computing', 'Autonomous Systems'] },
    { id: 'security', name: 'DISTRICT 04', status: 'FIREWALL ACTIVE', title: 'SYNAPTIC SHIELD', subtitle: 'Laser scanning defense channels.', desc: 'Local anti-intrusion protocols scanning the chassis. Network shields blocking memory trace injects.', items: ['Threat Detection', 'Encryption', 'Network Defense', 'Cyber Warfare'] },
    { id: 'graphics', name: 'DISTRICT 05', status: 'RASTER ENGINE OK', title: 'GPU ACCELERATED', subtitle: 'Real-time ray tracing shaders.', desc: 'Buildings translating meshes in real-time. High fidelity reflections bouncing off wet streets.', items: ['3D Rendering', 'Ray Tracing', 'Physics Simulation', 'Game Engines'] },
    { id: 'robotics', name: 'DISTRICT 06', status: 'FABRICATION READY', title: 'AUTONOMOUS ASSEMBLY', subtitle: 'Mechanical chassis fabrication.', desc: 'Industrial robotic arms welding structures. Low-latency instructions synchronizing mechanical joints.', items: ['Robotics', 'Automation', 'Industrial AI', 'Human-Machine Collab'] },
    { id: 'quantum',  name: 'DISTRICT 07', status: 'COHERENCE MAX', title: 'QUANTUM CORE REACTOR', subtitle: 'Quantum entanglement systems.', desc: 'The core reactor powers the city. Operational statistics running at full metrics:', stats: [{ label: 'DEVICES SYNCED', value: '100M+' }, { label: 'COHERENCE', value: '99.999%' }, { label: 'LATENCY', value: '1ms' }, { label: 'SCALABILITY', value: '∞' }] },
    { id: 'future',   name: 'DISTRICT 08', status: 'EVOLUTION READY', title: 'THE FUTURE IS CODE', subtitle: 'Seize your place in the digital evolution.', desc: 'The truck reaches an elevated platform overlooking the city. Unlock your access code below.', cta: 'ENTER THE NEXT ERA' }
  ];

  const d = districts[activeDistrictIdx];

  return (
    <>
      <AnimatePresence mode="wait">
        {!bootCompleted && (
          <IntroLoader onComplete={() => setBootCompleted(true)} progressOverride={modelProgress} />
        )}
      </AnimatePresence>

      {bootCompleted && (
        <div className="relative w-full h-[800vh] bg-cyber-black text-slate-100 selection:bg-neon-cyan/30 selection:text-white">

          <City3DScene scrollPercent={scrollPercent} onProgress={setModelProgress} />
          <CustomCursor />
          <Navbar onSyncClick={triggerSync} />
          <HUDOverlay districtIdx={activeDistrictIdx} scrollPercent={scrollPercent} />



          {/* ── District content overlay ── */}
          <div className="fixed inset-0 z-20 pointer-events-none flex items-start justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDistrictIdx}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={{ pointerEvents: 'auto' }}
                className="
                  flex flex-col gap-3
                  w-[90vw] max-w-[340px]
                  sm:w-[380px] sm:max-w-none
                  md:w-[420px]
                  lg:w-[460px]
                  xl:w-[520px]
                  2xl:w-[580px]
                  max-h-[calc(100vh-56px)] overflow-y-auto
                  mt-14 ml-4
                  sm:mt-16 sm:ml-6
                  md:mt-[72px] md:ml-10
                  lg:ml-14
                  xl:ml-16
                  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                  pb-6
                "
              >
                {/* District badge */}
                <div className="inline-flex items-center gap-2 py-1 px-2.5 rounded
                  bg-cyber-dark/85 border border-neon-cyan/30 backdrop-blur-md
                  font-orbitron text-[8px] sm:text-[9px] font-bold text-neon-cyan uppercase tracking-widest
                  shadow-[0_0_12px_rgba(34,211,238,0.12)] w-fit shrink-0">
                  <span className="w-1 h-1 rounded-full bg-neon-cyan shadow-[0_0_4px_#22d3ee] animate-pulse" />
                  {d.name} — {d.status}
                </div>

                {/* ── Main headline ── */}
                <h1 className="
                  font-orbitron font-black leading-[1.1] tracking-tight text-white
                  text-2xl sm:text-3xl lg:text-4xl
                  [text-shadow:0_0_30px_rgba(34,211,238,0.4),0_2px_4px_rgba(0,0,0,0.8)]
                  shrink-0
                ">
                  {d.title}
                </h1>

                {/* Subtitle */}
                <p className="font-orbitron font-bold text-[9px] sm:text-[10px] text-neon-purple uppercase tracking-widest shrink-0
                  [text-shadow:0_0_12px_rgba(168,85,247,0.5)]">
                  {d.subtitle}
                </p>

                {/* Description — subtle bg for readability */}
                <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed shrink-0
                  bg-cyber-dark/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/5">
                  {d.desc}
                </p>

                {/* Feature items */}
                {d.items && (
                  <div className="grid grid-cols-2 gap-1.5 shrink-0">
                    {d.items.map((item, i) => (
                      <div key={i}
                        className="flex items-center gap-1.5 px-2.5 py-2
                          bg-cyber-dark/75 border border-neon-cyan/15 rounded-lg backdrop-blur-sm
                          font-orbitron font-bold text-[8px] sm:text-[9px] text-slate-200 uppercase tracking-wide
                          hover:border-neon-cyan/40 hover:bg-cyber-dark/90 transition-all duration-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_5px_#22d3ee] shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* District 2 — C Compiler */}
                {d.id === 'code' && (
                  <div className="pointer-events-auto shrink-0">
                    <CoreSection />
                  </div>
                )}

                {/* District 7 — Stats */}
                {d.stats && (
                  <div className="grid grid-cols-2 gap-2 shrink-0">
                    {d.stats.map((stat, i) => (
                      <div key={i}
                        className="p-3 bg-cyber-dark/80 border border-neon-cyan/20 rounded-lg backdrop-blur-sm">
                        <div className="font-orbitron font-black text-lg sm:text-xl text-neon-cyan
                          [text-shadow:0_0_12px_rgba(34,211,238,0.6)]">
                          {stat.value}
                        </div>
                        <div className="text-[8px] sm:text-[9px] font-bold font-orbitron text-slate-400 tracking-wider mt-0.5">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* District 8 — CTA */}
                {d.id === 'future' && (
                  <div className="flex flex-col gap-3 pointer-events-auto shrink-0">
                    <button
                      onClick={triggerSync}
                      className="clip-cyber-btn border border-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan/25
                        text-neon-cyan font-orbitron font-bold tracking-widest
                        px-6 py-3 text-[10px] sm:text-xs
                        transition-all active:scale-95 cursor-pointer
                        flex items-center gap-2 group w-fit
                        shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_35px_rgba(34,211,238,0.4)]"
                    >
                      {d.cta}
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="w-full">
                      <InteractiveTerminal />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Neural Handshake Modal ── */}
          <AnimatePresence>
            {isSyncing && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="glass-panel-cyan rounded-2xl p-5 sm:p-7 max-w-sm sm:max-w-md w-full relative overflow-hidden text-left shadow-[0_0_60px_rgba(34,211,238,0.15)]"
                >
                  <div className="absolute inset-0 scanlines opacity-[0.04] pointer-events-none" />
                  <button
                    onClick={() => setIsSyncing(false)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-neon-cyan transition-colors cursor-pointer p-1"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <div className="flex items-center gap-3 mb-5">
                    <RefreshCw className={`w-5 h-5 text-neon-cyan ${!syncCompleted ? 'animate-spin' : ''}`} />
                    <span className="font-orbitron font-black text-sm sm:text-base tracking-wider text-white [text-shadow:0_0_15px_rgba(34,211,238,0.5)]">
                      NEURAL HANDSHAKE
                    </span>
                  </div>

                  <div className="mb-5">
                    <div className="flex justify-between font-orbitron text-[9px] font-bold text-slate-400 mb-2">
                      <span>TRANSMISSION PROGRESS</span>
                      <span className={syncCompleted ? 'text-neon-cyan' : 'text-neon-purple'}>{syncProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 border border-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                        style={{ width: `${syncProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[9px] sm:text-[10px] text-green-400 h-[120px] sm:h-[150px] overflow-y-auto space-y-1.5 shadow-inner">
                    {syncLogs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed break-words">
                        <span className="text-neon-cyan/50 font-bold">&gt;</span> {log}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-slate-700/50 pt-4">
                    <AnimatePresence mode="wait">
                      {syncCompleted ? (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <ShieldCheck className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <div className="text-[9px] text-slate-200">
                            <span className="font-bold text-green-400 uppercase tracking-widest block mb-0.5">NEURAL LINK ALIGNED</span>
                            Synchronization complete. Cybercore OS initialized.
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="flex items-start gap-3 p-3 bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg">
                          <ShieldAlert className="w-4 h-4 text-neon-cyan animate-pulse shrink-0 mt-0.5" />
                          <div className="text-[9px] text-slate-300">
                            <span className="font-bold text-neon-cyan uppercase tracking-widest block mb-0.5">HANDSHAKE PENDING</span>
                            Verifying node pathways. Keep biological receiver active.
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {syncCompleted && (
                    <motion.button
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      onClick={() => setIsSyncing(false)}
                      className="w-full mt-4 clip-cyber-btn border border-green-400/50 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-orbitron font-bold tracking-widest text-[10px] py-3 transition-all active:scale-[0.98] cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    >
                      ENTER CYBERCORE
                    </motion.button>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

export default App;
