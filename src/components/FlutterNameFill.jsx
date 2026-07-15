import { useCallback, useRef, useState } from 'react'

const LINE = 'FULL STACK DEVELOPER'

/**
 * Giant "FLUTTER" + "FULL STACK DEVELOPER".
 * Soft solid letterforms (no text-stroke) + mouse-follow orange fill.
 */
export default function FlutterNameFill() {
  const wrapRef = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  const onMove = useCallback((e) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  const paint = active
    ? `radial-gradient(240px circle at ${pos.x}px ${pos.y}px, #ff6b00 0%, #ff8533 32%, transparent 68%)`
    : 'none'

  return (
    <section
      aria-label="Flutter — Full Stack Developer"
      className="relative overflow-hidden border-y border-white/5 py-10 md:py-16"
    >
      <div
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        className="relative mx-auto flex max-w-6xl cursor-crosshair flex-col items-center justify-center px-4 select-none"
      >
        {/* FLUTTER */}
        <div className="relative w-full text-center leading-none">
          <span className="font-display block text-[16vw] font-bold tracking-[0.02em] text-white/[0.12] md:text-[11vw]">
            FLUTTER
          </span>
          <span
            aria-hidden
            className="font-display pointer-events-none absolute inset-0 block text-[16vw] font-bold tracking-[0.02em] md:text-[11vw]"
            style={{
              backgroundImage: paint,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
            }}
          >
            FLUTTER
          </span>
        </div>

        {/* FULL STACK DEVELOPER */}
        <div className="relative mt-1 w-full text-center leading-[1.05] md:mt-2">
          <span className="font-display block text-[7vw] font-bold tracking-[0.04em] text-white/[0.14] whitespace-nowrap md:text-[5vw]">
            {LINE}
          </span>
          <span
            aria-hidden
            className="font-display pointer-events-none absolute inset-0 block text-[7vw] font-bold tracking-[0.04em] whitespace-nowrap md:text-[5vw]"
            style={{
              backgroundImage: active
                ? `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, #ff6b00 0%, #ff9a3c 35%, transparent 65%)`
                : 'none',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {LINE}
          </span>
        </div>

        <p className="mt-5 text-xs tracking-[0.25em] text-[#a3a3a3] uppercase">
          Hover to paint · Flutter · Full Stack Developer
        </p>
      </div>
    </section>
  )
}
