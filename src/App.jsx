import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Home from './pages/Home'
import ProjectOverview from './pages/ProjectOverview'
import SplashScreen from './components/SplashScreen'

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
          <SplashScreen key="splash" onDone={() => setLoading(false)} />
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
