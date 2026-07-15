import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Send } from 'lucide-react'
import AnimatedSection from './AnimatedSection'
import data from '../data.json'
import { submitContactMessage } from '../lib/contact'

export default function Contact() {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const message = String(formData.get('message') || '').trim()

    setStatus('sending')
    setError('')

    try {
      await submitContactMessage({ name, email, message })
      setStatus('sent')
      form.reset()
    } catch (err) {
      console.error(err)
      setStatus('idle')
      setError('Could not send message. Please try again or email directly.')
    }
  }

  const socials = [
    { href: `mailto:${data.email}`, icon: Mail, label: 'Email' },
    { href: data.github, icon: Github, label: 'GitHub' },
    { href: data.linkedin, icon: Linkedin, label: 'LinkedIn' },
  ]

  const buttonLabel =
    status === 'sending'
      ? 'Sending…'
      : status === 'sent'
        ? 'Message sent'
        : 'Send message'

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <AnimatedSection>
          <p className="mb-3 text-sm font-medium tracking-[0.2em] text-[#ff6b00] uppercase">
            Contact
          </p>
          <h2 className="font-display max-w-xl text-3xl font-bold tracking-tight text-[#ffffff] sm:text-4xl md:text-5xl">
            Let&apos;s connect.
          </h2>
          <p className="mt-4 max-w-lg text-[#a3a3a3]">
            Open to freelance, full-time, and collaboration on mobile products.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <AnimatedSection delay={0.1} className="space-y-6">
            <a
              href={`mailto:${data.email}`}
              className="group block text-xl font-medium text-[#ffffff] transition hover:text-[#ff6b00] md:text-2xl"
            >
              {data.email}
            </a>
            <div className="flex gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#e5e5e5] transition hover:border-[#ff6b00]/40 hover:text-[#ff6b00]"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl border border-white/10 bg-[#111111]/60 p-6 backdrop-blur md:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5 text-sm">
                  <span className="text-[#a3a3a3]">Name</span>
                  <input
                    required
                    name="name"
                    type="text"
                    disabled={status === 'sending'}
                    className="w-full rounded-xl border border-white/10 bg-[#000000]/60 px-4 py-3 text-[#ffffff] outline-none transition focus:border-[#ff6b00]/50 disabled:opacity-60"
                    placeholder="Your name"
                  />
                </label>
                <label className="block space-y-1.5 text-sm">
                  <span className="text-[#a3a3a3]">Email</span>
                  <input
                    required
                    name="email"
                    type="email"
                    disabled={status === 'sending'}
                    className="w-full rounded-xl border border-white/10 bg-[#000000]/60 px-4 py-3 text-[#ffffff] outline-none transition focus:border-[#ff6b00]/50 disabled:opacity-60"
                    placeholder="you@email.com"
                  />
                </label>
              </div>
              <label className="block space-y-1.5 text-sm">
                <span className="text-[#a3a3a3]">Message</span>
                <textarea
                  required
                  name="message"
                  rows={4}
                  disabled={status === 'sending'}
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#000000]/60 px-4 py-3 text-[#ffffff] outline-none transition focus:border-[#ff6b00]/50 disabled:opacity-60"
                  placeholder="Tell me about your project…"
                />
              </label>
              {error && (
                <p className="text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}
              {status === 'sent' && (
                <p className="text-sm text-[#ff6b00]">
                  Thanks — your message was saved. Vinay will get back to you soon.
                </p>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center gap-2 rounded-full bg-[#ff6b00] px-6 py-3 text-sm font-semibold text-[#000000] transition hover:bg-[#ff8533] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={16} />
                {buttonLabel}
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
