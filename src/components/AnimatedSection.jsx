import { motion } from 'framer-motion'

const defaultVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

/**
 * Reusable scroll-reveal wrapper.
 * Fade + translateY when the section enters the viewport.
 */
export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  variants = defaultVariants,
  once = true,
  amount = 0.2,
  as: Tag = 'div',
  id,
}) {
  const MotionTag = motion.create(Tag)

  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      variants={variants}
    >
      {children}
    </MotionTag>
  )
}
