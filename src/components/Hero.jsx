import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'
import NameHover from './NameHover'
import data from '../data.json'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.35 },
  },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Hero() {
  const [typed, setTyped] = useState('')
  const full = data.title
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 140])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5])
  const imgOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.3])
  const imgZoom = useTransform(scrollYProgress, [0, 1], [1.06, 1])
  const glowY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -50]), {
    stiffness: 80,
    damping: 24,
  })

  useEffect(() => {
    let i = 0
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i += 1
        setTyped(full.slice(0, i))
        if (i >= full.length) clearInterval(id)
      }, 28)
      return () => clearInterval(id)
    }, 700)
    return () => clearTimeout(start)
  }, [full])

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden gradient-mesh"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#ff6b00]/20 blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-32 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-28 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:px-8 md:py-32">
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.p
            variants={item}
            className="mb-4 text-sm font-medium tracking-[0.2em] text-[#ff6b00] uppercase"
          >
            Flutter · iOS · Full Stack Developer
          </motion.p>

          <motion.div variants={item}>
            <NameHover
              text={data.name}
              as="h1"
              className="font-display text-5xl leading-[1.05] font-extrabold tracking-tight text-[#ffffff] sm:text-6xl lg:text-7xl"
            />
          </motion.div>

          <motion.p
            variants={item}
            className="mt-4 min-h-[1.5em] text-lg text-[#a3a3a3] sm:text-xl"
          >
            <span className="text-[#e5e5e5]">{typed}</span>
            <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[2px] animate-pulse bg-[#ff6b00]" />
          </motion.p>

          <motion.p
            variants={item}
            className="mt-5 max-w-lg text-base leading-relaxed text-[#a3a3a3] sm:text-lg"
          >
            {data.tagline}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => scrollTo('#projects')}
              className="group inline-flex items-center gap-2 rounded-full bg-[#ff6b00] px-6 py-3 text-sm font-semibold text-[#000000] transition hover:bg-[#ff8533]"
            >
              View Projects
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-0.5"
              />
            </button>
            <button
              type="button"
              onClick={() => scrollTo('#contact')}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-[#ffffff] backdrop-blur transition hover:border-[#ff6b00]/50 hover:bg-[#ff6b00]/10"
            >
              Contact Me
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ y, scale, rotate, opacity: imgOpacity }}
          className="relative mx-auto w-full max-w-sm"
        >
          <motion.div
            style={{ y: glowY }}
            className="absolute -inset-5 rounded-full bg-[#ff6b00]/15 blur-3xl"
          />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 shadow-2xl shadow-black/50 ring-1 ring-[#ff6b00]/25">
            <motion.img
              src={data.profileImage}
              alt={`${data.name} — profile`}
              className="aspect-[4/5] w-full object-cover object-top"
              style={{ scale: imgZoom }}
              onError={(e) => {
                e.currentTarget.src = '/profile.svg'
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#000000]/55 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#ff6b00] to-transparent opacity-80" />
          </div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollTo('#about')}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[#a3a3a3] transition hover:text-[#ff6b00]"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        aria-label="Scroll to about"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ArrowDown size={16} />
      </motion.button>
    </section>
  )
}
