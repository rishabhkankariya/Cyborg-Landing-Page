import { useState, useEffect } from 'react';
import { Menu, X, Cpu, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onSyncClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Boot', index: 0 },
    { name: 'Code', index: 1 },
    { name: 'AI', index: 2 },
    { name: 'Security', index: 3 },
    { name: 'Graphics', index: 4 },
    { name: 'Robotics', index: 5 },
    { name: 'Quantum', index: 6 },
    { name: 'Future', index: 7 },
  ];

  const scrollTo = (idx) => {
    window.scrollTo({ top: idx * window.innerHeight, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cyber-dark/85 backdrop-blur-md border-b border-neon-cyan/15 py-2 sm:py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-3 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 group shrink-0">
          <div className="relative">
            <Cpu className="w-6 h-6 sm:w-8 sm:h-8 text-neon-cyan group-hover:text-neon-purple transition-colors duration-300" />
            <div className="absolute inset-0 bg-neon-cyan/20 blur-md rounded-full group-hover:bg-neon-purple/20 transition-all duration-300" />
          </div>
          <span className="font-orbitron font-black text-sm sm:text-base md:text-xl tracking-wider bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent">
            SYNAPSE_CORE
          </span>
        </a>

        {/* Desktop Nav — lg+ */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <ul className="flex items-center gap-4 xl:gap-6 font-orbitron text-xs text-slate-400">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => scrollTo(item.index)}
                  className="hover:text-neon-cyan transition-colors duration-200 relative group py-1 tracking-wider uppercase cursor-pointer"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-neon-cyan to-neon-blue transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={onSyncClick}
            className="clip-cyber-btn border border-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan font-orbitron font-bold text-[10px] xl:text-xs tracking-wider px-4 xl:px-5 py-2 xl:py-2.5 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] active:scale-95 whitespace-nowrap cursor-pointer"
          >
            SYNC NEURAL LINK
          </button>
        </div>

        {/* Mobile / Tablet Controls — below lg */}
        <div className="lg:hidden flex items-center gap-2 sm:gap-3">
          <button
            onClick={onSyncClick}
            className="border border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan p-1.5 sm:p-2 rounded hover:bg-neon-cyan/20 active:scale-95 transition-all"
            title="Sync Neural Link"
          >
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-300 hover:text-neon-cyan transition-colors duration-200 p-1"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7" /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden absolute top-full left-0 w-full bg-cyber-dark/98 border-b border-neon-cyan/15 backdrop-blur-xl overflow-hidden shadow-2xl"
          >
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              {/* 2-col grid for nav items on mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-4">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => { setIsOpen(false); scrollTo(item.index); }}
                    className="text-center py-2 px-3 font-orbitron text-[10px] sm:text-xs text-slate-300 hover:text-neon-cyan hover:bg-neon-cyan/5 border border-slate-700/50 hover:border-neon-cyan/30 rounded transition-all uppercase tracking-wider cursor-pointer"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setIsOpen(false); onSyncClick(); }}
                className="w-full clip-cyber-btn border border-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan font-orbitron font-bold tracking-widest text-[10px] sm:text-xs py-2.5 transition-all duration-300 cursor-pointer"
              >
                SYNC NEURAL LINK
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
