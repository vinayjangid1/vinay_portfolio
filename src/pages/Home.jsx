import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import FlutterNameFill from '../components/FlutterNameFill'
import About from '../components/About'
import IosDemo from '../components/IosDemo'
import Projects from '../components/Projects'
import Testimonials from '../components/Testimonials'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import ScrollProgress from '../components/ScrollProgress'
import ResumeFAB from '../components/ResumeFAB'
import SEO from '../components/SEO'

const SECTION_IDS = ['hero', 'about', 'ios', 'projects', 'testimonials', 'contact']

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero')
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80)
      }
    }
  }, [location])

  useEffect(() => {
    const observers = []
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: '-40% 0px -45% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <>
      <SEO />
      <ScrollProgress />
      <Navbar activeSection={activeSection} />
      <main>
        <Hero />
        <FlutterNameFill />
        <Stats />
        <About />
        <IosDemo />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ResumeFAB />
    </>
  )
}
