import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import IPhoneSimulator from './IPhoneSimulator'
import data from '../data.json'

/**
 * Scroll-driven iOS demo section — sticky iPhone + Dynamic Island.
 */
export default function IosDemo() {
  const demos = data.iosDemos || []
  const sectionRef = useRef(null)
  const [active, setActive] = useState(0)
  const stepRefs = useRef([])

  useEffect(() => {
    const observers = []
    stepRefs.current.forEach((el, i) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i)
        },
        { rootMargin: '-35% 0px -45% 0px', threshold: 0.15 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [demos.length])

  const demo = demos[active] || demos[0]

  return (
    <section id="ios" ref={sectionRef} className="relative py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.05),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <AnimatedSection>
          <p className="mb-3 text-sm font-medium tracking-[0.2em] text-[#ff6b00] uppercase">
            iOS Native
          </p>
          <h2 className="font-display max-w-2xl text-3xl font-bold tracking-tight text-[#ffffff] sm:text-4xl md:text-5xl">
            Not just Flutter — real iPhone engineering.
          </h2>
          <p className="mt-4 max-w-xl text-[#a3a3a3]">
            Scroll through native demos. Tap the Dynamic Island. Camera,
            AVFoundation, Core ML, and Swift bridges — the work I ship on iOS.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[1fr_340px] lg:gap-16">
          {/* Scroll steps */}
          <div className="space-y-6 md:space-y-8">
            {demos.map((d, i) => (
              <motion.article
                key={d.id}
                ref={(el) => {
                  stepRefs.current[i] = el
                }}
                initial={{ opacity: 0.45 }}
                animate={{
                  opacity: active === i ? 1 : 0.4,
                  scale: active === i ? 1 : 0.985,
                }}
                transition={{ duration: 0.35 }}
                className={`rounded-2xl border p-6 md:p-8 ${
                  active === i
                    ? 'border-[#ff6b00]/40 bg-[#111111]/90 shadow-[0_0_40px_-12px_rgba(255,107,0,0.35)]'
                    : 'border-white/10 bg-[#0a0a0a]/60'
                }`}
              >
                <p className="text-xs font-medium tracking-[0.2em] text-[#ff6b00] uppercase">
                  Demo 0{i + 1}
                </p>
                <h3 className="font-display mt-2 text-2xl font-bold text-white md:text-3xl">
                  {d.title}
                </h3>
                <p className="mt-1 text-sm text-[#ff6b00]/90">{d.subtitle}</p>
                <p className="mt-4 text-sm leading-relaxed text-[#a3a3a3] md:text-base">
                  {d.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {d.points?.map((p) => (
                    <li
                      key={p}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#e5e5e5]"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>

          {/* Sticky phone */}
          <div className="lg:sticky lg:top-28">
            <IPhoneSimulator
              demo={demo}
              demos={demos}
              activeIndex={active}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
