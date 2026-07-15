import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Github } from 'lucide-react'
import TechLogo from '../components/TechLogo'
import ProjectLinks from '../components/ProjectLinks'
import ResumeFAB from '../components/ResumeFAB'
import SEO from '../components/SEO'
import data from '../data.json'

export default function ProjectOverview() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const project = data.projects.find((p) => p.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!project) {
    return (
      <div className="min-h-screen pb-20">
        <SEO />
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5">
          <p className="text-[#a3a3a3]">Project not found.</p>
          <Link to="/" className="text-[#ff6b00] hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  const { overview } = project

  return (
    <div className="min-h-screen pb-20">
      <SEO project={project} />
      {/* Hero banner */}
      <header className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${project.accent}33, transparent 55%), #000000`,
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pt-24 pb-12 md:px-8 md:pt-28 md:pb-16">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-8 inline-flex items-center gap-2 text-sm text-[#a3a3a3] transition hover:text-[#ff6b00]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="mb-3 text-sm font-medium tracking-[0.2em] uppercase"
              style={{ color: project.accent }}
            >
              Project overview
            </p>
            <h1 className="font-display max-w-3xl text-4xl font-extrabold tracking-tight text-[#ffffff] sm:text-5xl md:text-6xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[#a3a3a3]">
              {project.tagline || project.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {(project.techLogos || []).map((logo, i) => (
                <span
                  key={`${logo}-${i}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-[#e5e5e5]"
                >
                  <TechLogo
                    logo={logo}
                    name={project.tech[i]}
                    size={16}
                  />
                  {project.tech[i] || logo}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ProjectLinks project={project} size="lg" />
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-[#ffffff] transition hover:border-[#ff6b00]/50 hover:text-[#ff6b00]"
                >
                  <Github size={16} />
                  GitHub
                </a>
              )}
              <Link
                to="/#projects"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-[#a3a3a3] transition hover:text-[#ffffff]"
              >
                All projects
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-16 px-5 py-14 md:px-8 md:py-20">
        {/* Thumbnails / gallery */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <h2 className="font-display mb-6 text-2xl font-bold text-[#ffffff] md:text-3xl">
            Screens & visuals
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(project.gallery?.length ? project.gallery : [project.thumbnail]).map(
              (src, i) => (
                <div
                  key={src}
                  className={`flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-transparent p-4 ${
                    i === 0 && (project.gallery?.length || 1) === 1
                      ? 'md:col-span-2'
                      : ''
                  }`}
                >
                  <img
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className="max-h-72 w-full object-contain md:max-h-96"
                  />
                </div>
              )
            )}
          </div>
          <p className="mt-3 text-sm text-[#a3a3a3]">
            Replace files in <code className="text-[#ff6b00]">public/projects/</code> with
            your real app screenshots — paths are set in{' '}
            <code className="text-[#ff6b00]">src/data.json</code>.
          </p>
        </motion.section>

        {/* Problem */}
        <section>
          <h2 className="font-display mb-4 text-2xl font-bold text-[#ffffff] md:text-3xl">
            The problem
          </h2>
          <p className="max-w-3xl text-lg leading-relaxed text-[#a3a3a3]">
            {overview.problem}
          </p>
        </section>

        {/* How it works */}
        <section>
          <h2 className="font-display mb-6 text-2xl font-bold text-[#ffffff] md:text-3xl">
            How it works
          </h2>
          <ol className="space-y-4">
            {overview.howItWorks.map((step, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-2xl border border-white/10 bg-[#111111]/60 p-5 md:p-6"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#000000]"
                  style={{ background: project.accent }}
                >
                  {i + 1}
                </span>
                <p className="pt-1.5 leading-relaxed text-[#e5e5e5]">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* What I did */}
        <section>
          <h2 className="font-display mb-6 text-2xl font-bold text-[#ffffff] md:text-3xl">
            What I did
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {overview.whatIDid.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0"
                  style={{ color: project.accent }}
                />
                <span className="text-[#e5e5e5]">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Highlights */}
        {overview.highlights?.length > 0 && (
          <section>
            <h2 className="font-display mb-6 text-2xl font-bold text-[#ffffff] md:text-3xl">
              Highlights
            </h2>
            <div className="flex flex-wrap gap-3">
              {overview.highlights.map((h) => (
                <span
                  key={h}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[#ffffff]"
                  style={{ background: `${project.accent}18` }}
                >
                  {h}
                </span>
              ))}
            </div>
          </section>
        )}

        <div className="border-t border-white/5 pt-10">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-[#ff6b00] transition hover:gap-3"
          >
            <ArrowLeft size={16} />
            Back to all projects
          </Link>
        </div>
      </div>
      <ResumeFAB />
    </div>
  )
}
