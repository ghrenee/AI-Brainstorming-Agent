# 🎤 Voice System Setup Guide

## Overview

The AI Brainstorming Agent now includes **ElevenLabs voice integration** for natural voice output and **browser Speech Recognition** for voice input.

## Features

### ✅ Voice Output (ElevenLabs)
- Welcome greetings when user enters
- Question narration in warm-up section
- Idea announcements and playback
- Transition messages between sections
- **Fallback to browser TTS** if API key not configured

### ✅ Voice Input (Browser API)
- Voice input for user name
- Voice input for thinking style
- Voice input for brainstorming topic
- Voice input for warm-up question answers
- Real-time speech-to-text transcription

## Quick Setup

### Step 1: Get ElevenLabs API Key (Optional but Recommended)

1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up for a free account
3. Navigate to your profile settings
4. Copy your API key
5. Add it to `frontend/.env`:

```env
VITE_ELEVENLABS_API_KEY=your_api_key_here
VITE_ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

### Step 2: Create .env File

Create a file named `.env` in the `frontend` directory:

```env
VITE_BACKEND_URL=http://localhost:8000
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
VITE_ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

### Step 3: Restart Frontend Server

After adding the API key, restart your frontend server:

```bash
cd frontend
npm run dev
```

## How It Works

### Voice Output Flow

1. **ElevenLabs API** (if API key is set):
   - Text is sent to ElevenLabs API
   - High-quality, natural voice is generated
   - Audio is played in the browser

2. **Browser TTS Fallback** (if no API key):
   - Uses browser's built-in Text-to-Speech
   - Works offline
   - Less natural but functional

### Voice Input Flow

1. User clicks microphone button
2. Browser requests microphone permission
3. Speech Recognition API captures audio
4. Text is transcribed in real-time
5. Transcript is inserted into the input field

## Browser Compatibility

### Voice Input (Speech Recognition)
- ✅ **Chrome/Edge**: Fully supported
- ✅ **Safari**: Supported (WebKit)
- ✅ **Opera**: Supported
- ❌ **Firefox**: Not supported

### Voice Output (TTS)
- ✅ All modern browsers support Web Speech API
- ✅ ElevenLabs works in all browsers with API key

## Usage Examples

### Welcome Screen
- Automatic voice greeting: "Welcome! I'm your AI brainstorming facilitator..."
- Voice input buttons next to each field
- Click microphone to speak your name or topic

### Warm-up Questions
- Click any question card to hear it read aloud
- Use voice button to answer questions
- Confirmation voice after each answer

### Idea Burst
- Ideas are announced when generated
- Click speaker icon (🔊) on any idea to hear it
- Click on idea to explore (also reads the idea)

## Voice Service API

### Basic Usage

```javascript
import voiceService from './services/voiceService'

// Speak text
await voiceService.speak("Hello, welcome!")

// Welcome user
await voiceService.welcomeUser("John")

// Speak idea
await voiceService.speakIdea("Create a blockchain marketplace")

// Speak question
await voiceService.speakQuestion("What's the worst idea?")
```

### Voice Input

```jsx
import VoiceButton from './components/VoiceButton'

<VoiceButton
  onTranscript={(transcript) => {
    setInputValue(transcript)
  }}
/>
```

## Troubleshooting

### Voice Not Playing

1. **Check API Key**: Verify `.env` file has correct API key
2. **Check Console**: Look for errors in browser console
3. **Internet Connection**: ElevenLabs requires API call
4. **Browser Permissions**: Allow audio playback
5. **Fallback Mode**: App will use browser TTS if API fails

### Voice Input Not Working

1. **Browser Support**: Use Chrome, Edge, or Safari
2. **Microphone Permission**: Allow when prompted
3. **HTTPS/Localhost**: Required for microphone access
4. **Check Console**: Look for permission errors
5. **Try Different Browser**: Some browsers have better support

### API Key Issues

- **Free Tier**: 10,000 characters/month (ElevenLabs)
- **No Credit Card**: Required for free tier
- **Fallback**: App works without API key (browser TTS)
- **Upgrade**: Get more characters with paid plan

## Customization

### Change Voice

Edit `frontend/src/services/voiceService.js`:

```javascript
const ELEVENLABS_VOICE_ID = 'your_voice_id'
```

Available voices: https://elevenlabs.io/voice-library

### Adjust Voice Settings

```javascript
await voiceService.speak(text, {
  stability: 0.6,
  similarityBoost: 0.8
})
```

### Custom Messages

```javascript
// In your component
await voiceService.speak("Your custom message here")
```

## Security & Privacy

- ✅ API key stored in `.env` (not committed to git)
- ✅ Voice data sent to ElevenLabs API only
- ✅ Speech recognition happens locally in browser
- ✅ No voice data stored permanently
- ✅ All API calls are secure (HTTPS)

## Free Tier Limits

### ElevenLabs
- **10,000 characters/month** (free)
- Natural, high-quality voices
- Multiple voice options
- Upgrade for more characters

### Browser TTS
- **Unlimited** (free)
- Works offline
- Less natural sounding
- Built into browser

## Testing

### Test Voice Output
1. Open the app
2. You should hear welcome message
3. Click on questions to hear them
4. Click speaker icon on ideas

### Test Voice Input
1. Click microphone button
2. Allow microphone permission
3. Speak your input
4. Verify text appears in field

## Next Steps

1. ✅ Get ElevenLabs API key (optional)
2. ✅ Add to `.env` file
3. ✅ Restart frontend server
4. ✅ Test voice features
5. ✅ Enjoy natural voice interactions!

## Support

- 📖 See [frontend/README_VOICE.md](./frontend/README_VOICE.md) for detailed docs
- 🐛 Report issues on GitHub
- 💬 Ask questions in discussions

---

**Happy Brainstorming with Voice! 🎤✨**

