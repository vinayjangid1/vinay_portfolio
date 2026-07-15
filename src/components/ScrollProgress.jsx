import { useEffect, useState } from 'react'
import { motion, useScroll } from 'framer-motion'

/** Thin progress bar fixed at the top of the page. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-[#ff6b00]"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
