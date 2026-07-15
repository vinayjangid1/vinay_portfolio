import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Home from './pages/Home'
import ProjectOverview from './pages/ProjectOverview'
import SplashScreen from './components/SplashScreen'
import { initAnalytics } from './lib/firebase'

const SPLASH_KEY = 'vinay-portfolio-splash-done'

function hasSeenSplash() {
  try {
    return sessionStorage.getItem(SPLASH_KEY) === '1'
  } catch {
    return false
  }
}

function markSplashDone() {
  try {
    sessionStorage.setItem(SPLASH_KEY, '1')
  } catch {
    /* ignore */
  }
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

function AppShell() {
  const [splashVisible, setSplashVisible] = useState(() => !hasSeenSplash())

  const handleSplashDone = useCallback(() => {
    markSplashDone()
    setSplashVisible(false)
  }, [])

  useEffect(() => {
    initAnalytics()
  }, [])

  return (
    <>
      <SmoothScroll enabled={!splashVisible} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectOverview />} />
      </Routes>

      <AnimatePresence>
        {splashVisible && (
          <SplashScreen key="splash" onDone={handleSplashDone} />
        )}
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="noise-overlay" aria-hidden />
      <AppShell />
    </BrowserRouter>
  )
}
