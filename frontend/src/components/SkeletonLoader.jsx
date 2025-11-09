import { motion } from 'framer-motion'
import './SkeletonLoader.css'

const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`skeleton-card ${className}`}>
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-text"></div>
            <div className="skeleton-line skeleton-text short"></div>
          </div>
        )

      case 'circle':
        return <div className={`skeleton-circle ${className}`}></div>

      case 'text':
        return <div className={`skeleton-line ${className}`}></div>

      case 'orbit':
        return (
          <div className="skeleton-orbit-container">
            <div className="skeleton-orb"></div>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="skeleton-idea-tile"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  repeatDelay: 0.5
                }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-280px) rotate(-${i * 45}deg)`
                }}
              />
            ))}
          </div>
        )

      default:
        return <div className={`skeleton-line ${className}`}></div>
    }
  }

  return (
    <div className="skeleton-loader">
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  )
}

export default SkeletonLoader
