# 💡 AI Brainstorming Agent
> “Don’t follow trends. Follow the spark.”

---

## 🧭 Overview
**AI Brainstorming Agent** is a creativity copilot built for hackathon innovators.  
Instead of chasing trends or remixing existing ideas, it helps teams **think sideways** — surfacing outlier insights and unconventional paths that lead to breakthrough concepts.

The Agent guides users through ideation and challenge selection, using structured prompts and dynamic feedback loops to push ideas beyond the obvious.  
It’s built to **amplify human creativity**, not replace it.

---

## 🧩 How It’s Different
Unlike typical “AI brainstorm generators” that pull from common web content, our Agent deliberately explores the **edges of the idea space**.

- 🌀 **Edge-Driven Exploration:** Ranks ideas by novelty and creative distance.  
- 🎯 **Context Awareness:** Adapts to team goals, hackathon tracks, and user constraints.  
- 💬 **Conversational Flow:** Feels like a creative partner, not a prompt-response tool.  
- ⚙️ **Modular Design:** Deployable anywhere — API, UI, or integrated workflow.
- 🎤 **Voice Integration:** ElevenLabs voice synthesis and browser speech recognition for natural interactions.

> Think of it as a creativity accelerator — an *AI facilitator* that helps humans reach “what if?” faster.

---

## 🏗️ Architecture
AI-Brainstorming-Agent/
├── backend/ → FastAPI service (idea generation + scoring API)
├── frontend/ → React + Vite web application (modern UI)
├── data/ → example sessions & datasets
├── docs/ → design assets, decks, and architecture diagram

- **Backend:** FastAPI app ready for Vertex AI or LangChain integration.  
- **Frontend:** Modern React application with immersive UI, animations, and interactive brainstorming.  
- **Voice:** ElevenLabs integration for natural voice output and browser speech recognition for voice input.
- **Deployment:** Google Cloud Run for scalable demos.

---

## 🧠 Endpoints
| Method | Route | Description |
|:------:|:------|:-------------|
| `GET` | `/health` | Health check |
| `POST` | `/brainstorm` | Generate a list of unconventional ideas for a given topic |
| `POST` | `/ask-about-idea` | Answer questions about a specific idea (voice conversation) |
| `POST` | `/conversation` | Handle conversational messages and extract topic/name information |

---

## ⚙️ Local Setup

### Environment Variables

Create a `.env` file in the `frontend` directory:

```
VITE_BACKEND_URL=http://localhost:8000
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
VITE_ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

**Note:** ElevenLabs API key is optional. If not provided, the app will use browser Text-to-Speech as fallback. For voice input, the app uses browser Speech Recognition API (works in Chrome, Edge, Safari).

See [frontend/README_VOICE.md](./frontend/README_VOICE.md) for detailed voice setup instructions.


### 🚀 Quick Start (Recommended)

**Windows:**
```bash
start_system.bat
```

**Linux/Mac:**
```bash
chmod +x start_system.sh
./start_system.sh
```

**Cross-platform (Python required):**
```bash
python start_system.py
```

**Or using npm:**
```bash
npm start
```

This will automatically:
- Check prerequisites (Python, Node.js)
- Install dependencies if needed
- Start both backend and frontend servers
- Open the application in your browser

### 📖 Manual Setup

If you prefer to start servers manually:

#### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API will be available at: `http://127.0.0.1:8000/docs`

#### Frontend Setup

The frontend is now a modern React application built with Vite.

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:5173`

**Note:** Make sure the backend is running before starting the frontend, as the frontend needs to connect to the API.

### Legacy Streamlit Frontend

The original Streamlit frontend is still available in `frontend/streamlit_app.py` but is not actively maintained. The new React frontend is the recommended interface.

### 📚 More Information

- See [QUICK_START.md](./QUICK_START.md) for detailed quick start instructions
- See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for comprehensive setup guide

## ☁️ Deployment (Target)

**Platform:** Google Cloud Run  

**Service Account Roles:**
- `roles/aiplatform.user`
- `roles/run.admin`
- `roles/secretmanager.secretAccessor`

---

## 👥 Team
| Name                | Role                        | Focus                                        |
| ------------------- | --------------------------- | -------------------------------------------- |
| **Renee Cannon**    | Strategist & Technical Lead | Architecture, integration, project direction |
| **Mujib-ur-Rahman** | Backend & Data Engineer     | API logic, model orchestration, GCP setup    |
| **Izwa Areeb**      | Frontend Engineer           | Streamlit interface, UI/UX flow              |
| **Neelansh Khare**  | Frontend Engineer           | UI/UX                                        |

---

## 🎯 Vision

We’re not building *another* brainstorming app —  
we’re building an **AI collaborator** that turns creative friction into forward momentum.  
Our goal: help teams uncover **unexpected solutions** in record time.

---

## 🏁 Hackathon Goal

Deliver a working MVP that demonstrates:

- **Interactive brainstorming flow**  
- **Novelty scoring and branching suggestions**  
- **Seamless local or GCP deployment**

---

## 📜 License

This project is licensed under the **Apache License 2.0** — see the [`LICENSE`](./LICENSE) file for details.  
You are free to use, modify, and distribute this project as long as proper attribution is maintained.

---
