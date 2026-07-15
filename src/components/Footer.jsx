import { Github, Linkedin, Mail } from 'lucide-react'
import data from '../data.json'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 md:flex-row md:px-8">
        <p className="text-sm text-[#a3a3a3]">
          © {year} {data.name}. Built with React & Framer Motion.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${data.email}`}
            aria-label="Email"
            className="text-[#a3a3a3] transition hover:text-[#ff6b00]"
          >
            <Mail size={18} />
          </a>
          <a
            href={data.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-[#a3a3a3] transition hover:text-[#ff6b00]"
          >
            <Github size={18} />
          </a>
          <a
            href={data.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-[#a3a3a3] transition hover:text-[#ff6b00]"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}
