import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import NameHover from './NameHover'
import data from '../data.json'

const links = [
  { href: '#about', label: 'About' },
  { href: '#ios', label: 'iOS' },
  { href: '#projects', label: 'Experience' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar({ activeSection }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleNav = (e, href) => {
    e.preventDefault()
    setOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-50 flex justify-center px-4 pt-4 md:pt-5">
      {/* Floating circular / pill nav */}
      <motion.nav
        initial={false}
        animate={{
          width: scrolled || open ? 'min(100%, 720px)' : 'min(100%, 920px)',
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className={`pointer-events-auto relative flex w-full max-w-[920px] items-center justify-between gap-3 rounded-full px-4 py-2.5 transition-[background,backdrop-filter,border-color,box-shadow] duration-400 md:px-5 md:py-3 ${
          scrolled || open
            ? 'border border-white/15 bg-black/45 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150'
            : 'border border-transparent bg-transparent'
        }`}
      >
        <a
          href="#hero"
          onClick={(e) => handleNav(e, '#hero')}
          className="font-display shrink-0 text-base font-bold tracking-tight md:text-lg"
        >
          <NameHover text={data.name} className="text-base font-bold md:text-lg" />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const id = link.href.slice(1)
            const isActive = activeSection === id
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white/10 text-[#ffffff]'
                      : 'text-[#a3a3a3] hover:bg-white/5 hover:text-[#ffffff]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-[#ff6b00]/15 ring-1 ring-[#ff6b00]/35"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            onClick={(e) => handleNav(e, '#contact')}
            className="hidden rounded-full bg-[#ff6b00] px-4 py-2 text-sm font-semibold text-[#000000] transition hover:bg-[#ff8533] md:inline-flex"
          >
            Let&apos;s talk
          </a>

          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded-full text-[#ffffff] transition md:hidden ${
              scrolled || open ? 'bg-white/10' : 'bg-white/5'
            }`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile dropdown — also circular/glass */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="absolute top-[calc(100%+10px)] left-0 right-0 overflow-hidden rounded-[1.75rem] border border-white/15 bg-black/55 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:hidden"
            >
              <ul className="flex flex-col gap-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNav(e, link.href)}
                      className={`block rounded-full px-4 py-3 text-base font-medium transition ${
                        activeSection === link.href.slice(1)
                          ? 'bg-[#ff6b00]/15 text-[#ff6b00]'
                          : 'text-[#ffffff] hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li className="pt-2">
                  <a
                    href="#contact"
                    onClick={(e) => handleNav(e, '#contact')}
                    className="block rounded-full bg-[#ff6b00] px-4 py-3 text-center text-sm font-semibold text-[#000000]"
                  >
                    Let&apos;s talk
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  )
}
