import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import data from '../data.json'

function Counter({ value, suffix = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1400
    const startAt = performance.now() + delay * 1000
    let raf

    const tick = (now) => {
      if (now < startAt) {
        raf = requestAnimationFrame(tick)
        return
      }
      const t = Math.min(1, (now - startAt) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      start = Math.round(value * eased)
      setCount(start)
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, delay])

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  )
}

/** Projects / experience / clients stats with count-up animation. */
export default function Stats() {
  const stats = data.stats || []

  return (
    <section id="stats" className="relative border-y border-white/5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <AnimatedSection>
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                className="relative text-center sm:text-left"
              >
                <p className="font-display text-5xl font-bold tracking-tight text-[#ffffff] md:text-6xl">
                  <span className="text-[#ff6b00]">
                    <Counter value={stat.value} suffix={stat.suffix} delay={i * 0.12} />
                  </span>
                </p>
                <p className="mt-3 text-sm font-medium tracking-wide text-[#a3a3a3] uppercase">
                  {stat.label}
                </p>
                {i < stats.length - 1 && (
                  <div className="pointer-events-none absolute top-1/2 right-0 hidden h-12 w-px -translate-y-1/2 bg-white/10 sm:block" />
                )}
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
