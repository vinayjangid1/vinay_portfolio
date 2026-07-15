import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  Camera,
  CheckCircle2,
  Cpu,
  Signal,
  BatteryFull,
  Wifi,
  Aperture,
  Sparkles,
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

  const screen = demo?.id || 'native-home'

  return (
    <div className="relative mx-auto w-[min(100%,290px)] select-none sm:w-[310px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[#ff6b00]/10 blur-3xl"
      />

      {/* Phone shell — matches cropped copper frame asset */}
      <div className="relative aspect-[218/439] w-full">
        {/* Screen content (behind frame, shows through transparent glass) */}
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
          {/* Status bar */}
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-[7%] pt-[3.2%] text-[10px] font-semibold text-white sm:text-[11px]">
            <span>9:41</span>
            <div className="flex items-center gap-1 opacity-90">
              <Signal size={11} />
              <Wifi size={11} />
              <BatteryFull size={13} />
            </div>
          </div>

          {/* App screens */}
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

          {/* Home indicator */}
          <div className="absolute bottom-[2%] left-1/2 z-20 h-[3px] w-[32%] -translate-x-1/2 rounded-full bg-white/45" />
        </div>

        {/* Frame image on top */}
        <img
          src="/iphone-frame.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 h-full w-full object-contain"
          draggable={false}
        />

        {/* Interactive Dynamic Island — sits over the frame’s island */}
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
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full items-center gap-2.5 px-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff6b00]/20 text-[#ff6b00]">
                    {screen === 'camera' ? (
                      <Camera size={16} />
                    ) : screen === 'ml' ? (
                      <Cpu size={16} />
                    ) : screen === 'ship' ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <Sparkles size={16} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-semibold sm:text-[11px]">
                      {demo?.island || 'iOS Native'}
                    </p>
                    <p className="truncate text-[8px] text-white/55 sm:text-[9px]">
                      {demo?.islandDetail}
                    </p>
                  </div>
                  <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#ff6b00]" />
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
        Tap Dynamic Island · Scroll to change demos
      </p>
    </div>
  )
}

function PhoneScreen({ demo }) {
  const id = demo?.id

  if (id === 'camera') {
    return (
      <div className="flex h-full flex-col">
        <p className="text-[10px] font-medium tracking-widest text-[#ff6b00] uppercase">
          AVFoundation
        </p>
        <h4 className="mt-1 text-base font-bold text-white sm:text-lg">
          {demo.title}
        </h4>
        <div className="relative mt-3 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#2a2a2a,transparent_55%)]" />
          <div className="absolute inset-5 rounded-xl border border-dashed border-[#ff6b00]/50" />
          <div className="absolute top-2.5 left-2.5 rounded-full bg-red-500/90 px-2 py-0.5 text-[8px] font-bold text-white">
            ● REC
          </div>
          <div className="absolute right-2.5 bottom-2.5 left-2.5 flex justify-between text-[8px] text-white/70">
            <span>1x</span>
            <span>ISO 200</span>
            <span>AF lock</span>
          </div>
          <div className="absolute bottom-9 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full border-2 border-white bg-white/20" />
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-white/55">
          Guided capture · flash · focus · overlays
        </p>
      </div>
    )
  }

  if (id === 'ml') {
    return (
      <div className="flex h-full flex-col">
        <p className="text-[10px] font-medium tracking-widest text-[#ff6b00] uppercase">
          Core ML
        </p>
        <h4 className="mt-1 text-base font-bold text-white sm:text-lg">
          {demo.title}
        </h4>
        <div className="mt-3 space-y-2">
          {['Panel damage', 'Scratch detected', 'Confidence 92%'].map(
            (row, i) => (
              <div
                key={row}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-2.5 py-2"
              >
                <span className="text-[11px] text-white/80">{row}</span>
                <motion.span
                  className="h-1.5 rounded-full bg-[#ff6b00]"
                  initial={{ width: 0 }}
                  animate={{ width: 36 + i * 16 }}
                  transition={{ delay: 0.15 * i, duration: 0.6 }}
                />
              </div>
            )
          )}
        </div>
        <div className="mt-auto rounded-xl border border-[#ff6b00]/30 bg-[#ff6b00]/10 p-2.5">
          <p className="text-[10px] text-[#ff6b00]">On-device · offline ready</p>
        </div>
      </div>
    )
  }

  if (id === 'ship') {
    return (
      <div className="flex h-full flex-col">
        <p className="text-[10px] font-medium tracking-widest text-[#ff6b00] uppercase">
          Bridge
        </p>
        <h4 className="mt-1 text-base font-bold text-white sm:text-lg">
          {demo.title}
        </h4>
        <div className="mt-4 space-y-2.5 font-mono text-[9px] text-white/70 sm:text-[10px]">
          <p className="text-emerald-400">✓ Flutter build succeeded</p>
          <p className="text-emerald-400">✓ Swift plugin linked</p>
          <p className="text-emerald-400">✓ MethodChannel ready</p>
          <p className="text-white/40">$ arch -arm64 flutter run</p>
        </div>
        <div className="mt-auto flex items-center gap-2 rounded-xl bg-white/5 p-2.5">
          <CheckCircle2 className="text-[#ff6b00]" size={16} />
          <span className="text-[11px] text-white/80">Native module shipped</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <p className="text-[10px] font-medium tracking-widest text-[#ff6b00] uppercase">
        iOS Native
      </p>
      <h4 className="mt-1 text-lg font-bold text-white sm:text-xl">
        {demo?.title || 'Swift developer'}
      </h4>
      <p className="mt-1.5 text-[11px] leading-relaxed text-white/55">
        {demo?.subtitle}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {['Swift', 'SwiftUI', 'AVFoundation', 'Core ML'].map((t) => (
          <div
            key={t}
            className="rounded-2xl border border-white/10 bg-white/5 px-2 py-3 text-center text-[10px] font-medium text-white/85 sm:text-[11px]"
          >
            {t}
          </div>
        ))}
      </div>
      <div className="mt-auto rounded-2xl bg-gradient-to-br from-[#ff6b00]/25 to-transparent p-3">
        <p className="text-[11px] font-semibold text-white">
          Native when it matters
        </p>
        <p className="mt-1 text-[9px] text-white/55">Camera · ML · performance</p>
      </div>
    </div>
  )
}
