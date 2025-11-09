import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import Welcome from './components/Welcome'
import WarmUpPrompts from './components/WarmUpPrompts'
import IdeaBurst from './components/IdeaBurst'
import OrganizeExport from './components/OrganizeExport'
import WrapUp from './components/WrapUp'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState({
    step: 'welcome', // welcome, warmup, ideaburst, organize, wrapup
    userName: '',
    userUnique: '',
    topic: '',
    warmupAnswers: [],
    ideas: [],
    selectedIdea: null,
    viewMode: 'mindmap', // mindmap, sticky, outline
    conversationHistory: [] // Voice conversation history
  })

  useEffect(() => {
    // Simulate initial app load
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const updateSession = (updates) => {
    setSession(prev => ({ ...prev, ...updates }))
  }

  const goToStep = (step) => {
    updateSession({ step })
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" message="Initializing AI Brainstorming Agent" />
        ) : (
          <>
            {session.step === 'welcome' && (
              <Welcome
                key="welcome"
                session={session}
                updateSession={updateSession}
                goToStep={goToStep}
              />
            )}
            {session.step === 'warmup' && (
              <WarmUpPrompts
                key="warmup"
                session={session}
                updateSession={updateSession}
                goToStep={goToStep}
              />
            )}
            {session.step === 'ideaburst' && (
              <IdeaBurst
                key="ideaburst"
                session={session}
                updateSession={updateSession}
                goToStep={goToStep}
              />
            )}
            {session.step === 'organize' && (
              <OrganizeExport
                key="organize"
                session={session}
                updateSession={updateSession}
                goToStep={goToStep}
              />
            )}
            {session.step === 'wrapup' && (
              <WrapUp
                key="wrapup"
                session={session}
                updateSession={updateSession}
                goToStep={goToStep}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App

