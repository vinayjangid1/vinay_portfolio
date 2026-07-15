import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}#$'

/**
 * Special hover for the name "Vinay":
 * letter scramble, lift, orange glow, and floating spark particles.
 */
export default function NameHover({
  text = 'Vinay',
  className = '',
  as: Tag = 'span',
  showDot = true,
}) {
  const letters = text.split('')
  const [display, setDisplay] = useState(letters)
  const [hover, setHover] = useState(false)
  const [sparks, setSparks] = useState([])
  const frameRef = useRef(null)
  const cyclesRef = useRef(0)

  const scramble = useCallback(() => {
    cyclesRef.current = 0
    const target = text.split('')
    const run = () => {
      cyclesRef.current += 1
      const progress = Math.min(1, cyclesRef.current / 14)
      setDisplay(
        target.map((ch, i) => {
          if (i / target.length < progress) return ch
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        })
      )
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(run)
      } else {
        setDisplay(target)
      }
    }
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(run)
  }, [text])

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  const onEnter = () => {
    setHover(true)
    scramble()
    const burst = Array.from({ length: 12 }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      x: (Math.random() - 0.5) * 140,
      y: -20 - Math.random() * 80,
      s: 0.4 + Math.random() * 0.8,
    }))
    setSparks(burst)
  }

  const onLeave = () => {
    setHover(false)
    setDisplay(text.split(''))
    setSparks([])
  }

  return (
    <Tag
      className={`relative inline-flex cursor-default select-none ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      tabIndex={0}
      aria-label={text}
    >
      <span className="relative inline-flex">
        {display.map((ch, i) => (
          <motion.span
            key={`${i}-${ch}`}
            className="inline-block"
            animate={
              hover
                ? {
                    y: [0, -8, 0],
                    color: ['#ffffff', '#ff6b00', '#ffffff'],
                    textShadow: [
                      '0 0 0 transparent',
                      '0 0 24px rgba(255,107,0,0.85)',
                      '0 0 12px rgba(255,107,0,0.4)',
                    ],
                  }
                : { y: 0, color: '#ffffff', textShadow: '0 0 0 transparent' }
            }
            transition={{
              duration: 0.55,
              delay: i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {ch}
          </motion.span>
        ))}
        {showDot && (
          <motion.span
            className="text-[#ff6b00]"
            animate={hover ? { scale: [1, 1.4, 1], rotate: [0, 20, 0] } : { scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            .
          </motion.span>
        )}

        <motion.span
          className="pointer-events-none absolute -bottom-1 left-0 h-[3px] rounded-full bg-[#ff6b00]"
          initial={{ width: '0%', opacity: 0 }}
          animate={
            hover
              ? { width: '100%', opacity: 1 }
              : { width: '0%', opacity: 0 }
          }
          transition={{ duration: 0.35 }}
        />
      </span>

      <AnimatePresence>
        {sparks.map((s) => (
          <motion.span
            key={s.id}
            className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-[#ff6b00]"
            initial={{ opacity: 1, x: 0, y: 0, scale: s.s }}
            animate={{ opacity: 0, x: s.x, y: s.y, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </Tag>
  )
}
