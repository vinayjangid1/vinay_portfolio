import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Signal,
  BatteryFull,
  Wifi,
  Aperture,
  Gauge,
  Layers,
} from 'lucide-react'

/**
 * Uses the provided iPhone frame asset with content + interactive Dynamic Island.
 */
export default function IPhoneSimulator({ demo, demos = [], activeIndex = 0 }) {
  const [islandOpen, setIslandOpen] = useState(false)
  const [islandMode, setIslandMode] = useState('idle')

  useEffect(() => {
    setIslandMode('compact')
    const t = setTimeout(() => setIslandMode('idle'), 2200)
    return () => clearTimeout(t)
  }, [demo?.id])

  const toggleIsland = () => {
    if (islandOpen) {
      setIslandOpen(false)
      setIslandMode('idle')
    } else {
      setIslandOpen(true)
      setIslandMode('expanded')
    }
  }

  return (
    <div className="relative mx-auto w-[min(100%,290px)] select-none sm:w-[310px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[#ff6b00]/10 blur-3xl"
      />

      <div className="relative aspect-[218/439] w-full">
        <div
          className="absolute overflow-hidden bg-[#050505]"
          style={{
            top: '2.4%',
            bottom: '2.4%',
            left: '6.5%',
            right: '6.5%',
            borderRadius: '13% / 6%',
          }}
        >
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-[7%] pt-[3.2%] text-[10px] font-semibold text-white sm:text-[11px]">
            <span>9:41</span>
            <div className="flex items-center gap-1 opacity-90">
              <Signal size={11} />
              <Wifi size={11} />
              <BatteryFull size={13} />
            </div>
          </div>

          <div className="absolute inset-0 z-10 pt-[12%] pb-[6%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={demo?.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="flex h-full flex-col px-[6%]"
              >
                <PhoneScreen demo={demo} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-[2%] left-1/2 z-20 h-[3px] w-[32%] -translate-x-1/2 rounded-full bg-white/45" />
        </div>

        <img
          src="/iphone-frame.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 h-full w-full object-contain"
          draggable={false}
        />

        <div
          className="absolute left-1/2 z-40 -translate-x-1/2"
          style={{ top: '3.6%' }}
        >
          <motion.button
            type="button"
            aria-label="Toggle Dynamic Island"
            onClick={toggleIsland}
            layout
            className="relative overflow-hidden bg-black text-left text-white shadow-[0_4px_20px_rgba(0,0,0,0.45)]"
            animate={{
              width: islandOpen ? '72%' : islandMode === 'compact' ? 132 : 108,
              height: islandOpen ? 68 : 30,
              borderRadius: islandOpen ? 20 : 18,
              maxWidth: islandOpen ? 230 : 140,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ width: islandOpen ? 230 : undefined }}
          >
            <AnimatePresence mode="wait">
              {islandOpen ? (
                <motion.div
                  key="open"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col justify-center px-3.5 py-2"
                >
                  <p className="text-[10px] font-semibold text-white">
                    {demo?.island || 'iOS'}
                  </p>
                  <p className="mt-0.5 truncate text-[9px] text-white/55">
                    {demo?.islandDetail || 'Native Swift'}
                  </p>
                </motion.div>
              ) : islandMode === 'compact' ? (
                <motion.div
                  key="compact"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full items-center justify-between gap-2 px-3"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b00]" />
                  <span className="truncate text-[9px] font-medium text-white/85">
                    {demo?.island || 'iOS'}
                  </span>
                  <Aperture size={11} className="shrink-0 text-white/45" />
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  className="flex h-full items-center justify-center gap-2.5 px-3"
                >
                  <span className="h-[5px] w-[5px] rounded-full bg-[#222] ring-1 ring-white/10" />
                  <span className="h-[5px] w-7 rounded-full bg-[#222]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <div className="mt-5 flex justify-center gap-1.5">
        {demos.map((d, i) => (
          <span
            key={d.id}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex ? 'w-5 bg-[#ff6b00]' : 'w-1.5 bg-white/25'
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] tracking-wider text-[#a3a3a3] uppercase">
        Scroll locked · tap Dynamic Island
      </p>
    </div>
  )
}

function PhoneScreen({ demo }) {
  const id = demo?.id

  if (id === 'scroll') {
    return (
      <div className="flex h-full flex-col">
        <p className="text-[10px] font-medium tracking-widest text-[#ff6b00] uppercase">
          Scroll performance
        </p>
        <h4 className="mt-1 text-base font-bold text-white sm:text-lg">
          {demo.title}
        </h4>
        <div className="mt-3 flex-1 space-y-1.5 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2"
            >
              <span className="h-7 w-7 shrink-0 rounded-lg bg-[#ff6b00]/25" />
              <div className="min-w-0 flex-1">
                <div className="h-1.5 w-[70%] rounded bg-white/30" />
                <div className="mt-1.5 h-1 w-[45%] rounded bg-white/15" />
              </div>
            </motion.div>
          ))}
        </div>
        <p className="mt-2 text-[9px] text-white/50">Reuse · prefetch · 120Hz ready</p>
      </div>
    )
  }

  if (id === 'animation') {
    return (
      <div className="flex h-full flex-col">
        <p className="text-[10px] font-medium tracking-widest text-[#ff6b00] uppercase">
          Core Animation
        </p>
        <h4 className="mt-1 text-base font-bold text-white sm:text-lg">
          {demo.title}
        </h4>
        <div className="relative mt-4 flex flex-1 items-center justify-center">
          <motion.div
            className="absolute h-24 w-24 rounded-3xl border border-[#ff6b00]/40 bg-[#ff6b00]/15"
            animate={{ scale: [1, 1.08, 1], rotate: [0, 4, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute h-16 w-16 rounded-2xl bg-[#ff6b00]"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <p className="mt-2 text-[9px] text-white/50">
          Interruptible springs · matched curves
        </p>
      </div>
    )
  }

  if (id === 'polish') {
    return (
      <div className="flex h-full flex-col">
        <p className="text-[10px] font-medium tracking-widest text-[#ff6b00] uppercase">
          Release quality
        </p>
        <h4 className="mt-1 text-base font-bold text-white sm:text-lg">
          {demo.title}
        </h4>
        <div className="mt-4 space-y-2 font-mono text-[9px] text-white/70 sm:text-[10px]">
          <p className="text-emerald-400">✓ Memory graph clean</p>
          <p className="text-emerald-400">✓ Main thread &lt; 16ms</p>
          <p className="text-emerald-400">✓ Accessibility pass</p>
          <p className="text-white/40">$ xcodebuild archive</p>
        </div>
        <div className="mt-auto flex items-center gap-2 rounded-xl bg-white/5 p-2.5">
          <CheckCircle2 className="text-[#ff6b00]" size={16} />
          <span className="text-[11px] text-white/80">TestFlight → App Store</span>
        </div>
      </div>
    )
  }

  // performance (default)
  return (
    <div className="flex h-full flex-col">
      <p className="text-[10px] font-medium tracking-widest text-[#ff6b00] uppercase">
        iOS Native
      </p>
      <h4 className="mt-1 text-lg font-bold text-white sm:text-xl">
        {demo?.title || 'Native performance'}
      </h4>
      <p className="mt-1.5 text-[11px] leading-relaxed text-white/55">
        {demo?.subtitle}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          { icon: Gauge, label: '60fps' },
          { icon: Layers, label: 'SwiftUI' },
          { icon: Aperture, label: 'UIKit' },
          { icon: CheckCircle2, label: 'Instruments' },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-2 py-3 text-center"
          >
            <Icon size={14} className="text-[#ff6b00]" />
            <span className="text-[10px] font-medium text-white/85">{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto rounded-2xl bg-gradient-to-br from-[#ff6b00]/25 to-transparent p-3">
        <p className="text-[11px] font-semibold text-white">Performance you can feel</p>
        <p className="mt-1 text-[9px] text-white/55">
          Scroll · animation · Main Thread
        </p>
      </div>
    </div>
  )
}
