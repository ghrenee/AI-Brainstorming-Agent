# 🎤 Voice Integration Guide - ElevenLabs

## Overview

The AI Brainstorming Agent now includes full voice integration using ElevenLabs for natural, human-like voice synthesis and browser Speech Recognition API for voice input.

## Features

### Voice Output (ElevenLabs)
- ✅ Welcome greetings
- ✅ Question narration
- ✅ Idea announcements
- ✅ Transition messages
- ✅ Fallback to browser TTS if API key not configured

### Voice Input (Browser Speech Recognition)
- ✅ Voice input for user name
- ✅ Voice input for thinking style
- ✅ Voice input for brainstorming topic
- ✅ Voice input for warm-up questions
- ✅ Real-time transcription

## Setup

### 1. Get ElevenLabs API Key

1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Go to your profile settings
3. Copy your API key
4. Add it to your `.env` file:

```env
VITE_ELEVENLABS_API_KEY=your_api_key_here
VITE_ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

### 2. Configure Voice ID (Optional)

Default voice: `21m00Tcm4TlvDq8ikWAM` (Rachel - friendly, warm)

To use a different voice:
1. Go to [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)
2. Choose a voice
3. Copy the Voice ID
4. Update `VITE_ELEVENLABS_VOICE_ID` in your `.env` file

### 3. Browser Requirements

**Voice Input (Speech Recognition):**
- Chrome/Edge: ✅ Supported
- Safari: ✅ Supported (WebKit)
- Firefox: ❌ Not supported
- Opera: ✅ Supported

**Voice Output (Fallback TTS):**
- All modern browsers support Web Speech API

## Usage

### Welcome Screen
- Automatic voice greeting when page loads
- Voice input buttons next to each field
- Click microphone icon to speak your input

### Warm-up Prompts
- Click on any question card to hear it read aloud
- Use voice button to answer questions
- Confirmation voice after each answer

### Idea Burst
- Ideas are announced when generated
- Click speaker icon on any idea tile to hear it
- Click on idea to explore (also reads the idea)

## Voice Service API

### `voiceService.speak(text, options)`
Generate speech from text.

```javascript
await voiceService.speak("Hello, welcome to the brainstorming session!")
```

Options:
- `voiceId`: Custom voice ID
- `stability`: 0.0 - 1.0 (default: 0.5)
- `similarityBoost`: 0.0 - 1.0 (default: 0.75)

### `voiceService.welcomeUser(userName)`
Welcome message for users.

```javascript
await voiceService.welcomeUser("John")
```

### `voiceService.speakIdea(ideaText)`
Announce an idea.

```javascript
await voiceService.speakIdea("Create a blockchain marketplace")
```

### `voiceService.speakQuestion(question)`
Read a question aloud.

```javascript
await voiceService.speakQuestion("What's the worst idea you could come up with?")
```

### `voiceService.startListening(onResult, onError)`
Start speech recognition.

```javascript
voiceService.startListening(
  (transcript) => {
    console.log("User said:", transcript)
  },
  (error) => {
    console.error("Error:", error)
  }
)
```

### `voiceService.stop()`
Stop current audio playback.

```javascript
voiceService.stop()
```

## VoiceButton Component

Reusable component for voice input.

```jsx
import VoiceButton from './components/VoiceButton'

<VoiceButton
  onTranscript={(transcript) => {
    setInputValue(transcript)
  }}
  disabled={false}
  className="custom-class"
/>
```

## Troubleshooting

### Voice not playing
1. Check if API key is set in `.env`
2. Check browser console for errors
3. Verify internet connection (ElevenLabs requires API call)
4. Check browser permissions for audio

### Voice input not working
1. Check browser support (Chrome/Edge/Safari recommended)
2. Allow microphone permissions when prompted
3. Check browser console for errors
4. Ensure HTTPS or localhost (required for microphone access)

### API Key Issues
- If API key is not set, the app will fallback to browser TTS
- Browser TTS is free but less natural
- ElevenLabs provides free tier with character limits

## Free Tier Limits (ElevenLabs)

- 10,000 characters per month (free)
- Upgrade for more characters
- No credit card required for free tier

## Browser TTS Fallback

If ElevenLabs API key is not configured, the app automatically uses browser Text-to-Speech:
- Works offline
- Free
- Less natural sounding
- Supports multiple languages

## Customization

### Change Voice Settings

Edit `frontend/src/services/voiceService.js`:

```javascript
const ELEVENLABS_VOICE_ID = 'your_voice_id'
const stability = 0.6
const similarityBoost = 0.8
```

### Add Custom Voice Messages

```javascript
// In your component
await voiceService.speak("Your custom message here")
```

## Security

- API key is stored in `.env` file (not committed to git)
- Voice data is sent to ElevenLabs API
- Speech recognition happens locally in browser
- No voice data is stored

## Future Enhancements

- [ ] Voice cloning for personalized experience
- [ ] Multiple language support
- [ ] Voice emotion detection
- [ ] Real-time voice conversations
- [ ] Voice commands for navigation

---

**Need Help?** Check the main [README.md](../README.md) or open an issue on GitHub.

