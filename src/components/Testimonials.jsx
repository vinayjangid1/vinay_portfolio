import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Quote } from 'lucide-react'
import data from '../data.json'

/**
 * Sticky curved orbit:
 * - Scroll down: complete 1 full clockwise turn, then page continues down
 * - Scroll up: complete 1 full reverse turn, then page continues up
 */
export default function Testimonials() {
  const items = data.testimonials || []
  const trackRef = useRef(null)
  const [dir, setDir] = useState(1)
  const lastY = useRef(0)
  const [radius, setRadius] = useState({ x: 260, y: 110 })

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 480) setRadius({ x: 130, y: 64 })
      else if (w < 768) setRadius({ x: 170, y: 78 })
      else setRadius({ x: 270, y: 115 })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - lastY.current) > 2) {
        setDir(y > lastY.current ? 1 : -1)
        lastY.current = y
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Progress only while pinned sticky stage is scrubbing through the tall track
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  // Exactly ONE full rotation across the pinned scroll distance
  const rawAngle = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2])
  const angle = useSpring(rawAngle, { stiffness: 80, damping: 28, mass: 0.25 })

  // How much of the round is done (for UI)
  const roundPct = useTransform(scrollYProgress, [0, 1], [0, 100])
  const [pct, setPct] = useState(0)
  useEffect(() => roundPct.on('change', (v) => setPct(Math.round(v))), [roundPct])

  return (
    <section id="testimonials" className="relative">
      {/* Tall track = one locked scroll “lap” before continuing the page */}
      <div ref={trackRef} className="relative h-[220vh] md:h-[240vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,107,0,0.06),transparent_55%)]"
          />

          <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-3 text-sm font-medium tracking-[0.2em] text-[#ff6b00] uppercase">
                  Testimonials
                </p>
                <h2 className="font-display max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                  What partners say.
                </h2>
                <p className="mt-3 max-w-md text-sm text-[#a3a3a3]">
                  Finish one full turn — then the page keeps scrolling.
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div
                  className={`rounded-full border px-3 py-1 text-[10px] tracking-wider uppercase ${
                    dir > 0
                      ? 'border-[#ff6b00]/50 text-[#ff6b00]'
                      : 'border-white/15 text-[#a3a3a3]'
                  }`}
                >
                  {dir > 0 ? 'Clockwise ↓' : 'Reverse ↑'}
                </div>
                <p className="text-xs tabular-nums text-[#a3a3a3]">
                  Round {pct}%
                </p>
                <div className="h-1 w-28 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full origin-left bg-[#ff6b00]"
                    style={{ scaleX: scrollYProgress }}
                  />
                </div>
              </div>
            </div>

            <div className="relative mt-8 h-[360px] md:mt-10 md:h-[400px]">
              <svg
                className="pointer-events-none absolute inset-x-[4%] top-[18%] mx-auto h-[65%] w-[92%] opacity-25"
                viewBox="0 0 100 60"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M 4 48 Q 50 4 96 48"
                  fill="none"
                  stroke="rgba(255,107,0,0.65)"
                  strokeWidth="0.4"
                  strokeDasharray="1.6 1.2"
                />
              </svg>

              {items.map((t, i) => (
                <OrbitCard
                  key={t.id}
                  item={t}
                  index={i}
                  total={items.length}
                  angle={angle}
                  radiusX={radius.x}
                  radiusY={radius.y}
                />
              ))}
            </div>

            <p className="mt-2 text-center text-[11px] tracking-wider text-[#a3a3a3] uppercase">
              {pct < 100
                ? dir > 0
                  ? 'Keep scrolling down to finish the round'
                  : 'Keep scrolling up to finish reverse'
                : dir > 0
                  ? 'Round complete — continue down'
                  : 'Reverse complete — continue up'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function OrbitCard({ item, index, total, angle, radiusX, radiusY }) {
  const slot = (index / total) * Math.PI * 2

  const x = useTransform(angle, (a) => Math.sin(a + slot) * radiusX)
  const y = useTransform(angle, (a) => Math.cos(a + slot) * radiusY)
  const zIndex = useTransform(angle, (a) =>
    Math.round((Math.cos(a + slot) + 1) * 50)
  )
  const scale = useTransform(angle, (a) => {
    const depth = (Math.cos(a + slot) + 1) / 2
    return 0.7 + depth * 0.4
  })
  const opacity = useTransform(angle, (a) => {
    const depth = (Math.cos(a + slot) + 1) / 2
    return 0.22 + depth * 0.78
  })

  const isFront = useTransform(angle, (a) => Math.cos(a + slot) > 0.55)
  const [front, setFront] = useState(false)

  useEffect(() => isFront.on('change', (v) => setFront(v)), [isFront])

  return (
    <motion.article
      style={{ x, y, zIndex, scale, opacity }}
      className="absolute top-[42%] left-1/2 w-[min(88vw,300px)] -translate-x-1/2 -translate-y-1/2 will-change-transform"
    >
      <div
        className={`rounded-2xl border p-5 backdrop-blur-md transition-colors duration-300 md:p-6 ${
          front
            ? 'border-[#ff6b00]/50 bg-[#111111]/95 shadow-[0_24px_60px_rgba(0,0,0,0.5)]'
            : 'border-white/10 bg-[#0a0a0a]/75'
        }`}
      >
        <Quote
          size={20}
          className={front ? 'text-[#ff6b00]' : 'text-white/20'}
        />
        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-[#e5e5e5]">
          &ldquo;{item.quote}&rdquo;
        </p>
        <footer className="mt-4">
          <p className="text-sm font-semibold text-white">{item.author}</p>
          <p className="mt-0.5 text-xs text-[#a3a3a3]">{item.role}</p>
        </footer>
      </div>
    </motion.article>
  )
}
