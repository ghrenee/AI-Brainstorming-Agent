import { useState } from 'react'
import { motion } from 'framer-motion'
import GlowingOrb from './GlowingOrb'
import './Welcome.css'

const Welcome = ({ session, updateSession, goToStep }) => {
  const [userName, setUserName] = useState(session.userName || '')
  const [userUnique, setUserUnique] = useState(session.userUnique || '')
  const [topic, setTopic] = useState(session.topic || '')
  const [showGreeting, setShowGreeting] = useState(true)

  const handleContinue = () => {
    if (userName && topic) {
      updateSession({ userName, userUnique, topic })
      // Mock voice greeting (placeholder for ElevenLabs)
      setTimeout(() => {
        goToStep('warmup')
      }, 500)
    }
  }

  return (
    <motion.div 
      className="welcome-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="welcome-content">
        <GlowingOrb 
          size={250} 
          pulseSpeed={3}
          showLabel={topic.length > 0}
          label={topic}
          className="welcome-orb"
        />

        {showGreeting && (
          <motion.div
            className="greeting-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p>Welcome! I'm your AI brainstorming facilitator.</p>
            <p className="greeting-subtitle">Let's explore ideas together.</p>
          </motion.div>
        )}

        <motion.div
          className="welcome-form"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="form-group">
            <label htmlFor="userName">Your Name</label>
            <input
              id="userName"
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="glow-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="userUnique">What's something unique about how you think?</label>
            <textarea
              id="userUnique"
              placeholder="Tell me something unique about your thinking style..."
              value={userUnique}
              onChange={(e) => setUserUnique(e.target.value)}
              className="glow-input"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="topic">What are we brainstorming today?</label>
            <input
              id="topic"
              type="text"
              placeholder="Enter your brainstorming topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
              className="glow-input topic-input"
            />
          </div>

          <motion.button
            className="glow-button continue-button"
            onClick={handleContinue}
            disabled={!userName || !topic}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Begin
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Welcome

