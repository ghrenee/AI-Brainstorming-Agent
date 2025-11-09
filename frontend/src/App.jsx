import { useState } from 'react'
import Welcome from './components/Welcome'
import WarmUpPrompts from './components/WarmUpPrompts'
import IdeaBurst from './components/IdeaBurst'
import OrganizeExport from './components/OrganizeExport'
import WrapUp from './components/WrapUp'
import './App.css'

function App() {
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

  const updateSession = (updates) => {
    setSession(prev => ({ ...prev, ...updates }))
  }

  const goToStep = (step) => {
    updateSession({ step })
  }

  return (
    <div className="app">
      {session.step === 'welcome' && (
        <Welcome 
          session={session} 
          updateSession={updateSession} 
          goToStep={goToStep} 
        />
      )}
      {session.step === 'warmup' && (
        <WarmUpPrompts 
          session={session} 
          updateSession={updateSession} 
          goToStep={goToStep} 
        />
      )}
      {session.step === 'ideaburst' && (
        <IdeaBurst 
          session={session} 
          updateSession={updateSession} 
          goToStep={goToStep} 
        />
      )}
      {session.step === 'organize' && (
        <OrganizeExport 
          session={session} 
          updateSession={updateSession} 
          goToStep={goToStep} 
        />
      )}
      {session.step === 'wrapup' && (
        <WrapUp 
          session={session} 
          updateSession={updateSession} 
          goToStep={goToStep} 
        />
      )}
    </div>
  )
}

export default App

