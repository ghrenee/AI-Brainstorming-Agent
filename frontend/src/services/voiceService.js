/**
 * ElevenLabs Voice Service
 * Handles voice synthesis and speech recognition
 */

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || ''
const ELEVENLABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM' // Rachel - friendly, warm voice
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1'

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined'

class VoiceService {
  constructor() {
    this.isEnabled = !!ELEVENLABS_API_KEY
    this.currentAudio = null
    this.recognition = null
    this.isRecording = false
    this.setupSpeechRecognition()
  }

  /**
   * Setup browser speech recognition
   */
  setupSpeechRecognition() {
    if (isBrowser && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = false
      this.recognition.lang = 'en-US'
    }
  }

  /**
   * Generate speech from text using ElevenLabs
   */
  async speak(text, options = {}) {
    if (!this.isEnabled) {
      console.warn('ElevenLabs API key not configured. Using browser TTS as fallback.')
      return this.fallbackSpeak(text, options)
    }

    try {
      // Stop any current playback
      this.stop()

      const voiceId = options.voiceId || ELEVENLABS_VOICE_ID
      const stability = options.stability || 0.5
      const similarityBoost = options.similarityBoost || 0.75

      const response = await fetch(
        `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: stability,
              similarity_boost: similarityBoost
            }
          })
        }
      )

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
          resolve()
        }
        audio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl)
          reject(error)
        }
        audio.play()
        this.currentAudio = audio
      })
    } catch (error) {
      console.error('Error with ElevenLabs TTS:', error)
      // Fallback to browser TTS
      return this.fallbackSpeak(text, options)
    }
  }

  /**
   * Fallback to browser Text-to-Speech
   */
  fallbackSpeak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!isBrowser) {
        reject(new Error('Not in browser environment'))
        return
      }
      
      if ('speechSynthesis' in window) {
        this.stop() // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = options.rate || 1.0
        utterance.pitch = options.pitch || 1.0
        utterance.volume = options.volume || 1.0
        utterance.lang = options.lang || 'en-US'

        utterance.onend = () => resolve()
        utterance.onerror = (error) => reject(error)

        window.speechSynthesis.speak(utterance)
      } else {
        reject(new Error('Speech synthesis not supported'))
      }
    })
  }

  /**
   * Stop current audio playback
   */
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.currentAudio = null
    }
    if (isBrowser && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  /**
   * Start speech recognition
   */
  async startListening(onResult, onError) {
    if (!this.recognition) {
      onError(new Error('Speech recognition not supported in this browser'))
      return
    }

    if (this.isRecording) {
      this.stopListening()
    }

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
    }

    this.recognition.onerror = (event) => {
      onError(new Error(event.error))
    }

    this.recognition.onend = () => {
      this.isRecording = false
    }

    try {
      this.isRecording = true
      this.recognition.start()
    } catch (error) {
      onError(error)
    }
  }

  /**
   * Stop speech recognition
   */
  stopListening() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop()
      this.isRecording = false
    }
  }

  /**
   * Check if speech recognition is available
   */
  isSpeechRecognitionAvailable() {
    return !!this.recognition
  }

  /**
   * Check if voice service is enabled
   */
  isVoiceEnabled() {
    return this.isEnabled
  }

  /**
   * Welcome message
   */
  async welcomeUser(userName = '') {
    const message = userName
      ? `Welcome ${userName}! I'm your AI brainstorming facilitator. Let's explore ideas together.`
      : `Welcome! I'm your AI brainstorming facilitator. Let's explore ideas together.`
    return this.speak(message)
  }

  /**
   * Speak idea
   */
  async speakIdea(ideaText) {
    const message = `Here's an idea: ${ideaText}`
    return this.speak(message)
  }

  /**
   * Speak question
   */
  async speakQuestion(question) {
    return this.speak(question)
  }
}

// Export singleton instance
export default new VoiceService()

