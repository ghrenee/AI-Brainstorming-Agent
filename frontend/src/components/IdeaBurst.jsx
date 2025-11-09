import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPause, FiPlay, FiPlus, FiArrowRight, FiMessageCircle } from 'react-icons/fi'
import { FaThumbsUp, FaLightbulb, FaLaugh, FaVolumeUp } from 'react-icons/fa'
import GlowingOrb from './GlowingOrb'
import ExplorePanel from './ExplorePanel'
import VoiceChat from './VoiceChat'
import SkeletonLoader from './SkeletonLoader'
import Timer from './Timer'
import TechniqueChip from './TechniqueChip'
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
  const [mode, setMode] = useState('untimed') // 'untimed', 'lightning', or 'deep_dive'
  const [personality, setPersonality] = useState('balanced') // Personality for technique selection
  const [technique, setTechnique] = useState(null)
  const [techniqueDescription, setTechniqueDescription] = useState(null)
  const [phaseEndTime, setPhaseEndTime] = useState(null)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const personalityOptions = [
    { value: 'high_energy', label: '⚡ Metaphor Remix', emoji: '⚡' },
    { value: 'analytical', label: '🔧 SCAMPER', emoji: '🔧' },
    { value: 'contrarian', label: '🔄 Reverse Storming', emoji: '🔄' },
    { value: 'empathetic', label: '👥 Role Storming', emoji: '👥' },
    { value: 'balanced', label: '🎯 Morphological Mix', emoji: '🎯' }
  ]

  useEffect(() => {
    // Generate initial ideas
    if (ideas.length === 0) {
      generateIdeas()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Update technique when personality changes
    if (personality) {
      const personalityToTechnique = {
        high_energy: 'Metaphor Remix',
        analytical: 'SCAMPER',
        contrarian: 'Reverse Storming',
        empathetic: 'Role Storming',
        balanced: 'Morphological Mix'
      }
      const techniqueDescriptions = {
        high_energy: 'Encourages lateral thinking by reframing the challenge through vivid analogies and playful comparisons.',
        analytical: 'Applies structured creativity—Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse.',
        contrarian: 'Flips assumptions to discover opportunities hidden in problems or constraints.',
        empathetic: 'Ideate through another person\'s perspective or stakeholder lens.',
        balanced: 'Combines fragments from multiple concepts into novel hybrids.'
      }
      setTechnique(personalityToTechnique[personality])
      setTechniqueDescription(techniqueDescriptions[personality])
    }
  }, [personality])

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
          temperature: 0.8,
          mode: mode,
          personality: personality
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

          // Set technique and timer info from response
          if (response.data.chosen_technique) {
            setTechnique(response.data.chosen_technique)
            setTechniqueDescription(response.data.technique_description)
          }
          if (response.data.phase_end_at) {
            setPhaseEndTime(response.data.phase_end_at)
          }
        }
      } catch (error) {
        console.log('Backend unavailable, using mock data')
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

  const handleTimerComplete = async () => {
    await voiceService.speak("Time's up! Let's review what we've brainstormed.")
    setIsPaused(true)
  }

  const handleExtendTime = () => {
    if (phaseEndTime) {
      const extended = new Date(new Date(phaseEndTime).getTime() + 30000).toISOString()
      setPhaseEndTime(extended)
      voiceService.speak("Added 30 more seconds. Let's keep the ideas flowing!")
    }
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    const modeNames = {
      untimed: 'Untimed',
      lightning: 'Lightning Round',
      deep_dive: 'Deep Dive'
    }
    
    // Set phase end time for timed modes
    if (newMode === 'lightning') {
      const endTime = new Date(Date.now() + 90 * 1000).toISOString()
      setPhaseEndTime(endTime)
    } else if (newMode === 'deep_dive') {
      const endTime = new Date(Date.now() + 180 * 1000).toISOString()
      setPhaseEndTime(endTime)
    } else {
      // Clear timer for untimed mode
      setPhaseEndTime(null)
    }
    
    voiceService.speak(`Switched to ${modeNames[newMode]} mode`)
  }

  return (
    <div className="ideaburst-container">
      <div className="ideaburst-header">
        <div className="header-top">
          <div className="header-left">
            <div className="header-left-content">
              <h2 className="burst-title">{session.topic}</h2>
              {session.userName && (
                <div className="username-display">Brainstorming with {session.userName}</div>
              )}
            </div>

            {/* Brainstorm Controls - Aligned at Bottom */}
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

          <div className="header-right">
            <div className="header-controls">
              {/* Mode Toggle */}
              <div className="mode-toggle-group">
                <button
                  className={`mode-toggle-btn ${mode === 'untimed' ? 'active' : ''}`}
                  onClick={() => handleModeChange('untimed')}
                >
                  Untimed ∞
                </button>
                <button
                  className={`mode-toggle-btn ${mode === 'lightning' ? 'active' : ''}`}
                  onClick={() => handleModeChange('lightning')}
                >
                  Lightning ⚡ (90s)
                </button>
                <button
                  className={`mode-toggle-btn ${mode === 'deep_dive' ? 'active' : ''}`}
                  onClick={() => handleModeChange('deep_dive')}
                >
                  Deep Dive 🌊 (3m)
                </button>
              </div>

              {/* Personality Selector */}
              <div className="personality-selector">
                <label htmlFor="personality-select" className="personality-label">
                  Technique:
                </label>
                <select
                  id="personality-select"
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  className="personality-dropdown"
                >
                  {personalityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Timer and Technique - Aligned Right */}
            <div className="timer-technique-row">
              {phaseEndTime && (
                <Timer
                  endTime={phaseEndTime}
                  mode={mode}
                  onComplete={handleTimerComplete}
                  onExtend={handleExtendTime}
                />
              )}

              {technique && (
                <TechniqueChip
                  technique={technique}
                  description={techniqueDescription}
                />
              )}
            </div>
          </div>
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

