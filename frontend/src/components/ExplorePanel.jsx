import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiPlus } from 'react-icons/fi'
import './ExplorePanel.css'

const ExplorePanel = ({ idea, onClose, onAddSubIdea }) => {
  const [subIdeaText, setSubIdeaText] = useState('')
  const [showInput, setShowInput] = useState(false)

  const branchingQuestions = [
    "What are the key components of this idea?",
    "What challenges might we face?",
    "Who would benefit most from this?",
    "How could we make this more innovative?",
    "What's the first step to implement this?",
  ]

  const handleAddSubIdea = () => {
    if (subIdeaText.trim()) {
      onAddSubIdea(subIdeaText)
      setSubIdeaText('')
      setShowInput(false)
    }
  }

  return (
    <motion.div
      className="explore-panel-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="explore-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-header">
          <h3 className="panel-title">Explore: {idea.text}</h3>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="panel-content">
          <div className="idea-details">
            <div className="detail-item">
              <span className="detail-label">Novelty Score:</span>
              <span className="detail-value">{idea.novelty.toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Sentiment:</span>
              <span className="detail-value">{(idea.sentiment * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div className="branching-questions">
            <h4 className="section-title">Deeper Questions</h4>
            <div className="questions-list">
              {branchingQuestions.map((question, index) => (
                <motion.div
                  key={index}
                  className="question-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setSubIdeaText(question + ' ')
                    setShowInput(true)
                  }}
                >
                  <p>{question}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="sub-ideas-section">
            <h4 className="section-title">
              Related Ideas ({idea.subIdeas?.length || 0})
            </h4>
            {idea.subIdeas && idea.subIdeas.length > 0 && (
              <div className="sub-ideas-list">
                {idea.subIdeas.map((subIdea) => (
                  <div key={subIdea.id} className="sub-idea-item">
                    <span className="sub-idea-bullet">•</span>
                    <span className="sub-idea-text">{subIdea.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="add-idea-section">
            {showInput ? (
              <div className="add-idea-input">
                <textarea
                  value={subIdeaText}
                  onChange={(e) => setSubIdeaText(e.target.value)}
                  placeholder="Add a related idea or answer..."
                  className="idea-textarea"
                  rows="3"
                  autoFocus
                />
                <div className="input-actions">
                  <button
                    className="cancel-button"
                    onClick={() => {
                      setShowInput(false)
                      setSubIdeaText('')
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="add-button"
                    onClick={handleAddSubIdea}
                    disabled={!subIdeaText.trim()}
                  >
                    Add Idea
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="add-idea-button"
                onClick={() => setShowInput(true)}
              >
                <FiPlus /> Add Related Idea
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ExplorePanel

