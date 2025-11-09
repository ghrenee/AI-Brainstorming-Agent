import { useState } from 'react'
import { motion } from 'framer-motion'
import GlowingOrb from './GlowingOrb'
import './WrapUp.css'

const WrapUp = ({ session, updateSession, goToStep }) => {
  const [reflection, setReflection] = useState('')
  const [showSummary, setShowSummary] = useState(false)
  const [orbDimmed, setOrbDimmed] = useState(false)

  const handleShowSummary = () => {
    setShowSummary(true)
    setTimeout(() => setOrbDimmed(true), 500)
  }

  const generateSummary = () => {
    const totalIdeas = session.ideas?.length || 0
    const avgNovelty = session.ideas?.reduce((sum, idea) => sum + idea.novelty, 0) / totalIdeas || 0
    const totalReactions = session.ideas?.reduce((sum, idea) => {
      return sum + Object.values(idea.reactions || {}).reduce((a, b) => a + b, 0)
    }, 0) || 0

    return {
      topic: session.topic,
      totalIdeas,
      avgNovelty: avgNovelty.toFixed(2),
      totalReactions,
      topIdeas: session.ideas?.slice().sort((a, b) => b.novelty - a.novelty).slice(0, 3) || []
    }
  }

  const summary = showSummary ? generateSummary() : null

  return (
    <motion.div
      className="wrapup-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="wrapup-content">
        <motion.div
          className="orb-wrapper"
          animate={{
            opacity: orbDimmed ? 0.3 : 1,
            scale: orbDimmed ? 0.8 : 1
          }}
          transition={{ duration: 1 }}
        >
          <GlowingOrb size={200} pulseSpeed={orbDimmed ? 6 : 3} />
        </motion.div>

        <motion.div
          className="wrapup-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="wrapup-title">Great session, {session.userName}!</h2>
          <p className="wrapup-subtitle">
            You've explored {session.ideas?.length || 0} unique ideas around "{session.topic}"
          </p>
        </motion.div>

        {!showSummary && (
          <motion.div
            className="wrapup-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              className="glow-button summary-button"
              onClick={handleShowSummary}
            >
              Show Summary
            </button>
            <button
              className="glow-button pick-button"
              onClick={() => {
                // Navigate back to organize to pick an idea
                goToStep('organize')
              }}
            >
              Ready to Pick One?
            </button>
          </motion.div>
        )}

        {showSummary && summary && (
          <motion.div
            className="summary-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="summary-title">Session Summary</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Topic</span>
                <span className="stat-value">{summary.topic}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Ideas</span>
                <span className="stat-value">{summary.totalIdeas}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg. Novelty</span>
                <span className="stat-value">{summary.avgNovelty}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Reactions</span>
                <span className="stat-value">{summary.totalReactions}</span>
              </div>
            </div>

            {summary.topIdeas.length > 0 && (
              <div className="top-ideas">
                <h4 className="top-ideas-title">Top Ideas by Novelty</h4>
                <ul className="top-ideas-list">
                  {summary.topIdeas.map((idea, index) => (
                    <li key={idea.id} className="top-idea-item">
                      <span className="idea-rank">#{index + 1}</span>
                      <span className="idea-text">{idea.text}</span>
                      <span className="idea-novelty">✨ {idea.novelty.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          className="reflection-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: showSummary ? 1 : 0 }}
          transition={{ delay: showSummary ? 0.6 : 0 }}
        >
          <label htmlFor="reflection" className="reflection-label">
            Any final thoughts or reflections?
          </label>
          <textarea
            id="reflection"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Share your thoughts about this brainstorming session..."
            className="reflection-input"
            rows="4"
          />
        </motion.div>

        {showSummary && (
          <motion.div
            className="wrapup-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <button
              className="glow-button finish-button"
              onClick={() => {
                // Save reflection and finish
                updateSession({ reflection })
                alert('Session saved! Thank you for brainstorming with us.')
              }}
            >
              Save & Finish
            </button>
            <button
              className="glow-button restart-button"
              onClick={() => {
                // Reset and start new session
                if (confirm('Start a new brainstorming session?')) {
                  window.location.reload()
                }
              }}
            >
              Start New Session
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default WrapUp

