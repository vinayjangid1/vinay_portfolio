import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import AnimatedSection from './AnimatedSection'
import SkillsGlobe from './SkillsGlobe'
import data from '../data.json'

export default function About() {
  const sectionRef = useRef(null)
  const [globeSize, setGlobeSize] = useState(420)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98])

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

  return (
    <section id="about" ref={sectionRef} className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <AnimatedSection>
          <p className="mb-3 text-sm font-medium tracking-[0.2em] text-[#ff6b00] uppercase">
            About Me
          </p>
          <h2 className="font-display max-w-xl text-3xl font-bold tracking-tight text-[#ffffff] sm:text-4xl md:text-5xl">
            Crafting mobile products that feel native.
          </h2>
        </AnimatedSection>

        <div className="mt-14 grid items-start gap-12 md:grid-cols-2 md:gap-16">
          <AnimatedSection delay={0.1} className="relative">
            <motion.div
              style={{ y: imgY, scale: imgScale }}
              className="overflow-hidden rounded-2xl border border-white/10 ring-1 ring-[#ff6b00]/20"
            >
              <img
                src={data.profileImage}
                alt={`${data.name} portrait`}
                className="aspect-[4/5] w-full max-w-md object-cover object-top md:max-w-none"
                onError={(e) => {
                  e.currentTarget.src = '/profile.svg'
                }}
              />
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <p className="text-lg leading-relaxed text-[#a3a3a3]">{data.bio}</p>
          </AnimatedSection>
        </div>

        {/* Skills globe */}
        <div className="mt-20 md:mt-28">
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
        </div>
      </div>
    </section>
  )
}
