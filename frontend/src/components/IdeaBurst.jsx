import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPause, FiPlay, FiPlus, FiArrowRight } from 'react-icons/fi'
import { FaThumbsUp, FaLightbulb, FaLaugh } from 'react-icons/fa'
import GlowingOrb from './GlowingOrb'
import ExplorePanel from './ExplorePanel'
import axios from 'axios'
import './IdeaBurst.css'

const IdeaBurst = ({ session, updateSession, goToStep }) => {
  const [ideas, setIdeas] = useState(session.ideas || [])
  const [isPaused, setIsPaused] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [showExplorePanel, setShowExplorePanel] = useState(false)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    // Generate initial ideas
    if (ideas.length === 0) {
      generateIdeas()
    }
  }, [])

  const generateIdeas = async () => {
    setIsGenerating(true)
    try {
      // Mock ideas for now (replace with API call later)
      const mockIdeas = generateMockIdeas(session.topic, 8)
      
      // If backend is available, try to use it
      try {
        const response = await axios.post(`${BACKEND_URL}/brainstorm`, {
          prompt: session.topic,
          max_ideas: 8,
          temperature: 0.8
        })
        if (response.data && response.data.ideas) {
          const formattedIdeas = response.data.ideas.map((idea, index) => ({
            id: Date.now() + index,
            text: idea.text,
            novelty: idea.novelty || Math.random(),
            sentiment: idea.sentiment || Math.random(),
            reactions: { thumbsUp: 0, lightbulb: 0, laugh: 0 },
            expanded: false,
            subIdeas: []
          }))
          setIdeas(formattedIdeas)
          updateSession({ ideas: formattedIdeas })
        }
      } catch (error) {
        // Fallback to mock ideas
        setIdeas(mockIdeas)
        updateSession({ ideas: mockIdeas })
      }
    } catch (error) {
      console.error('Error generating ideas:', error)
      // Use mock ideas as fallback
      const mockIdeas = generateMockIdeas(session.topic, 8)
      setIdeas(mockIdeas)
      updateSession({ ideas: mockIdeas })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMockIdeas = (topic, count) => {
    const mockTemplates = [
      `Leverage ${topic} through community micro-grants`,
      `Gamify ${topic} with digital rewards`,
      `Partner with local schools for ${topic} innovation`,
      `Use biodegradable solutions for ${topic}`,
      `Adopt open-source tracking for ${topic}`,
      `Create ${topic} marketplace with blockchain`,
      `Design ${topic} app with AR integration`,
      `Build ${topic} platform using AI matching`,
    ]
    return mockTemplates.slice(0, count).map((text, index) => ({
      id: Date.now() + index,
      text: text.replace(topic, session.topic),
      novelty: 0.5 + Math.random() * 0.5,
      sentiment: 0.3 + Math.random() * 0.5,
      reactions: { thumbsUp: 0, lightbulb: 0, laugh: 0 },
      expanded: false,
      subIdeas: []
    }))
  }

  const handleIdeaClick = (idea) => {
    setSelectedIdea(idea)
    setShowExplorePanel(true)
    updateSession({ selectedIdea: idea })
  }

  const handleReaction = (ideaId, reactionType, e) => {
    e.stopPropagation()
    const updatedIdeas = ideas.map(idea => {
      if (idea.id === ideaId) {
        return {
          ...idea,
          reactions: {
            ...idea.reactions,
            [reactionType]: idea.reactions[reactionType] + 1
          }
        }
      }
      return idea
    })
    setIdeas(updatedIdeas)
    updateSession({ ideas: updatedIdeas })
  }

  const addSubIdea = (parentId, subIdeaText) => {
    const updatedIdeas = ideas.map(idea => {
      if (idea.id === parentId) {
        return {
          ...idea,
          subIdeas: [
            ...idea.subIdeas,
            {
              id: Date.now(),
              text: subIdeaText,
              novelty: 0.5 + Math.random() * 0.5
            }
          ]
        }
      }
      return idea
    })
    setIdeas(updatedIdeas)
    updateSession({ ideas: updatedIdeas })
  }

  const getOrbitPosition = (index, total, radius = 250) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    return { x, y, angle }
  }

  return (
    <div className="ideaburst-container">
      <div className="ideaburst-header">
        <h2 className="burst-title">{session.topic}</h2>
        <div className="toolbar">
          <button
            className="toolbar-button"
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <FiPlay /> : <FiPause />}
          </button>
          <button
            className="toolbar-button"
            onClick={generateIdeas}
            disabled={isGenerating}
            title="Generate More Ideas"
          >
            <FiPlus />
          </button>
          <button
            className="toolbar-button"
            onClick={() => goToStep('organize')}
            title="Organize & Export"
          >
            <FiArrowRight />
          </button>
        </div>
      </div>

      <div className="orb-container-wrapper">
        <GlowingOrb size={220} pulseSpeed={isPaused ? 0 : 3} />
        
        <div className="ideas-orbit">
          {ideas.map((idea, index) => {
            const position = getOrbitPosition(index, ideas.length, 280)
            return (
              <motion.div
                key={idea.id}
                className="idea-tile"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: position.x,
                  y: position.y,
                }}
                transition={{
                  x: { type: "spring", stiffness: 100, damping: 15 },
                  y: { type: "spring", stiffness: 100, damping: 15 },
                  opacity: { duration: 0.5, delay: index * 0.1 },
                  scale: { duration: 0.5, delay: index * 0.1 }
                }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleIdeaClick(idea)}
              >
                <div className="tile-content">
                  <div className="tile-text">{idea.text}</div>
                  <div className="tile-meta">
                    <span className="novelty-badge">✨ {idea.novelty.toFixed(2)}</span>
                  </div>
                  <div className="tile-reactions">
                    <button
                      className="reaction-button"
                      onClick={(e) => handleReaction(idea.id, 'thumbsUp', e)}
                      title="Thumbs Up"
                    >
                      <FaThumbsUp /> {idea.reactions.thumbsUp || ''}
                    </button>
                    <button
                      className="reaction-button"
                      onClick={(e) => handleReaction(idea.id, 'lightbulb', e)}
                      title="Lightbulb"
                    >
                      <FaLightbulb /> {idea.reactions.lightbulb || ''}
                    </button>
                    <button
                      className="reaction-button"
                      onClick={(e) => handleReaction(idea.id, 'laugh', e)}
                      title="Laugh"
                    >
                      <FaLaugh /> {idea.reactions.laugh || ''}
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {isGenerating && (
          <motion.div
            className="generating-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="generating-spinner"></div>
            <p>Generating ideas...</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showExplorePanel && selectedIdea && (
          <ExplorePanel
            idea={selectedIdea}
            onClose={() => {
              setShowExplorePanel(false)
              setSelectedIdea(null)
            }}
            onAddSubIdea={(subIdeaText) => addSubIdea(selectedIdea.id, subIdeaText)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default IdeaBurst

