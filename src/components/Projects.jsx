import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Briefcase, Building2, Clock, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedSection from './AnimatedSection'
import TechLogo from './TechLogo'
import data from '../data.json'

function ExperienceCard({ exp }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-white/10 bg-[#111111]/90 p-4 text-left backdrop-blur md:p-5"
    >
      <div className="mb-3 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#ff6b00]/30 bg-[#ff6b00]/10 text-[#ff6b00]">
          <Building2 size={18} />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold text-[#ffffff] md:text-lg">
            {exp.company}
          </h3>
          <p className="mt-0.5 text-sm font-medium text-[#ff6b00]">{exp.role}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-[#a3a3a3] md:text-xs">
        <span className="inline-flex items-center gap-1">
          <Clock size={12} className="text-[#ff6b00]" />
          {exp.start} — {exp.end}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-medium text-[#e5e5e5]">
          <Briefcase size={11} />
          {exp.duration}
        </span>
        {exp.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} />
            {exp.location}
          </span>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[#a3a3a3] md:text-sm">
        {exp.summary}
      </p>

      {exp.projectSlugs?.length > 0 && (
        <div className="mt-3 border-t border-white/5 pt-3">
          <p className="mb-1.5 text-[10px] font-medium tracking-wider text-[#a3a3a3] uppercase">
            Projects at this company
          </p>
          <ul className="space-y-1">
            {exp.projectSlugs.map((slug) => {
              const p = data.projects.find((x) => x.slug === slug)
              if (!p) return null
              return (
                <li key={slug}>
                  <Link
                    to={`/projects/${slug}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#e5e5e5] transition hover:text-[#ff6b00]"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: p.accent }}
                    />
                    {p.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </motion.div>
  )
}

function ProjectCard({ project }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group overflow-hidden rounded-xl border border-white/10 bg-[#111111]/90 backdrop-blur"
      style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 28px -8px ${project.accent}55, 0 0 0 1px ${project.accent}33`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.04)'
      }}
    >
      <Link to={`/projects/${project.slug}`} className="block overflow-hidden">
        <div className="relative aspect-[16/9] overflow-hidden bg-[#000000]">
          <img
            src={project.thumbnail}
            alt={`${project.title} thumbnail`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-70" />
          <span
            className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-[#000000]"
            style={{ background: project.accent }}
          >
            Project
          </span>
        </div>
      </Link>
      <div className="p-3.5">
        <h4 className="font-display text-sm font-bold text-[#ffffff] md:text-base">
          <Link
            to={`/projects/${project.slug}`}
            className="transition hover:text-[#ff6b00]"
          >
            {project.title}
          </Link>
        </h4>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#a3a3a3] md:text-xs">
          {project.description}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {(project.techLogos || []).slice(0, 4).map((logo, i) => (
            <span
              key={`${logo}-${i}`}
              className="flex h-5 w-5 items-center justify-center rounded border border-white/10 bg-white/5 p-0.5"
            >
              <TechLogo logo={logo} name={project.tech[i]} size={11} />
            </span>
          ))}
        </div>
        <Link
          to={`/projects/${project.slug}`}
          className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#ff6b00]"
        >
          Overview <ArrowUpRight size={12} />
        </Link>
      </div>
    </motion.article>
  )
}

/**
 * Center timeline: experience (left) + projects (right),
 * orange line fills as you scroll.
 */
export default function Projects() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.65', 'end 0.3'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const experience = data.experience || []

  return (
    <section id="projects" ref={sectionRef} className="relative py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,0,0.06),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <AnimatedSection>
          <p className="mb-3 text-sm font-medium tracking-[0.2em] text-[#ff6b00] uppercase">
            Experience & Projects
          </p>
          <h2 className="font-display max-w-2xl text-3xl font-bold tracking-tight text-[#ffffff] sm:text-4xl">
            Where I worked — and what I built.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-[#a3a3a3]">
            Left: company, role, and duration. Right: projects shipped there.
          </p>
        </AnimatedSection>

        {/* Column labels (desktop) */}
        <div className="relative mt-10 hidden grid-cols-[1fr_auto_1fr] gap-6 md:mt-14 md:grid">
          <p className="text-center text-xs font-medium tracking-[0.18em] text-[#a3a3a3] uppercase">
            Experience
          </p>
          <div className="w-4" />
          <p className="text-center text-xs font-medium tracking-[0.18em] text-[#a3a3a3] uppercase">
            Projects
          </p>
        </div>

        <div className="relative mt-6 md:mt-8">
          {/* Center line */}
          <div className="pointer-events-none absolute top-0 bottom-0 left-4 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2">
            <motion.div
              className="origin-top w-full bg-[#ff6b00] shadow-[0_0_14px_rgba(255,107,0,0.75)]"
              style={{ scaleY: lineScale, height: '100%' }}
            />
          </div>

          <div className="space-y-12 md:space-y-16">
            {experience.map((exp) => {
              const projects = (exp.projectSlugs || [])
                .map((slug) => data.projects.find((p) => p.slug === slug))
                .filter(Boolean)

              return (
                <div
                  key={exp.id}
                  className="relative grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-8"
                >
                  {/* Left — experience */}
                  <div className="pl-10 md:pl-0 md:pr-2 md:text-right">
                    <div className="md:ml-auto md:max-w-md md:[&>*]:text-left">
                      <ExperienceCard exp={exp} />
                    </div>
                  </div>

                  {/* Center node */}
                  <div className="absolute top-6 left-4 z-10 flex -translate-x-1/2 flex-col items-center md:relative md:top-auto md:left-auto md:translate-x-0">
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#ff6b00] bg-[#000000] shadow-[0_0_16px_rgba(255,107,0,0.45)]"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b00]" />
                    </motion.span>
                  </div>

                  {/* Right — projects */}
                  <div className="pl-10 md:pl-2">
                    <div className="mb-2 text-xs font-medium tracking-wider text-[#a3a3a3] uppercase md:hidden">
                      Projects
                    </div>
                    <div className="grid max-w-md gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                      {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
