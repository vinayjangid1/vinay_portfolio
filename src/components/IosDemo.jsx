import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion'
import IPhoneSimulator from './IPhoneSimulator'
import data from '../data.json'

/**
 * Pinned iOS section — one clear text panel at a time (no stack ghosting).
 * Scroll advances demos; phone stays synced.
 */
export default function IosDemo() {
  const demos = data.iosDemos || []
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)
  const count = Math.max(demos.length, 1)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const clamped = Math.min(0.999, Math.max(0, v))
    const next = Math.min(count - 1, Math.floor(clamped * count))
    setActive((prev) => {
      if (prev === next) return prev
      setDir(next > prev ? 1 : -1)
      return next
    })
  })

  useEffect(() => {
    const v = scrollYProgress.get()
    const next = Math.min(
      count - 1,
      Math.floor(Math.min(0.999, Math.max(0, v)) * count)
    )
    setActive(next)
  }, [count, scrollYProgress])

  const demo = demos[active] || demos[0]
  const trackHeight = `${count * 130}vh`

  return (
    <section id="ios" className="relative">
      <div ref={trackRef} className="relative" style={{ height: trackHeight }}>
        <div className="sticky top-0 z-10 flex h-svh items-center overflow-hidden bg-[#000000]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.06),transparent_55%)]"
          />

          <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center px-5 py-6 md:px-8 md:py-8">
            <div className="mb-6 shrink-0 md:mb-8">
              <p className="mb-1.5 text-xs font-medium tracking-[0.2em] text-[#ff6b00] uppercase md:text-sm">
                iOS Native
              </p>
              <h2 className="font-display max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                Native iOS — where performance is felt.
              </h2>
            </div>

            <div className="grid items-center gap-8 lg:grid-cols-[1fr_280px] lg:gap-14 xl:grid-cols-[1fr_300px]">
              {/* Single panel — AnimatePresence so text never stacks */}
              <div className="relative min-h-[240px] md:min-h-[280px]">
                <AnimatePresence mode="wait" initial={false} custom={dir}>
                  <motion.article
                    key={demo?.id}
                    custom={dir}
                    initial={{ opacity: 0, y: dir > 0 ? 28 : -28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: dir > 0 ? -28 : 28 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-0 top-0"
                  >
                    <p className="text-[10px] font-medium tracking-[0.2em] text-[#ff6b00] uppercase md:text-xs">
                      Screen {String(active + 1).padStart(2, '0')} /{' '}
                      {String(count).padStart(2, '0')}
                    </p>
                    <h3 className="font-display mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
                      {demo?.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#ff6b00]">{demo?.subtitle}</p>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#a3a3a3] md:text-base">
                      {demo?.description}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                      {demo?.points?.map((p) => (
                        <li
                          key={p}
                          className="text-xs tracking-wide text-[#e5e5e5]/90 before:mr-2 before:text-[#ff6b00] before:content-['·']"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </motion.article>
                </AnimatePresence>
              </div>

              <div className="mx-auto flex max-h-[58svh] items-center justify-center lg:mx-0 lg:max-h-[70svh]">
                <div className="origin-center scale-[0.78] sm:scale-[0.85] lg:scale-90 xl:scale-100">
                  <IPhoneSimulator
                    demo={demo}
                    demos={demos}
                    activeIndex={active}
                  />
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-[11px] tracking-wider text-[#a3a3a3] uppercase lg:text-left">
              {active < count - 1
                ? 'Keep scrolling — next screen'
                : 'Native pass complete — continue down'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
