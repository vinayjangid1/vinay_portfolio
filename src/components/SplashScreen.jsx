import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import HoverPaintBrand from './HoverPaintBrand'
import data from '../data.json'

/**
 * Full-screen splash with big FLUTTER / FULL STACK DEVELOPER hover paint.
 */
export default function SplashScreen({ onDone, duration = 3200 }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let raf

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      setProgress(t)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        onDone?.()
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration, onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#000000]"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Soft atmosphere */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-1/4 h-[50vh] w-[50vh] rounded-full bg-[#ff6b00]/15 blur-[100px]"
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 bottom-1/4 h-[45vh] w-[45vh] rounded-full bg-white/5 blur-[90px]"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex w-full flex-col items-center px-4"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-6 font-display text-sm font-semibold tracking-[0.35em] text-[#ff6b00] uppercase md:mb-8"
        >
          {data.name}
        </motion.p>

        <HoverPaintBrand variant="splash" hint={false} />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-6 text-xs tracking-[0.28em] text-[#a3a3a3] uppercase md:mt-8"
        >
          Hover to paint · iOS · Full Stack
        </motion.p>

        {/* Progress */}
        <div className="mt-10 w-full max-w-xs md:mt-14">
          <div className="h-[2px] overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full origin-left rounded-full bg-[#ff6b00]"
              style={{ scaleX: progress }}
            />
          </div>
          <p className="mt-3 text-center text-[10px] tracking-[0.2em] text-[#a3a3a3] uppercase">
            Loading portfolio
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
