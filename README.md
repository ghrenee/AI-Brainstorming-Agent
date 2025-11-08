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

> Think of it as a creativity accelerator — an *AI facilitator* that helps humans reach “what if?” faster.

---

## 🏗️ Architecture
AI-Brainstorming-Agent/
├── backend/ → FastAPI service (idea generation + scoring API)
├── frontend/ → Streamlit web interface
├── data/ → example sessions & datasets
├── docs/ → design assets, decks, and architecture diagram

- **Backend:** FastAPI app ready for Vertex AI or LangChain integration.  
- **Frontend:** Streamlit interface for live brainstorming sessions.  
- **Deployment:** Google Cloud Run for scalable demos.

---

## 🧠 Endpoints
| Method | Route | Description |
|:------:|:------|:-------------|
| `GET` | `/health` | Health check |
| `POST` | `/brainstorm` | Generate a list of unconventional ideas for a given topic |

---

## ⚙️ Local Setup
```bash
# backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# frontend
cd ../frontend
pip install -r requirements.txt
streamlit run streamlit_app.py
Access locally:
API: http://127.0.0.1:8000/docs
UI: http://localhost:8501

## ☁️ Deployment (Target)

**Platform:** Google Cloud Run  

**Service Account Roles:**
- `roles/aiplatform.user`
- `roles/run.admin`
- `roles/secretmanager.secretAccessor`

---

## 👥 Team

| Name | Role | Focus |
|------|------|--------|
| **Renee Cannon** | Strategist & Technical Lead | Architecture, integration, project direction |
| **Mujib-ur-Rahman** | Backend & Data Engineer | API logic, model orchestration, GCP setup |
| **Izwa Areeb** | Frontend Engineer | Streamlit interface, UI/UX flow |

---

## 🎯 Vision

We’re not building *another* brainstorming app —  
we’re building an **AI collaborator** that turns creative friction into forward momentum.  
Our goal: help teams uncover **unexpected solutions** in record time.

---

## 🏁 Hackathon Goal

Deliver a working MVP that demonstrates:
- Interactive brainstorming flow  
- Novelty scoring and branching suggestions  
- Seamless local or GCP deployment  

---

## 📜 License

This project is licensed under the **Apache License 2.0** — see the [`LICENSE`](./LICENSE) file for details.  
You are free to use, modify, and distribute this project as long as proper attribution is maintained.