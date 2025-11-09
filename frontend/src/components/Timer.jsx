import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './Timer.css'

const Timer = ({ endTime, mode, onComplete, onExtend }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const [progress, setProgress] = useState(100)

  const totalDuration = mode === 'lightning' ? 90 : 180 // seconds

  useEffect(() => {
    if (!endTime) return

    const updateTimer = () => {
      const end = new Date(endTime).getTime()
      const now = new Date().getTime()
      const remaining = Math.max(0, Math.floor((end - now) / 1000))

      setTimeLeft(remaining)
      setProgress((remaining / totalDuration) * 100)

      if (remaining === 0 && onComplete) {
        onComplete()
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [endTime, totalDuration, onComplete])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    if (progress > 60) return 'var(--cyan)'
    if (progress > 30) return 'var(--yellow)'
    return 'var(--magenta)'
  }

  const isLowTime = timeLeft <= 30 && timeLeft > 0

  return (
    <div className="timer-container">
      <motion.div
        className={`timer-ring ${isLowTime ? 'timer-ring-pulse' : ''}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <svg className="timer-svg" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
          />

          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getTimerColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            transform="rotate(-90 50 50)"
            style={{
              filter: 'drop-shadow(0 0 8px currentColor)',
            }}
          />
        </svg>

        <div className="timer-content">
          <motion.div
            className="timer-display"
            animate={isLowTime ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: isLowTime ? Infinity : 0 }}
          >
            {formatTime(timeLeft)}
          </motion.div>
        </div>
      </motion.div>

      {timeLeft > 0 && onExtend && (
        <motion.button
          className="timer-extend-btn"
          onClick={onExtend}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          +30s Extend
        </motion.button>
      )}
    </div>
  )
}

export default Timer
