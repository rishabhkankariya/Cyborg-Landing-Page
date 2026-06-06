import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Layers, Activity, Zap } from 'lucide-react';

export default function CoreSection() {
  const [typedCode, setTypedCode] = useState('');
  const [compilerLogs, setCompilerLogs] = useState([]);
  const [compileState, setCompileState] = useState('idle');

  const fullCode = `#include <stdio.h>

int main() {
    initialize_neural_core();
    launch_protocol();
    return 0;
}`;

  useEffect(() => {
    if (compileState !== 'typing') return;
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullCode.length) {
        setTypedCode(fullCode.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setCompileState('compiling');
        let logIndex = 0;
        const logs = [
          'gcc -O3 -Wall cybercore.c -o system_launcher',
          'Linking modules: libneuro_sync.so',
          'SUCCESS: Core initialized at 0x7FFF8A3C.',
          'Ready for transmission.'
        ];
        const compilerInterval = setInterval(() => {
          if (logIndex < logs.length) {
            setCompilerLogs((prev) => [...prev, logs[logIndex]]);
            logIndex++;
          } else {
            clearInterval(compilerInterval);
            setCompileState('success');
          }
        }, 350);
      }
    }, 30);
    return () => clearInterval(typingInterval);
  }, [compileState]);

  const handleCompileTrigger = () => {
    if (compileState !== 'idle' && compileState !== 'success') return;
    setTypedCode('');
    setCompilerLogs([]);
    setCompileState('typing');
  };

  const processors = [
    { title: 'Memory', icon: <Layers className="w-3.5 h-3.5 text-neon-cyan" />, spec: '0.0ms Lag' },
    { title: 'Hardware', icon: <Cpu className="w-3.5 h-3.5 text-neon-purple" />, spec: 'Ring-0 Mode' },
    { title: 'Performance', icon: <Zap className="w-3.5 h-3.5 text-neon-pink" />, spec: '1,200 PFLOPS' },
    { title: 'Real-Time', icon: <Activity className="w-3.5 h-3.5 text-neon-cyan" />, spec: 'Vector Bus' },
  ];

  return (
    <div className="w-full flex flex-col gap-2 text-left pointer-events-auto">
      {/* Terminal Panel */}
      <div className="flex flex-col bg-cyber-dark border border-neon-cyan/20 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.07)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neon-cyan/15 px-3 py-2 bg-slate-950/60">
          <div className="flex items-center gap-1.5 font-orbitron text-[9px] text-neon-cyan font-bold">
            <Terminal className="w-3 h-3" />
            <span>C_CORE_COMPILER</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500/80" />
            <span className="w-2 h-2 rounded-full bg-yellow-400/80" />
            <span className="w-2 h-2 rounded-full bg-green-400/80" />
          </div>
        </div>

        {/* Code area — compact height */}
        <div className="relative bg-slate-950 h-[90px] sm:h-[105px] p-3 font-mono text-[10px] sm:text-[11px] text-cyan-300 overflow-y-auto">
          <pre className="whitespace-pre-wrap leading-relaxed select-all">
            {typedCode}
            {compileState === 'typing' && (
              <span className="w-[5px] h-3 bg-cyan-300 inline-block align-middle ml-0.5 animate-pulse" />
            )}
          </pre>
          {compileState === 'idle' && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm">
              <button
                onClick={handleCompileTrigger}
                className="clip-cyber-btn border border-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan/25 text-neon-cyan px-4 py-2 font-orbitron font-bold text-[8px] sm:text-[9px] tracking-widest transition-all cursor-pointer active:scale-95 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
              >
                COMPILE PROTOCOL CODE
              </button>
            </div>
          )}
        </div>

        {/* Console log — compact */}
        <div className="bg-slate-900 border-t border-slate-800 px-3 py-2 font-mono text-[8px] sm:text-[9px] text-green-400 h-[52px] overflow-y-auto space-y-0.5">
          {compilerLogs.map((log, idx) => (
            <div key={idx} className="leading-relaxed">
              <span className="text-neon-cyan/40 font-bold">&gt;</span>{' '}
              <span className={log.startsWith('SUCCESS:') ? 'text-green-300 font-bold' : log.startsWith('gcc') ? 'text-cyan-300 font-bold' : 'text-slate-300'}>
                {log}
              </span>
            </div>
          ))}
          {compileState === 'compiling' && (
            <div className="flex items-center gap-1 animate-pulse text-slate-500 font-bold">
              <span>compiling</span>
              <span className="w-1 h-2.5 bg-green-400 inline-block align-middle" />
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/60 border-t border-slate-800 text-[7px] sm:text-[8px] font-orbitron text-slate-500">
          <span>STATE: <span className="text-neon-cyan">{compileState.toUpperCase()}</span></span>
          {compileState === 'success' && (
            <button onClick={handleCompileTrigger} className="text-neon-cyan hover:text-white transition-colors uppercase font-bold tracking-widest cursor-pointer">
              Re-Compile
            </button>
          )}
        </div>
      </div>

      {/* Processor cards — 2 per row always, compact */}
      <div className="grid grid-cols-2 gap-1.5 w-full">
        {processors.map((p, index) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            className="p-2 sm:p-2.5 rounded-lg border border-neon-cyan/15 bg-cyber-dark/80 backdrop-blur-md flex items-center gap-2 hover:border-neon-cyan/40 transition-all duration-200"
          >
            <div className="p-1 bg-slate-800 border border-slate-700 rounded shrink-0">
              {p.icon}
            </div>
            <div className="min-w-0">
              <div className="font-orbitron font-black text-[8px] sm:text-[9px] text-white truncate">{p.title}</div>
              <div className="font-orbitron text-[7px] sm:text-[8px] font-bold text-neon-cyan truncate">{p.spec}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
