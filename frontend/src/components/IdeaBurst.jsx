import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPause, FiPlay, FiPlus, FiArrowRight, FiMessageCircle } from 'react-icons/fi'
import { FaThumbsUp, FaLightbulb, FaLaugh, FaVolumeUp } from 'react-icons/fa'
import GlowingOrb from './GlowingOrb'
import ExplorePanel from './ExplorePanel'
import VoiceChat from './VoiceChat'
import SkeletonLoader from './SkeletonLoader'
import voiceService from '../services/voiceService'
import axios from 'axios'
import './IdeaBurst.css'

const IdeaBurst = ({ session, updateSession, goToStep }) => {
  const [ideas, setIdeas] = useState(session.ideas || [])
  const [isPaused, setIsPaused] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [showExplorePanel, setShowExplorePanel] = useState(false)
  const [showVoiceChat, setShowVoiceChat] = useState(false)
  const [chatIdea, setChatIdea] = useState(null)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    // Generate initial ideas
    if (ideas.length === 0) {
      generateIdeas()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // When ideas are generated, speak them
    if (ideas.length > 0 && !isGenerating && session.topic) {
      const announceIdeas = async () => {
        try {
          await voiceService.speak(`I've generated ${ideas.length} creative ideas for ${session.topic}. Click on any idea to explore it further, or I can read them to you.`)
        } catch (error) {
          console.error('Error playing voice:', error)
        }
      }
      setTimeout(announceIdeas, 1000)
    }
  }, [ideas.length, isGenerating, session.topic])

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

  const handleIdeaClick = async (idea) => {
    setSelectedIdea(idea)
    setShowExplorePanel(true)
    updateSession({ selectedIdea: idea })
    
    // Speak the idea
    try {
      await voiceService.speakIdea(idea.text)
    } catch (error) {
      console.error('Error playing voice:', error)
    }
  }

  const handleVoiceChat = (idea) => {
    setChatIdea(idea)
    setShowVoiceChat(true)
  }

  const handlePlayIdea = async (idea, e) => {
    e.stopPropagation()
    try {
      await voiceService.speakIdea(idea.text)
    } catch (error) {
      console.error('Error playing voice:', error)
    }
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
          <button
            className="toolbar-button voice-chat-toggle"
            onClick={() => {
              if (ideas.length > 0) {
                handleVoiceChat(ideas[0])
              }
            }}
            title="Ask questions about ideas"
          >
            <FiMessageCircle />
          </button>
        </div>
      </div>

      <div className="orb-container-wrapper">
        <GlowingOrb size={240} pulseSpeed={isPaused ? 0 : 2} />
        
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
                  x: { type: "spring", stiffness: 260, damping: 20 },
                  y: { type: "spring", stiffness: 260, damping: 20 },
                  opacity: { duration: 0.3, delay: index * 0.05 },
                  scale: { duration: 0.3, delay: index * 0.05 }
                }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleIdeaClick(idea)}
              >
                <div className="tile-content">
                  <div className="tile-header">
                    <div className="tile-text">{idea.text}</div>
                    <div className="tile-actions">
                      <button
                        className="play-idea-button"
                        onClick={(e) => handlePlayIdea(idea, e)}
                        title="Listen to idea"
                      >
                        <FaVolumeUp />
                      </button>
                      <button
                        className="chat-idea-button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVoiceChat(idea)
                        }}
                        title="Ask about this idea"
                      >
                        <FiMessageCircle />
                      </button>
                    </div>
                  </div>
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

        {isGenerating && ideas.length === 0 && (
          <motion.div
            className="generating-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <SkeletonLoader type="orbit" />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showExplorePanel && selectedIdea && (
          <ExplorePanel
            idea={selectedIdea}
            topic={session.topic}
            onClose={() => {
              setShowExplorePanel(false)
              setSelectedIdea(null)
            }}
            onAddSubIdea={(subIdeaText) => addSubIdea(selectedIdea.id, subIdeaText)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVoiceChat && chatIdea && (
          <VoiceChat
            idea={chatIdea}
            topic={session.topic}
            onClose={() => {
              setShowVoiceChat(false)
              setChatIdea(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default IdeaBurst

