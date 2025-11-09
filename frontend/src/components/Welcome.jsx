import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlowingOrb from './GlowingOrb'
import VoiceButton from './VoiceButton'
import VoiceConversation from './VoiceConversation'
import VoiceCallModal from './VoiceCallModal'
import voiceService from '../services/voiceService'
import { FaMicrophone } from 'react-icons/fa'
import './Welcome.css'

const Welcome = ({ session, updateSession, goToStep }) => {
  const [userName, setUserName] = useState(session.userName || '')
  const [userUnique, setUserUnique] = useState(session.userUnique || '')
  const [topic, setTopic] = useState(session.topic || '')
  const [showGreeting, setShowGreeting] = useState(true)
  const [voicePlayed, setVoicePlayed] = useState(false)
  const [showVoiceConversation, setShowVoiceConversation] = useState(false)
  const [showVoiceCallModal, setShowVoiceCallModal] = useState(false)

  useEffect(() => {
    // Play welcome voice greeting on mount
    if (!voicePlayed) {
      const playWelcome = async () => {
        try {
          await voiceService.welcomeUser()
          setVoicePlayed(true)
        } catch (error) {
          console.error('Error playing welcome voice:', error)
        }
      }
      // Small delay to let page load
      setTimeout(playWelcome, 1000)
    }
  }, [voicePlayed])

  const handleContinue = async () => {
    if (userName && topic) {
      updateSession({ userName, userUnique, topic })
      
      // Play confirmation voice
      try {
        await voiceService.speak(`Great! Let's start brainstorming about ${topic}. Get ready for some warm-up questions!`)
      } catch (error) {
        console.error('Error playing voice:', error)
      }
      
      setTimeout(() => {
        goToStep('warmup')
      }, 2000)
    }
  }

  const handleVoiceConversationComplete = (data) => {
    // Extract information from voice conversation
    updateSession({
      userName: data.userName || userName,
      userUnique: data.userUnique || userUnique,
      topic: data.topic || topic,
      conversationHistory: data.conversationHistory
    })
    
    // Go to warmup
    setTimeout(() => {
      goToStep('warmup')
    }, 500)
  }

  const handleVoiceConversationSkip = () => {
    setShowVoiceConversation(false)
  }

  const handleVoiceTranscript = (transcript) => {
    // Auto-fill fields based on voice input
    if (!userName && transcript.toLowerCase().includes('name')) {
      // Extract name from transcript (simple heuristic)
      const nameMatch = transcript.match(/(?:name is|i'm|i am|call me)\s+([a-zA-Z]+)/i)
      if (nameMatch) {
        setUserName(nameMatch[1])
      }
    } else if (!topic && transcript.length > 10) {
      // If topic is empty and we have substantial input, use it as topic
      setTopic(transcript.trim())
    }
  }

  // Show voice conversation if user clicks voice button
  if (showVoiceConversation) {
    return (
      <VoiceConversation
        onComplete={handleVoiceConversationComplete}
        onSkip={handleVoiceConversationSkip}
      />
    )
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
          size={280}
          pulseSpeed={2}
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

        <motion.button
          className="voice-conversation-button"
          onClick={() => setShowVoiceCallModal(true)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaMicrophone />
          <span>Start Voice Conversation</span>
          <span className="button-subtitle">Tell me your idea and let's discuss it together</span>
        </motion.button>

        {/* Voice Call Modal */}
        {showVoiceCallModal && (
          <VoiceCallModal
            onStartCall={() => {
              setShowVoiceCallModal(false)
              setShowVoiceConversation(true)
            }}
            onClose={() => setShowVoiceCallModal(false)}
          />
        )}

        <motion.div
          className="welcome-form"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="form-group">
            <label htmlFor="userName">Your Name</label>
            <div className="input-with-voice">
              <input
                id="userName"
                type="text"
                placeholder="Enter your name or use voice"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="glow-input"
              />
              <VoiceButton
                onTranscript={(transcript) => {
                  const nameMatch = transcript.match(/(?:name is|i'm|i am|call me)\s+([a-zA-Z]+)/i)
                  if (nameMatch) {
                    setUserName(nameMatch[1])
                  } else if (transcript.length < 50) {
                    setUserName(transcript.trim())
                  }
                }}
                className="input-voice-button"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userUnique">What's something unique about how you think?</label>
            <div className="input-with-voice">
              <textarea
                id="userUnique"
                placeholder="Tell me something unique about your thinking style... or use voice"
                value={userUnique}
                onChange={(e) => setUserUnique(e.target.value)}
                className="glow-input"
                rows="3"
              />
              <VoiceButton
                onTranscript={(transcript) => setUserUnique(transcript.trim())}
                className="input-voice-button"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="topic">What are we brainstorming today?</label>
            <div className="input-with-voice">
              <input
                id="topic"
                type="text"
                placeholder="Enter your brainstorming topic or use voice"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
                className="glow-input topic-input"
              />
              <VoiceButton
                onTranscript={(transcript) => setTopic(transcript.trim())}
                className="input-voice-button"
              />
            </div>
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

