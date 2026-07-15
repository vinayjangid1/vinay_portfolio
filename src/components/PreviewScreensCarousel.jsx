import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Horizontal scrollable project screens with left / right arrow buttons.
 * Card width follows each image (no empty side background).
 */
export default function PreviewScreensCarousel({ screens, title, accent = '#ff6b00' }) {
  const trackRef = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const updateArrows = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanLeft(scrollLeft > 4)
    setCanRight(scrollLeft + clientWidth < scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [screens, updateArrows])

  const scrollBy = (dir) => {
    const el = trackRef.current
    if (!el) return
    const first = el.querySelector('[data-preview-card]')
    const amount = first
      ? first.getBoundingClientRect().width + 16
      : Math.min(el.clientWidth * 0.75, 320)
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  if (!screens?.length) return null

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous screens"
        disabled={!canLeft}
        onClick={() => scrollBy(-1)}
        className={`absolute top-1/2 left-0 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/80 text-white shadow-lg backdrop-blur transition md:left-1 md:h-12 md:w-12 ${
          canLeft
            ? 'opacity-100 hover:border-[#ff6b00]/50 hover:text-[#ff6b00]'
            : 'pointer-events-none opacity-30'
        }`}
        style={canLeft ? { boxShadow: `0 0 0 1px ${accent}33` } : undefined}
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        aria-label="Next screens"
        disabled={!canRight}
        onClick={() => scrollBy(1)}
        className={`absolute top-1/2 right-0 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/80 text-white shadow-lg backdrop-blur transition md:right-1 md:h-12 md:w-12 ${
          canRight
            ? 'opacity-100 hover:border-[#ff6b00]/50 hover:text-[#ff6b00]'
            : 'pointer-events-none opacity-30'
        }`}
      >
        <ChevronRight size={22} />
      </button>

      <div
        ref={trackRef}
        className="flex items-stretch gap-4 overflow-x-auto scroll-smooth px-12 py-1 md:px-14 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {screens.map((src, i) => (
          <div
            key={`${src}-${i}`}
            data-preview-card
            className="shrink-0 overflow-hidden rounded-2xl border border-white/10"
          >
            <img
              src={src}
              alt={`${title} preview ${i + 1}`}
              className="block h-[380px] w-auto max-w-none object-contain sm:h-[420px] md:h-[480px]"
              loading="lazy"
              onLoad={updateArrows}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
