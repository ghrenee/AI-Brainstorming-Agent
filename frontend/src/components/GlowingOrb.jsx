import { motion } from 'framer-motion'
import './GlowingOrb.css'

const GlowingOrb = ({ size = 200, pulseSpeed = 3, showLabel = false, label = '', className = '' }) => {
  return (
    <div className={`orb-container ${className}`}>
      <motion.div
        className="orb"
        style={{
          width: size,
          height: size,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="orb-inner">
          <div className="orb-core"></div>
          <div className="orb-glow orb-glow-1"></div>
          <div className="orb-glow orb-glow-2"></div>
          <div className="orb-glow orb-glow-3"></div>
        </div>
      </motion.div>
      {showLabel && label && (
        <motion.div
          className="orb-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {label}
        </motion.div>
      )}
    </div>
  )
}

export default GlowingOrb

