import { motion, AnimatePresence } from 'framer-motion'
import { FaPhone } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import './VoiceCallModal.css'

const VoiceCallModal = ({ onStartCall, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="voice-call-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="voice-call-modal-card"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close-button" onClick={onClose}>
            <FiX />
          </button>

          <div className="modal-content">
            <div className="modal-avatar">
              <div className="avatar-circle">
                <FaPhone className="avatar-icon" />
              </div>
            </div>

            <h2 className="modal-title">
              Start a call to chat with the AI Brainstorming Agent!
            </h2>

            <button
              className="start-call-button"
              onClick={onStartCall}
            >
              <FaPhone className="call-icon" />
              <span>Start a call</span>
            </button>
          </div>

          <div className="modal-footer">
            <p className="powered-by">Powered by ElevenLabs Agents</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default VoiceCallModal

