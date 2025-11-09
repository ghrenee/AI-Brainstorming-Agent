import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMap, FiFileText, FiList, FiDownload, FiArrowLeft } from 'react-icons/fi'
import './OrganizeExport.css'

const OrganizeExport = ({ session, updateSession, goToStep }) => {
  const [viewMode, setViewMode] = useState(session.viewMode || 'mindmap')

  const handleExport = (format) => {
    // Placeholder for export functionality
    const data = {
      topic: session.topic,
      userName: session.userName,
      ideas: session.ideas,
      warmupAnswers: session.warmupAnswers,
      timestamp: new Date().toISOString()
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `brainstorm-${session.topic.replace(/\s+/g, '-')}-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else if (format === 'pdf') {
      // Placeholder for PDF export
      alert('PDF export coming soon!')
    }
  }

  const renderMindMap = () => {
    return (
      <div className="mindmap-view">
        <div className="mindmap-center">
          <div className="center-node">{session.topic}</div>
        </div>
        <div className="mindmap-nodes">
          {session.ideas?.map((idea, index) => (
            <motion.div
              key={idea.id}
              className="mindmap-node"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="node-content">
                <div className="node-text">{idea.text}</div>
                <div className="node-meta">
                  <span className="node-novelty">✨ {idea.novelty.toFixed(2)}</span>
                </div>
              </div>
              <div className="node-connector"></div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  const renderStickyNotes = () => {
    return (
      <div className="sticky-notes-view">
        {session.ideas?.map((idea, index) => (
          <motion.div
            key={idea.id}
            className="sticky-note"
            initial={{ opacity: 0, rotate: -5, y: 20 }}
            animate={{ opacity: 1, rotate: 0, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              backgroundColor: `hsl(${(index * 30) % 360}, 70%, 85%)`,
              color: '#1a1f3a'
            }}
          >
            <div className="note-content">
              <div className="note-text">{idea.text}</div>
              <div className="note-footer">
                <span className="note-novelty">Novelty: {idea.novelty.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  const renderOutline = () => {
    return (
      <div className="outline-view">
        <div className="outline-header">
          <h2 className="outline-title">{session.topic}</h2>
          <p className="outline-subtitle">Brainstorming Session Summary</p>
        </div>
        <div className="outline-content">
          <section className="outline-section">
            <h3 className="section-heading">Warm-up Responses</h3>
            <ul className="outline-list">
              {session.warmupAnswers?.map((answer, index) => (
                <li key={index} className="outline-item">
                  {answer}
                </li>
              ))}
            </ul>
          </section>
          <section className="outline-section">
            <h3 className="section-heading">Generated Ideas ({session.ideas?.length || 0})</h3>
            <ol className="outline-list numbered">
              {session.ideas?.map((idea, index) => (
                <li key={idea.id} className="outline-item">
                  <div className="idea-outline">
                    <span className="idea-text">{idea.text}</span>
                    <span className="idea-stats">
                      Novelty: {idea.novelty.toFixed(2)} | 
                      Reactions: {Object.values(idea.reactions || {}).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                  {idea.subIdeas && idea.subIdeas.length > 0 && (
                    <ul className="sub-ideas-outline">
                      {idea.subIdeas.map((subIdea) => (
                        <li key={subIdea.id} className="sub-idea-outline">
                          {subIdea.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="organize-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="organize-header">
        <button
          className="back-button"
          onClick={() => goToStep('ideaburst')}
        >
          <FiArrowLeft /> Back to Ideas
        </button>
        <h2 className="organize-title">Organize & Export</h2>
      </div>

      <div className="view-switcher">
        <button
          className={`view-button ${viewMode === 'mindmap' ? 'active' : ''}`}
          onClick={() => setViewMode('mindmap')}
        >
          <FiMap /> Mind Map
        </button>
        <button
          className={`view-button ${viewMode === 'sticky' ? 'active' : ''}`}
          onClick={() => setViewMode('sticky')}
        >
          <FiFileText /> Sticky Notes
        </button>
        <button
          className={`view-button ${viewMode === 'outline' ? 'active' : ''}`}
          onClick={() => setViewMode('outline')}
        >
          <FiList /> Outline
        </button>
      </div>

      <div className="view-content">
        {viewMode === 'mindmap' && renderMindMap()}
        {viewMode === 'sticky' && renderStickyNotes()}
        {viewMode === 'outline' && renderOutline()}
      </div>

      <div className="export-section">
        <h3 className="export-title">Export Your Session</h3>
        <div className="export-buttons">
          <button
            className="export-button"
            onClick={() => handleExport('json')}
          >
            <FiDownload /> Export as JSON
          </button>
          <button
            className="export-button"
            onClick={() => handleExport('pdf')}
          >
            <FiDownload /> Export as PDF
          </button>
        </div>
      </div>

      <div className="organize-footer">
        <button
          className="glow-button continue-button"
          onClick={() => goToStep('wrapup')}
        >
          Continue to Wrap-up →
        </button>
      </div>
    </motion.div>
  )
}

export default OrganizeExport

