import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlowingOrb from './GlowingOrb'
import VoiceButton from './VoiceButton'
import voiceService from '../services/voiceService'
import './WarmUpPrompts.css'

const warmupQuestions = [
  "What's the worst idea you could come up with?",
  "What if money or time weren't a constraint?",
  "What would a 5-year-old suggest?",
  "What's the most unconventional approach?",
  "What would happen if we did the opposite?",
]

const WarmUpPrompts = ({ session, updateSession, goToStep }) => {
  const [answers, setAnswers] = useState(session.warmupAnswers || [])
  const [selectedCard, setSelectedCard] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [voicePlayed, setVoicePlayed] = useState(false)

  useEffect(() => {
    // Play welcome voice for warm-up section
    if (!voicePlayed) {
      const playWelcome = async () => {
        try {
          await voiceService.speak("Let's warm up your creativity with some playful questions. Click on any question to answer it, or I can read them to you.")
          setVoicePlayed(true)
        } catch (error) {
          console.error('Error playing voice:', error)
        }
      }
      setTimeout(playWelcome, 500)
    }
  }, [voicePlayed])

  const handleQuestionClick = async (question, index) => {
    handleCardClick(index)
    // Speak the question
    try {
      await voiceService.speakQuestion(question)
    } catch (error) {
      console.error('Error playing question:', error)
    }
  }

  const handleCardClick = (index) => {
    setSelectedCard(selectedCard === index ? null : index)
    setInputValue(answers[index] || '')
  }

  const handleAnswerSubmit = async (index) => {
    const newAnswers = [...answers]
    newAnswers[index] = inputValue
    setAnswers(newAnswers)
    updateSession({ warmupAnswers: newAnswers })
    setSelectedCard(null)
    setInputValue('')
    
    // Play confirmation
    try {
      await voiceService.speak("Great answer! Let's continue with the next question.")
    } catch (error) {
      console.error('Error playing voice:', error)
    }
  }

  const handleContinue = async () => {
    // Play transition voice
    try {
      await voiceService.speak("Excellent! Now let's generate some creative ideas for your topic.")
    } catch (error) {
      console.error('Error playing voice:', error)
    }
    setTimeout(() => {
      goToStep('ideaburst')
    }, 2000)
  }

  const answeredCount = answers.filter(a => a && a.trim()).length

  return (
    <motion.div 
      className="warmup-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="warmup-header">
        <GlowingOrb size={180} pulseSpeed={3} />
        <h2 className="warmup-title">Let's Warm Up Your Creativity</h2>
        <p className="warmup-subtitle">Answer a few playful questions to get started</p>
      </div>

            <div className="warmup-cards">
        {warmupQuestions.map((question, index) => (
          <motion.div
            key={index}
            className={`warmup-card ${selectedCard === index ? 'selected' : ''} ${answers[index] ? 'answered' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuestionClick(question, index)}
          >
            <div className="card-content">
              <div className="card-number">{index + 1}</div>
              <p className="card-question">{question}</p>
              {answers[index] && (
                <div className="card-answer-preview">
                  <span className="answer-icon">✓</span>
                  <span>{answers[index].substring(0, 50)}...</span>
                </div>
              )}
            </div>

            <AnimatePresence>
              {selectedCard === index && (
                <motion.div
                  className="card-input-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your answer or use voice input..."
                    className="card-textarea"
                    autoFocus
                  />
                  <div className="card-actions">
                    <VoiceButton
                      onTranscript={(transcript) => {
                        setInputValue(transcript.trim())
                      }}
                      className="card-voice-button"
                    />
                    <button
                      className="submit-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAnswerSubmit(index)
                      }}
                      disabled={!inputValue.trim()}
                    >
                      Save
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="warmup-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="progress-indicator">
          <span>Answered: {answeredCount} / {warmupQuestions.length}</span>
        </div>
        <motion.button
          className="glow-button continue-button"
          onClick={handleContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Brainstorming →
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default WarmUpPrompts

