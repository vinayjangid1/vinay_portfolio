import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedSection from './AnimatedSection'
import ProjectLinks from './ProjectLinks'
import data from '../data.json'

/**
 * Clean timeline: experience on the left, projects on the right,
 * orange line fills as you scroll.
 */
export default function Projects() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.7', 'end 0.35'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const experience = data.experience || []

  return (
    <section id="projects" ref={sectionRef} className="relative py-20 md:py-28">
      <div className="relative mx-auto max-w-5xl px-5 md:px-8">
        <AnimatedSection>
          <p className="mb-3 text-sm font-medium tracking-[0.2em] text-[#ff6b00] uppercase">
            Work
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Experience & projects
          </h2>
          <p className="mt-3 max-w-lg text-[#a3a3a3]">
            Roles on the left. What I built on the right.
          </p>
        </AnimatedSection>

        <div className="relative mt-14 md:mt-16">
          {/* Center timeline */}
          <div className="pointer-events-none absolute top-0 bottom-0 left-3 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2">
            <motion.div
              className="h-full origin-top bg-[#ff6b00]"
              style={{ scaleY: lineScale }}
            />
          </div>

          <div className="space-y-14 md:space-y-20">
            {experience.map((exp, index) => {
              const projects = (exp.projectSlugs || [])
                .map((slug) => data.projects.find((p) => p.slug === slug))
                .filter(Boolean)

              return (
                <div
                  key={exp.id}
                  className="relative grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16"
                >
                  {/* Dot on the line */}
                  <span className="absolute top-2 left-3 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#ff6b00] bg-black md:left-1/2" />

                  {/* LEFT — experience */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.5 }}
                    className="pl-10 md:pl-0 md:pr-10 md:text-right"
                  >
                    <p className="text-xs text-[#a3a3a3]">
                      {exp.start} — {exp.end}
                      <span className="text-[#ff6b00]"> · {exp.duration}</span>
                    </p>
                    <div className="mt-2 flex items-center gap-3 md:justify-end">
                      {exp.logo && (
                        <img
                          src={exp.logo}
                          alt={`${exp.company} logo`}
                          className="h-10 w-10 shrink-0 rounded-xl border border-white/10 bg-white object-contain p-1 shadow-sm md:h-11 md:w-11"
                        />
                      )}
                      <h3 className="font-display text-xl font-bold text-white md:text-2xl">
                        {exp.company}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-[#ff6b00]">{exp.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[#a3a3a3] md:ml-auto md:max-w-sm">
                      {exp.summary}
                    </p>
                  </motion.div>

                  {/* RIGHT — projects */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="space-y-3 pl-10 md:pl-10"
                  >
                    {projects.map((project) => (
                      <Link
                        key={project.id}
                        to={`/projects/${project.slug}`}
                        className="group flex gap-3 rounded-xl border border-white/10 bg-[#111111]/80 p-3 transition hover:border-[#ff6b00]/40"
                      >
                        <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-transparent">
                          <img
                            src={project.thumbnail}
                            alt=""
                            className="h-full w-full object-contain transition duration-400 group-hover:scale-105"
                          />
                        </div>
                        <div className="min-w-0 flex-1 py-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-display text-sm font-semibold text-white transition group-hover:text-[#ff6b00]">
                              {project.title}
                            </h4>
                            <ArrowUpRight
                              size={14}
                              className="mt-0.5 shrink-0 text-[#a3a3a3] transition group-hover:text-[#ff6b00]"
                            />
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#a3a3a3]">
                            {project.tagline || project.description}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap gap-1">
                              {(project.tech || []).slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-[#a3a3a3]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                            <ProjectLinks project={project} size="sm" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
