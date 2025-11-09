import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaTimes } from 'react-icons/fa'
import { FiSend } from 'react-icons/fi'
import voiceService from '../services/voiceService'
import axios from 'axios'
import './VoiceChat.css'

const VoiceChat = ({ idea, topic, onClose, embedded = false }) => {
  const [messages, setMessages] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [inputText, setInputText] = useState('')
  const [showChat, setShowChat] = useState(true)
  const messagesEndRef = useRef(null)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    // Initial greeting
    const initialGreeting = `I can help you explore the idea: "${idea.text}". What would you like to know about it?`
    setMessages([{
      id: 1,
      type: 'assistant',
      text: initialGreeting,
      timestamp: new Date()
    }])
    
    // Speak initial greeting
    voiceService.speak(initialGreeting).catch(console.error)
  }, [idea])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleVoiceInput = () => {
    if (isListening) {
      voiceService.stopListening()
      setIsListening(false)
      return
    }

    setIsListening(true)
    voiceService.startListening(
      async (transcript) => {
        setIsListening(false)
        setInputText(transcript)
        await handleSendMessage(transcript)
      },
      (error) => {
        console.error('Voice recognition error:', error)
        setIsListening(false)
        alert('Could not process voice input. Please try again or type your question.')
      }
    )
  }

  const handleSendMessage = async (text = null) => {
    const question = text || inputText.trim()
    if (!question) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: question,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsProcessing(true)

    try {
      // Call backend to get answer
      const response = await axios.post(`${BACKEND_URL}/ask-about-idea`, {
        question: question,
        idea_text: idea.text,
        topic: topic,
        context: idea.subIdeas?.map(si => si.text).join(', ') || ''
      })

      const answer = response.data.answer
      const followups = response.data.suggested_followups || []

      // Add assistant message
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: answer,
        timestamp: new Date(),
        followups: followups
      }
      setMessages(prev => [...prev, assistantMessage])

      // Speak the answer
      await voiceService.speak(answer)
    } catch (error) {
      console.error('Error getting answer:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: "I'm sorry, I couldn't process your question right now. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      await voiceService.speak(errorMessage.text)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFollowupClick = (followup) => {
    setInputText(followup)
    handleSendMessage(followup)
  }

  const handlePlayMessage = async (text) => {
    await voiceService.speak(text)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <AnimatePresence>
      {showChat && (
        <motion.div
          className={`voice-chat-container ${embedded ? 'embedded' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="voice-chat-header">
            <div className="chat-header-info">
              <h3>Ask About Idea</h3>
              <p className="idea-preview">{idea.text.substring(0, 50)}...</p>
            </div>
            <button className="close-chat-button" onClick={() => {
              setShowChat(false)
              if (onClose) onClose()
            }}>
              <FaTimes />
            </button>
          </div>

          <div className="voice-chat-messages">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`chat-message ${message.type}`}
                initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  {message.type === 'assistant' && (
                    <button
                      className="play-message-button"
                      onClick={() => handlePlayMessage(message.text)}
                      title="Listen to response"
                    >
                      <FaVolumeUp />
                    </button>
                  )}
                </div>
                {message.followups && message.followups.length > 0 && (
                  <div className="followup-questions">
                    <p className="followup-label">Suggested questions:</p>
                    {message.followups.map((followup, index) => (
                      <button
                        key={index}
                        className="followup-button"
                        onClick={() => handleFollowupClick(followup)}
                      >
                        {followup}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            {isProcessing && (
              <div className="chat-message assistant processing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="voice-chat-input">
            <div className="input-container">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about this idea..."
                className="chat-input"
                rows="2"
              />
              <div className="input-actions">
                <button
                  className={`voice-input-button ${isListening ? 'listening' : ''}`}
                  onClick={handleVoiceInput}
                  title="Voice input"
                >
                  {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
                <button
                  className="send-button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isProcessing}
                  title="Send message"
                >
                  <FiSend />
                </button>
              </div>
            </div>
            <p className="voice-hint">Click microphone to ask with voice, or type your question</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default VoiceChat

