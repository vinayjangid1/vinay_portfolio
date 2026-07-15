import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import AnimatedSection from './AnimatedSection'
import SkillsGlobe from './SkillsGlobe'
import TechLogo from './TechLogo'
import data from '../data.json'

const FILL_START = { r: 255, g: 255, b: 255 }
const FILL_END = { r: 255, g: 107, b: 0 }
const UNFILLED = '#3a3a3a'

function gradientColorAt(index, total) {
  const t = total <= 1 ? 1 : index / (total - 1)
  const r = Math.round(FILL_START.r + (FILL_END.r - FILL_START.r) * t)
  const g = Math.round(FILL_START.g + (FILL_END.g - FILL_START.g) * t)
  const b = Math.round(FILL_START.b + (FILL_END.b - FILL_START.b) * t)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Pinned character fill — sticky panel fits one viewport.
 * Scroll progress fills chars; page continues only after fill finishes.
 */
export default function About() {
  const trackRef = useRef(null)
  const [globeSize, setGlobeSize] = useState(420)
  const chars = useMemo(() => Array.from(data.bio || ''), [])
  const [filledCount, setFilledCount] = useState(0)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  // Direct progress (no spring lag) so fill stays in sync with sticky pin/unpin
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const clamped = Math.min(1, Math.max(0, v))
    const next = Math.round(clamped * chars.length)
    setFilledCount((prev) => (prev === next ? prev : next))
  })

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 480) setGlobeSize(300)
      else if (w < 768) setGlobeSize(360)
      else if (w < 1024) setGlobeSize(400)
      else setGlobeSize(460)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const techStack = data.techStack || []

  return (
    <section id="about" className="relative">
      {/* Scroll track: pin for one fill lap, then release */}
      <div ref={trackRef} className="relative h-[200vh] md:h-[220vh]">
        <div className="sticky top-0 z-10 flex h-svh flex-col justify-center overflow-hidden bg-[#000000] py-8 md:py-10">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 text-center md:px-8">
            <p className="mb-2 shrink-0 text-sm font-medium tracking-[0.2em] text-[#ff6b00] uppercase">
              About Me
            </p>
            <h2 className="font-display mx-auto max-w-2xl shrink-0 text-2xl font-bold tracking-tight text-[#ffffff] sm:text-3xl md:text-4xl lg:text-5xl">
              Crafting mobile products that feel native.
            </h2>

            <p
              className="mt-6 text-center text-[15px] leading-relaxed font-medium sm:mt-8 sm:text-lg md:mt-10 md:text-2xl md:leading-relaxed lg:text-[1.75rem] lg:leading-snug"
              aria-label={data.bio}
            >
              {chars.map((char, i) => (
                <span
                  key={i}
                  style={{
                    color:
                      i < filledCount
                        ? gradientColorAt(i, chars.length)
                        : UNFILLED,
                  }}
                >
                  {char}
                </span>
              ))}
            </p>

            <p className="mt-6 shrink-0 text-center text-[11px] tracking-wider text-[#a3a3a3] uppercase">
              {filledCount < chars.length
                ? 'Keep scrolling to fill the summary'
                : 'Summary complete — continue down'}
            </p>
          </div>
        </div>
      </div>

      {/* Skills — only reached after fill completes */}
      <div className="relative z-0 mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <AnimatedSection>
          <p className="mb-3 text-center text-sm font-medium tracking-[0.2em] text-[#ff6b00] uppercase">
            Skills
          </p>
          <h3 className="font-display text-center text-2xl font-bold tracking-tight text-[#ffffff] sm:text-3xl md:text-4xl">
            A world of technologies.
          </h3>
          <p className="mx-auto mt-3 max-w-md text-center text-sm text-[#a3a3a3]">
            Drag the globe to explore — Flutter, iOS, full stack, and more.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="mt-8 flex justify-center md:mt-12">
          <SkillsGlobe size={globeSize} />
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="mt-12 md:mt-16">
          <p className="mb-6 text-center text-xs font-medium tracking-[0.18em] text-[#a3a3a3] uppercase">
            Tech stack
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6">
            {techStack.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -4, scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group flex flex-col items-center gap-2.5 rounded-2xl border border-white/10 bg-[#111111]/70 px-3 py-5 backdrop-blur transition hover:border-[#ff6b00]/35 hover:bg-[#ff6b00]/5"
              >
                <TechLogo logo={item.logo} name={item.name} size={36} />
                <span className="text-center text-[11px] font-medium text-[#a3a3a3] transition group-hover:text-[#ffffff] sm:text-xs">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
