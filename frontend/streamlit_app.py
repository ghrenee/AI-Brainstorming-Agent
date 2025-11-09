"""
Follow the Spark - Streamlit Frontend
Author: Team Follow the Spark
Purpose:
Voice-based brainstorming facilitator connected to FastAPI backend.
"""

import streamlit as st
import requests
import time
import io
import base64
import sounddevice as sd
import soundfile as sf
from datetime import timedelta

# -----------------------------------------------------------------------------
# CONFIG
# -----------------------------------------------------------------------------
BACKEND_URL = "https://follow-the-spark-agent-<region>-a.run.app"  # Replace with actual Cloud Run URL
st.set_page_config(page_title="Follow the Spark", page_icon="💡", layout="centered")

# -----------------------------------------------------------------------------
# HEADER
# -----------------------------------------------------------------------------
st.title("💡 Follow the Spark")
st.markdown("_AI-powered voice brainstorming facilitator_")

st.divider()

# -----------------------------------------------------------------------------
# VOICE RECORDING
# -----------------------------------------------------------------------------
st.subheader("🎙️ Record Your Idea Prompt")
duration = st.slider("Recording duration (seconds)", 3, 20, 6)
record_btn = st.button("🎤 Start Recording")

if record_btn:
    st.info("Recording... speak now!")
    fs = 44100
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1)
    sd.wait()
    st.success("Recording finished!")

    wav_path = "prompt.wav"
    sf.write(wav_path, recording, fs)

    with open(wav_path, "rb") as audio_file:
        audio_bytes = audio_file.read()
        st.audio(audio_bytes, format="audio/wav")

    st.session_state["audio_prompt"] = audio_bytes

# -----------------------------------------------------------------------------
# CONVERT TO TEXT (Speech-to-Text)
# -----------------------------------------------------------------------------
if "audio_prompt" in st.session_state:
    if st.button("🪄 Transcribe & Start Brainstorm"):
        st.info("Transcribing your input and launching Gemini agent...")

        # Send to backend /transcribe (if implemented)
        try:
            res = requests.post(f"{BACKEND_URL}/transcribe", files={"file": io.BytesIO(st.session_state['audio_prompt'])})
            res.raise_for_status()
            text_prompt = res.json().get("text", "No transcription")
        except Exception:
            text_prompt = "How might we reduce urban waste?"  # fallback text
            st.warning("Transcription service unavailable, using fallback prompt.")

        st.session_state["text_prompt"] = text_prompt
        st.success(f"Prompt: *{text_prompt}*")

# -----------------------------------------------------------------------------
# BRAINSTORM SESSION
# -----------------------------------------------------------------------------
if "text_prompt" in st.session_state:
    st.subheader("💭 Brainstorming Session")

    max_ideas = st.slider("Max ideas", 3, 10, 5)
    temperature = st.slider("Creativity level", 0.2, 1.2, 0.8, 0.1)
    mode = st.radio("Mode", ["Lightning (90s)", "Deep Dive (5m)"])

    if st.button("🚀 Start Brainstorming"):
        st.info("Facilitator thinking...")
        payload = {
            "prompt": st.session_state["text_prompt"],
            "max_ideas": max_ideas,
            "temperature": temperature,
        }

        try:
            res = requests.post(f"{BACKEND_URL}/brainstorm", json=payload)
            res.raise_for_status()
            ideas = res.json().get("ideas", [])
        except Exception:
            ideas = []
            st.error("Backend unavailable — check deployment or endpoint URL.")

        # Simulated timer
        with st.empty():
            total_time = 90 if mode.startswith("Lightning") else 300
            for remaining in range(total_time, 0, -1):
                mins, secs = divmod(remaining, 60)
                st.metric("⏱️ Time Remaining", f"{mins:02}:{secs:02}")
                time.sleep(1)
            st.success("Time’s up! Let’s review your ideas.")

        # Display results
        if ideas:
            st.subheader("🧩 Top Ideas")
            for idx, idea in enumerate(ideas, 1):
                st.markdown(f"**{idx}. {idea['text']}**  \n🆕 Novelty: {idea['novelty']} | 💬 Sentiment: {idea['sentiment']}")
        else:
            st.warning("No ideas received from backend.")

# -----------------------------------------------------------------------------
# FOOTER
# -----------------------------------------------------------------------------
st.divider()
st.caption("Built with ❤️ by Team Follow the Spark • Powered by Vertex AI Gemini")
