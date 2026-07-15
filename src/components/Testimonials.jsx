import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Quote } from 'lucide-react'
import AnimatedSection from './AnimatedSection'
import data from '../data.json'

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const items = data.testimonials

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length)
    }, 5500)
    return () => clearInterval(id)
  }, [items.length])

  const current = items[index]

  return (
    <section id="testimonials" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <AnimatedSection>
          <p className="mb-3 text-sm font-medium tracking-[0.2em] text-[#ff6b00] uppercase">
            Testimonials
          </p>
          <h2 className="font-display max-w-xl text-3xl font-bold tracking-tight text-[#ffffff] sm:text-4xl md:text-5xl">
            What partners say.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="mt-14">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/70 px-6 py-10 backdrop-blur md:px-12 md:py-14">
            <Quote className="mb-6 text-[#ff6b00]/40" size={36} />
            <div className="relative min-h-[160px] md:min-h-[140px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={current.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <p className="text-lg leading-relaxed text-[#e5e5e5] md:text-xl">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                  <footer className="mt-8">
                    <cite className="not-italic">
                      <span className="block font-semibold text-[#ffffff]">
                        {current.author}
                      </span>
                      <span className="mt-1 block text-sm text-[#a3a3a3]">
                        {current.role}
                      </span>
                    </cite>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex gap-2">
              {items.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-8 bg-[#ff6b00]' : 'w-3 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Marquee strip of roles */}
        <div className="relative mt-12 overflow-hidden mask-[linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            className="flex w-max gap-10 whitespace-nowrap text-sm text-[#a3a3a3]"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            {[...items, ...items].map((t, i) => (
              <span key={`${t.id}-${i}`} className="inline-flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-[#ff6b00]" />
                {t.role}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
