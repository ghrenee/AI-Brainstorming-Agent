import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'
import voiceService from '../services/voiceService'
import './VoiceButton.css'

const VoiceButton = ({ onTranscript, disabled = false, className = '' }) => {
  const [isListening, setIsListening] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    setIsAvailable(voiceService.isSpeechRecognitionAvailable())
  }, [])

  const handleClick = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    setIsListening(true)
    voiceService.startListening(
      (transcript) => {
        setIsListening(false)
        if (onTranscript) {
          onTranscript(transcript)
        }
      },
      (error) => {
        console.error('Speech recognition error:', error)
        setIsListening(false)
        alert('Could not process voice input. Please try again or type your response.')
      }
    )
  }

  const stopListening = () => {
    voiceService.stopListening()
    setIsListening(false)
  }

  if (!isAvailable) {
    return null
  }

  return (
    <motion.button
      className={`voice-button ${isListening ? 'listening' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={isListening ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
    >
      {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
      <span className="voice-button-text">
        {isListening ? 'Listening...' : 'Voice Input'}
      </span>
    </motion.button>
  )
}

export default VoiceButton

