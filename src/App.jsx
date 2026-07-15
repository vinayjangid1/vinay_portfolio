import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Home from './pages/Home'
import ProjectOverview from './pages/ProjectOverview'
import data from './data.json'

function PageLoader({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="font-display text-3xl font-bold tracking-tight text-[#ffffff]">
          {data.name}
          <span className="text-[#ff6b00]">.</span>
        </p>
        <motion.div
          className="mx-auto mt-6 h-0.5 w-24 origin-left bg-[#ff6b00]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </motion.div>
  )
}

function SmoothScroll({ enabled }) {
  const location = useLocation()

  useEffect(() => {
    if (!enabled) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let frame
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [enabled, location.pathname])

  return null
}

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <BrowserRouter>
      <div className="noise-overlay" aria-hidden />
      <AnimatePresence mode="wait">
        {loading && (
          <PageLoader key="loader" onDone={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {!loading && (
        <>
          <SmoothScroll enabled />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectOverview />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  )
}
