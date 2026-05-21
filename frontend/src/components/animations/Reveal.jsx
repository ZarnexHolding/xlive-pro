import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.7,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function RevealGroup({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className = '' }) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  )
}
