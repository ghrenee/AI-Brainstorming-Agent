import streamlit as st
import requests
import json

st.set_page_config(page_title="AI Brainstorming Agent", layout="centered")

st.title("💡 AI Brainstorming Agent")
st.caption("Don't follow trends. Follow the spark.")

backend_url = st.secrets.get("backend_url", "http://localhost:8000")

user_input = st.text_area("What are we brainstorming today?")

if st.button("Generate Ideas"):
    with st.spinner("Generating ideas..."):
        payload = {"user_prompt": user_input}
        response = requests.post(f"{backend_url}/generate", json=payload)
        data = response.json()
        st.success("Here’s what the AI suggests:")
        st.write(data.get("response", "No response"))
