import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaTimes, FaRobot } from 'react-icons/fa'
import { FiSend, FiSkipForward, FiX } from 'react-icons/fi'
import voiceService from '../services/voiceService'
import axios from 'axios'
import './VoiceConversation.css'

const VoiceConversation = ({ onComplete, onSkip }) => {
  const [messages, setMessages] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [inputText, setInputText] = useState('')
  const [conversationStarted, setConversationStarted] = useState(false)
  const [extractedTopic, setExtractedTopic] = useState('')
  const [extractedName, setExtractedName] = useState('')
  const messagesEndRef = useRef(null)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    // Initial greeting with voice
    const startConversation = async () => {
      const greeting = "Hello! I'm your AI brainstorming facilitator. Tell me about an idea you'd like to explore, or describe a problem you're trying to solve. Speak naturally, and I'll help you brainstorm!"
      
      setMessages([{
        id: 1,
        type: 'assistant',
        text: greeting,
        timestamp: new Date()
      }])
      
      // Speak the greeting
      try {
        await voiceService.speak(greeting)
        setConversationStarted(true)
      } catch (error) {
        console.error('Error playing greeting:', error)
        setConversationStarted(true)
      }
    }
    
    setTimeout(startConversation, 500)
  }, [])

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
        // Don't show alert, just allow user to try again or type
      }
    )
  }

  const extractInformation = (text) => {
    // Try to extract name
    const namePatterns = [
      /(?:my name is|i'm|i am|call me|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
      /^([A-Z][a-z]+)\s+(?:here|speaking)/i
    ]
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern)
      if (match && match[1]) {
        setExtractedName(match[1].trim())
        break
      }
    }

    // Try to extract topic/idea (usually longer phrases)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
    if (sentences.length > 0) {
      // Find the sentence that seems most like an idea/topic
      const ideaSentences = sentences.filter(s => 
        s.length > 20 && 
        (s.toLowerCase().includes('idea') || 
         s.toLowerCase().includes('problem') || 
         s.toLowerCase().includes('want to') ||
         s.toLowerCase().includes('trying to') ||
         s.toLowerCase().includes('thinking about'))
      )
      
      if (ideaSentences.length > 0) {
        setExtractedTopic(ideaSentences[0].trim())
      } else if (sentences.length > 0) {
        // Use the longest sentence as potential topic
        const longest = sentences.reduce((a, b) => a.length > b.length ? a : b)
        if (longest.length > 15) {
          setExtractedTopic(longest.trim())
        }
      }
    }
  }

  const handleSendMessage = async (text = null) => {
    const userMessage = text || inputText.trim()
    if (!userMessage) return

    // Add user message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setIsProcessing(true)

    // Extract information from user message
    extractInformation(userMessage)

    try {
      // Call backend to get response (we'll use the ask-about-idea endpoint or create a new one)
      // For now, let's create a conversational response
      const response = await generateConversationalResponse(userMessage, messages)
      
      // Add assistant message
      const assistantMsg = {
        id: Date.now() + 1,
        type: 'assistant',
        text: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMsg])

      // Speak the response
      await voiceService.speak(response)
      
      // Check if we have enough information to proceed
      // Try to get response from backend which includes should_proceed flag
      try {
        const backendResponse = await axios.post(`${BACKEND_URL}/conversation`, {
          message: userMessage,
          conversation_history: messages.map(msg => ({
            type: msg.type,
            text: msg.text
          }))
        })
        
        if (backendResponse.data.should_proceed && backendResponse.data.extracted_topic) {
          setExtractedTopic(backendResponse.data.extracted_topic)
          // Offer to proceed to brainstorming
          const proceedMessage = {
            id: Date.now() + 2,
            type: 'assistant',
            text: `Great! Based on our conversation, I understand you want to brainstorm about "${backendResponse.data.extracted_topic}". Would you like to proceed to generate some creative ideas?`,
            timestamp: new Date(),
            isActionMessage: true
          }
          setMessages(prev => [...prev, proceedMessage])
          await voiceService.speak(proceedMessage.text)
        }
      } catch (error) {
        // Fallback: check locally
        if (extractedTopic && extractedTopic.length > 10 && messages.length >= 4) {
          const proceedMessage = {
            id: Date.now() + 2,
            type: 'assistant',
            text: `Great! Based on our conversation, I understand you want to brainstorm about "${extractedTopic}". Would you like to proceed to generate some creative ideas?`,
            timestamp: new Date(),
            isActionMessage: true
          }
          setMessages(prev => [...prev, proceedMessage])
          await voiceService.speak(proceedMessage.text)
        }
      }
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMsg = {
        id: Date.now() + 1,
        type: 'assistant',
        text: "I'm sorry, I didn't catch that. Could you tell me more about your idea?",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMsg])
      await voiceService.speak(errorMsg.text)
    } finally {
      setIsProcessing(false)
    }
  }

  const generateConversationalResponse = async (userMessage, conversationHistory) => {
    // Try to use backend if available
    try {
      const response = await axios.post(`${BACKEND_URL}/conversation`, {
        message: userMessage,
        conversation_history: conversationHistory.map(msg => ({
          type: msg.type,
          text: msg.text
        })),
        context: 'voice_conversation'
      })
      
      const data = response.data
      
      // Update extracted information
      if (data.extracted_topic && !extractedTopic) {
        setExtractedTopic(data.extracted_topic)
      }
      if (data.extracted_name && !extractedName) {
        setExtractedName(data.extracted_name)
      }
      
      return data.response
    } catch (error) {
      console.error('Error getting conversational response:', error)
      // Fallback to local response generation
      return generateLocalResponse(userMessage, conversationHistory)
    }
  }

  const generateLocalResponse = (userMessage, conversationHistory) => {
    const messageLower = userMessage.toLowerCase()
    
    if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
      return "Hello! I'm excited to help you brainstorm. What idea or problem would you like to explore today?"
    }
    
    if (messageLower.includes('idea') || messageLower.includes('thinking about') || messageLower.includes('want to')) {
      return "That sounds interesting! Tell me more about it. What problem does it solve, or what makes it unique?"
    }
    
    if (messageLower.includes('problem') || messageLower.includes('challenge') || messageLower.includes('issue')) {
      return "I see. Let's think about this problem from different angles. What have you tried so far? What obstacles are you facing?"
    }
    
    if (messageLower.includes('yes') || messageLower.includes('sure') || messageLower.includes('okay') || messageLower.includes('ok')) {
      if (extractedTopic) {
        return `Perfect! Let's start brainstorming about "${extractedTopic}". I'll help you generate some creative ideas.`
      }
      return "Great! Let's continue exploring your idea. What aspect would you like to dive deeper into?"
    }
    
    // Generic helpful response
    return "That's a great point! Tell me more about that. What are you hoping to achieve with this idea?"
  }

  const handleProceed = () => {
    if (extractedTopic && extractedTopic.length > 5) {
      onComplete({
        topic: extractedTopic,
        userName: extractedName || 'User',
        conversationHistory: messages
      })
    } else {
      // If no topic extracted, ask user
      const askTopic = async () => {
        const msg = "I'd like to help you brainstorm! Could you tell me in one sentence what idea or topic you'd like to explore?"
        const askMsg = {
          id: Date.now(),
          type: 'assistant',
          text: msg,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, askMsg])
        await voiceService.speak(msg)
      }
      askTopic()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <motion.div
      className="voice-conversation-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="voice-chat-window">
        {/* Header */}
        <div className="chat-header">
          <button
            className={`talk-to-interrupt-button ${isListening ? 'listening' : ''}`}
            onClick={handleVoiceInput}
            title={isListening ? 'Stop listening' : 'Talk to interrupt'}
          >
            {isListening ? (
              <>
                <FaMicrophoneSlash /> Stop listening
              </>
            ) : (
              <>
                <FaMicrophone /> Talk to interrupt
              </>
            )}
          </button>
          <button
            className="close-chat-button"
            onClick={onSkip}
            title="Close chat"
          >
            <FiX />
          </button>
        </div>

        {/* Messages Section */}
        <div className="voice-conversation-messages">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`conversation-message ${message.type}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message.type === 'assistant' && (
                <div className="message-avatar">
                  <div className="avatar-icon-wrapper">
                    <FaRobot />
                  </div>
                </div>
              )}
              <div className="message-content-wrapper">
                <div className="message-bubble">
                  <p>{message.text}</p>
                </div>
                {message.isActionMessage && (
                  <button
                    className="action-button"
                    onClick={handleProceed}
                  >
                    Yes, let's proceed! →
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        
          {isProcessing && (
            <div className="conversation-message assistant processing">
              <div className="message-avatar">
                <div className="avatar-icon-wrapper">
                  <FaRobot />
                </div>
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <div className="input-wrapper">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Send a message"
              className="chat-input"
              disabled={isListening}
            />
            <button
              className="send-message-button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isProcessing || isListening}
              title="Send message"
            >
              <FiSend />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default VoiceConversation

