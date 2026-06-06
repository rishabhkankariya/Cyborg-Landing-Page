import { useState, useEffect, useRef } from 'react';
import { Terminal, Send, ShieldAlert, Cpu } from 'lucide-react';

export default function InteractiveTerminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'sys', text: 'CYBERCORE CLI v4.50' },
    { type: 'sys', text: 'Type "help" to view diagnostic protocols.' },
    { type: 'sys', text: 'STATUS: WAITING_FOR_OPERATOR_SIGNATURE...' }
  ]);

  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    // Append user input line
    setHistory((prev) => [...prev, { type: 'user', text: `> ${input}` }]);
    setInput('');

    // Simulated terminal response delay
    setTimeout(() => {
      let responses = [];

      switch (cmd) {
        case 'help':
          responses = [
            { type: 'sys', text: 'SUPPORTED PROTOCOLS:' },
            { type: 'info', text: '  status   - Inspect local CPU system parameters.' },
            { type: 'info', text: '  connect  - Hook up to remote Cybercore network nodes.' },
            { type: 'info', text: '  scan     - Initiate multi-spectral bio-matrix sectors scan.' },
            { type: 'info', text: '  activate - Lock down synaptic compiler matrices.' },
            { type: 'info', text: '  launch   - Boot the primary C Protocol Core.' },
            { type: 'info', text: '  help     - Show details on command structures.' }
          ];
          break;

        case 'status':
          responses = [
            { type: 'sys', text: 'SYS DIAGNOSTIC SCAN SUMMARY:' },
            { type: 'info', text: '  CPU LOAD         : 14.8% (Liquid nitrogen cooling loop: STABLE)' },
            { type: 'info', text: '  NEURAL INTEGRATION: 98.4% (Graphene mesh active)' },
            { type: 'info', text: '  SECURITY STATE   : FIREWALL SECURED (AES-256)' },
            { type: 'info', text: '  OS RUNTIME ENGINE: CYBERCORE_OS-v4.9-RELEASE' },
            { type: 'info', text: '  HARDWARE CORE    : C PROTOCOL ENGINE v9.0' }
          ];
          break;

        case 'connect':
          responses = [
            { type: 'sys', text: 'CONNECTING TO MATRIX HUB...' },
            { type: 'info', text: '  Requesting secure channel handshake...' },
            { type: 'info', text: '  Handshake response: SUCCESS.' },
            { type: 'success', text: '  SECURE SESSION INSTANTIATED ON GATEWAY: PORT-4492.' }
          ];
          break;

        case 'scan':
          responses = [
            { type: 'sys', text: 'SCANNING QUANTUM GRID SECTORS...' },
            { type: 'info', text: '  Sector 01: [SECURE] - Ground telemetry: STABLE' },
            { type: 'warn', text: '  Sector 02: [AI_OVERLOAD] - Cognitive load high' },
            { type: 'info', text: '  Sector 03: [SECURE] - Neural grid active' },
            { type: 'success', text: '  GLOBAL ACCURACY INDEX: 99.999% COHERENCY.' }
          ];
          break;

        case 'activate':
          responses = [
            { type: 'warn', text: 'WARNING: Initializing Synaptic Compiler matrix...' },
            { type: 'info', text: '  Injecting micro-graphene nodes...' },
            { type: 'success', text: '  SYSTEM INTEGRATION PROTOCOLS: LOCKED & ONLINE.' }
          ];
          break;

        case 'launch':
          responses = [
            { type: 'sys', text: 'gcc -O3 cybercore.c -o protocols/cybercore' },
            { type: 'info', text: '  Compiling code block target...' },
            { type: 'info', text: '  #include <stdio.h> inside neuro-core' },
            { type: 'info', text: '  Linking binary nodes...' },
            { type: 'success', text: '  C PROTOCOL LAUNCHED. SYSTEM ENTRANCE GRANTED.' }
          ];
          break;

        default:
          responses = [
            { type: 'error', text: `ERROR: "${cmd}" is not a recognized protocol.` },
            { type: 'info', text: 'Type "help" to list valid diagnostic commands.' }
          ];
      }

      setHistory((prev) => [...prev, ...responses]);
    }, 250);
  };

  return (
    <div className="glass-panel border-slate-800 p-6 rounded-2xl flex flex-col h-[400px] shadow-2xl relative overflow-hidden text-left bg-slate-950/60">
      {/* HUD diagnostic details */}
      <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-4 text-slate-400 font-orbitron text-xs font-bold justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-neon-cyan" />
          <span>CYBERCORE OS OPERATOR MAIN CONSOLE</span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono">PORT: 9022</span>
      </div>

      {/* Terminal logs scrolling */}
      <div className="flex-grow bg-slate-950/90 border border-slate-900/60 rounded-lg p-4 font-mono text-xs overflow-y-auto space-y-2.5 custom-scrollbar shadow-inner text-green-500">
        {history.map((log, idx) => {
          let colorClass = 'text-green-500';
          if (log.type === 'user') colorClass = 'text-neon-cyan font-bold';
          if (log.type === 'warn') colorClass = 'text-yellow-500 font-bold';
          if (log.type === 'error') colorClass = 'text-neon-pink font-bold animate-pulse';
          if (log.type === 'success') colorClass = 'text-green-400 font-bold';
          if (log.type === 'info') colorClass = 'text-slate-300';
          
          return (
            <div key={idx} className={`leading-relaxed break-words ${colorClass}`}>
              {log.text}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Input Action Form */}
      <form onSubmit={handleCommandSubmit} className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ENTER PROTOCOL COMMAND..."
          className="flex-grow bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs font-mono text-neon-cyan focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all uppercase placeholder-slate-700"
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          className="clip-cyber-btn border border-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan/25 text-neon-cyan px-4 flex items-center justify-center transition-all cursor-pointer active:scale-95"
          title="Send Protocol"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
