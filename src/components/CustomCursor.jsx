import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position of the mouse
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring configuration for the outer ring
  const springConfig = { damping: 30, stiffness: 250, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable custom cursor on desktop devices with fine pointers
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (isMobile) return;

    setIsVisible(true);

    const moveCursor = (e) => {
      mouseX.set(e.clientX - 4); // offset half of dot width (8px)
      mouseY.set(e.clientY - 4);
    };

    const handleMouseOver = (e) => {
      // Find out if the target is interactive
      const target = e.target;
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive-card') ||
        target.classList.contains('cursor-pointer');

      setHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    // Hide original cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-neon-cyan pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-37.5%',
          translateY: '-37.5%',
        }}
        animate={{
          scale: hovered ? 1.6 : 1,
          borderColor: hovered ? '#ec4899' : '#06b6d4', // Pink on hover, cyan otherwise
          backgroundColor: hovered ? 'rgba(236, 72, 153, 0.1)' : 'rgba(6, 182, 212, 0.03)',
          boxShadow: hovered 
            ? '0 0 15px rgba(236, 72, 153, 0.6)' 
            : '0 0 10px rgba(6, 182, 212, 0.3)',
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.2 }}
      />

      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-neon-cyan rounded-full pointer-events-none z-[9999] shadow-[0_0_8px_#06b6d4]"
        style={{
          x: mouseX,
          y: mouseY,
        }}
        animate={{
          scale: hovered ? 0.5 : 1,
          backgroundColor: hovered ? '#ec4899' : '#06b6d4',
        }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
}
