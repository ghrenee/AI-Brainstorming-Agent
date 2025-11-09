# AI Brainstorming Agent - Frontend

Modern, immersive web application for AI-powered brainstorming sessions.

## Features

- 🎨 **Modern UI**: Calm, playful, and futuristic design with glowing orb animations
- 🧠 **Interactive Brainstorming**: Orbiting idea tiles around a central AI facilitator
- 🎯 **Multi-step Flow**: Welcome → Warm-up → Idea Burst → Organize → Wrap-up
- 📊 **Multiple Views**: Mind Map, Sticky Notes, and Outline views
- 💾 **Export Options**: JSON and PDF export (PDF placeholder)
- 🎭 **Animations**: Smooth transitions and engaging visual effects

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **Axios** - HTTP client

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (see `.env.example`):
```
VITE_BACKEND_URL=http://localhost:8000
```

3. Start development server:
```bash
npm run dev
```

4. Open browser at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Welcome.jsx          # Onboarding screen
│   │   ├── WarmUpPrompts.jsx    # Warm-up questions
│   │   ├── IdeaBurst.jsx        # Main brainstorming mode
│   │   ├── ExplorePanel.jsx     # Side panel for idea expansion
│   │   ├── OrganizeExport.jsx   # Organization and export views
│   │   ├── WrapUp.jsx           # Session summary and wrap-up
│   │   └── GlowingOrb.jsx       # Animated orb component
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Backend Integration

The frontend expects a backend API running on `http://localhost:8000` with the following endpoints:

- `GET /health` - Health check
- `POST /brainstorm` - Generate ideas
  - Request: `{ prompt: string, max_ideas: number, temperature: number }`
  - Response: `{ ideas: [{ text: string, novelty: number, sentiment: number }] }`

## Environment Variables

- `VITE_BACKEND_URL` - Backend API URL (default: `http://localhost:8000`)

## Features in Detail

### Welcome & Onboarding
- Centered glowing orb animation
- User name and unique thinking style input
- Session topic input

### Warm-up Prompts
- Animated question cards
- Interactive answer input
- Voice input placeholder (for future ElevenLabs integration)

### Idea Burst
- Orbiting idea tiles around central orb
- Click to explore and expand ideas
- Emoji reactions (👍 💡 😂)
- Toolbar controls (Pause, Add Idea, Organize)

### Explore/Expand
- Side panel with idea details
- Branching questions
- Add sub-ideas
- Novelty and sentiment scores

### Organize & Export
- Three view modes: Mind Map, Sticky Notes, Outline
- Export to JSON (implemented)
- Export to PDF (placeholder)

### Wrap-up
- Session summary
- Top ideas by novelty
- Reflection input
- Save and finish options

## Future Enhancements

- [ ] Voice input integration (ElevenLabs)
- [ ] Real-time collaboration
- [ ] PDF export implementation
- [ ] Advanced filtering and sorting
- [ ] Idea tagging and categorization
- [ ] Session history and saved sessions
