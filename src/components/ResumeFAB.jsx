import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Github, Linkedin, Mail, Plus, X } from 'lucide-react'
import data from '../data.json'

const actions = [
  {
    id: 'email',
    label: 'Email',
    href: `mailto:${data.email}`,
    icon: Mail,
    external: false,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: data.linkedin,
    icon: Linkedin,
    external: true,
  },
  {
    id: 'github',
    label: 'GitHub',
    href: data.github,
    icon: Github,
    external: true,
  },
  {
    id: 'resume',
    label: 'Resume',
    href: data.resume || '/resume.pdf',
    icon: Download,
    external: false,
    download: 'Vinay-Resume.pdf',
  },
]

/** Floating action cluster: LinkedIn, email, GitHub + resume. */
export default function ResumeFAB() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed right-5 bottom-5 z-[55] flex flex-col items-end gap-3 md:right-8 md:bottom-8">
      <AnimatePresence>
        {open &&
          actions.map((action, i) => {
            const Icon = action.icon
            return (
              <motion.a
                key={action.id}
                href={action.href}
                download={action.download}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 16, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 22,
                  delay: i * 0.04,
                }}
                className="group flex items-center gap-2"
                aria-label={action.label}
              >
                <span className="hidden rounded-full border border-white/10 bg-[#111111] px-3 py-1.5 text-xs font-medium text-[#e5e5e5] opacity-0 shadow-lg transition group-hover:opacity-100 sm:block">
                  {action.label}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#111111] text-[#ffffff] shadow-xl shadow-black/40 transition hover:border-[#ff6b00]/60 hover:bg-[#ff6b00] hover:text-[#000000]">
                  <Icon size={18} />
                </span>
              </motion.a>
            )
          })}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={open ? 'Close quick links' : 'Open social links'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#ff6b00] text-[#000000] shadow-[0_0_32px_rgba(255,107,0,0.45)]"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -6, 0] }}
        transition={{
          y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
          scale: { type: 'spring', stiffness: 400, damping: 18 },
        }}
      >
        <motion.span
          className="absolute inset-0 rounded-full border border-[#ff6b00]"
          animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
        {open ? <X size={22} strokeWidth={2.5} /> : <Plus size={24} strokeWidth={2.5} />}
      </motion.button>
    </div>
  )
}
