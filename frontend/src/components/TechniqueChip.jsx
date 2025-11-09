import { motion } from 'framer-motion'
import { FiZap, FiTool, FiRefreshCw, FiUsers, FiGrid } from 'react-icons/fi'
import './TechniqueChip.css'

const TechniqueChip = ({ technique, description }) => {
  const getTechniqueIcon = (techniqueName) => {
    const name = techniqueName?.toLowerCase() || ''
    if (name.includes('metaphor')) return <FiZap />
    if (name.includes('scamper')) return <FiTool />
    if (name.includes('reverse')) return <FiRefreshCw />
    if (name.includes('role')) return <FiUsers />
    return <FiGrid />
  }

  if (!technique) return null

  return (
    <motion.div
      className="technique-chip"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="technique-chip-header">
        <div className="technique-icon">
          {getTechniqueIcon(technique)}
        </div>
        <div className="technique-info">
          <span className="technique-label">Using Technique:</span>
          <span className="technique-name">{technique}</span>
        </div>
      </div>

      {description && (
        <motion.div
          className="technique-description"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {description}
        </motion.div>
      )}
    </motion.div>
  )
}

export default TechniqueChip
