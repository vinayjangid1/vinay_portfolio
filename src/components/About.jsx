import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import AnimatedSection from './AnimatedSection'
import TechLogo from './TechLogo'
import data from '../data.json'

function SkillBar({ skill, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2.5 font-medium text-[#ffffff]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 p-1.5">
            <TechLogo logo={skill.logo} name={skill.name} size={18} />
          </span>
          {skill.name}
        </span>
        <span className="tabular-nums text-[#a3a3a3]">{skill.level}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-[#ff6b00]"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

export default function About() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98])

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

          <div className="space-y-10">
            <AnimatedSection delay={0.15}>
              <p className="text-lg leading-relaxed text-[#a3a3a3]">{data.bio}</p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="mb-3 text-xs font-medium tracking-widest text-[#a3a3a3] uppercase">
                Tech stack
              </p>
              <div className="flex flex-wrap gap-2">
                {data.techStack.map((tech) => (
                  <span
                    key={tech.name}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[#e5e5e5]"
                  >
                    <TechLogo logo={tech.logo} name={tech.name} size={14} />
                    {tech.name}
                  </span>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.25} className="space-y-5">
              <p className="text-xs font-medium tracking-widest text-[#a3a3a3] uppercase">
                Skills
              </p>
              {data.skills.map((skill, i) => (
                <SkillBar key={skill.name} skill={skill} delay={0.08 * i} />
              ))}
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}
