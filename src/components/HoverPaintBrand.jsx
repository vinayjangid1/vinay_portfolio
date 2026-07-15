import { useCallback, useRef, useState } from 'react'

const LINE = 'FULL STACK DEVELOPER'

/**
 * Shared FLUTTER + FULL STACK DEVELOPER with mouse-follow orange fill.
 * `variant`: "section" | "splash"
 */
export default function HoverPaintBrand({
  variant = 'section',
  hint = true,
  className = '',
}) {
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

  const isSplash = variant === 'splash'
  const flutterSize = isSplash
    ? 'text-[18vw] md:text-[12vw] lg:text-[10vw]'
    : 'text-[16vw] md:text-[11vw]'
  const lineSize = isSplash
    ? 'text-[7.5vw] md:text-[5.2vw] lg:text-[4.5vw]'
    : 'text-[7vw] md:text-[5vw]'

  const paint = active
    ? `radial-gradient(${isSplash ? 280 : 240}px circle at ${pos.x}px ${pos.y}px, #ff6b00 0%, #ff8533 32%, transparent 68%)`
    : 'none'

  const paintLine = active
    ? `radial-gradient(${isSplash ? 320 : 280}px circle at ${pos.x}px ${pos.y}px, #ff6b00 0%, #ff9a3c 35%, transparent 65%)`
    : 'none'

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`relative mx-auto flex w-full max-w-6xl cursor-crosshair flex-col items-center justify-center px-4 select-none ${className}`}
    >
      <div className="relative w-full text-center leading-none">
        <span
          className={`font-display block font-bold tracking-[0.02em] text-white/[0.12] ${flutterSize}`}
        >
          FLUTTER
        </span>
        <span
          aria-hidden
          className={`font-display pointer-events-none absolute inset-0 block font-bold tracking-[0.02em] ${flutterSize}`}
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

      <div className="relative mt-1 w-full text-center leading-[1.05] md:mt-2">
        <span
          className={`font-display block font-bold tracking-[0.04em] text-white/[0.14] whitespace-nowrap ${lineSize}`}
        >
          {LINE}
        </span>
        <span
          aria-hidden
          className={`font-display pointer-events-none absolute inset-0 block font-bold tracking-[0.04em] whitespace-nowrap ${lineSize}`}
          style={{
            backgroundImage: paintLine,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {LINE}
        </span>
      </div>

      {hint && (
        <p className="mt-5 text-xs tracking-[0.25em] text-[#a3a3a3] uppercase">
          Hover to paint · Flutter · Full Stack Developer
        </p>
      )}
    </div>
  )
}
