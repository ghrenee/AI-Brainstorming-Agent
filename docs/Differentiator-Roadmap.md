# 🌟 Differentiator Implementation Roadmap  
**Project:** Follow the Spark – AI Brainstorming Agent  
**Platform:** Vertex AI + Cloud Run + Streamlit (Frontend)  
**Last Updated:** November 2025  

---

## 🎯 Overview
This roadmap defines how the **AI Brainstorming Agent** evolves from a functioning API into a **facilitated creative experience** — including timed rounds, vibe-aware technique selection, branchable idea threads, and multimodal interaction (voice + text).  

It merges our hackathon MVP with the differentiators described in the UX Design, Defensibility, and Brainstorming Experience documents.

---

## 🧱 Phase 1 — Core Loop (Complete ✅)
**Goal:** Deploy a stable brainstorming API that can receive prompts, generate placeholder or Gemini-based ideas, and respond quickly.  
**Key Components:**
- `/health` and `/brainstorm` endpoints  
- Vertex AI integration scaffold (`gemini-2.5-flash-preview-09-2025`)  
- Placeholder idea generation for offline testing  

**Deliverable:** Cloud Run deployment stable, `/brainstorm` returning structured JSON ideas.

---

## ⏱️ Phase 2 — Timed Rounds & Facilitation Modes
**Goal:** Transform the brainstorm into a **facilitated experience** with time pressure and guidance.  
**Modes:**
- **Lightning Round (90s)** → burst of divergent ideas  
- **Deep Dive (3m)** → structured exploration of a theme  
- **Reflect & Regroup (45s)** → summarization and sentiment read  

**Implementation:**
- Frontend: timer ring UI, “extend +30s” button  
- Backend: support `phase`, `duration_sec`, and `phase_end_at` fields  
- Voice/TTS: countdown announcements (“You’ve got 30 seconds left — finish strong!”)

**Differentiator:** Facilitator-style pacing instead of free-form prompting.

---

## 🧠 Phase 3 — Personality & Vibe-Aware Technique Selection
**Goal:** The agent adapts its brainstorming logic based on **team energy and personality tone.**  

**Personality inputs:**
- Text sentiment + initial voice tone (excited, calm, contrarian, playful)  
- “Warm-up questions” from onboarding (e.g., “Describe your mood in one word.”)

**Techniques Map (see `/backend/utils/techniques.py`):**
| Personality | Technique | Description |
|--------------|------------|--------------|
| High Energy | Metaphor Remix | Twist analogies into new contexts |
| Analytical | SCAMPER | Modify, combine, substitute systematically |
| Contrarian | Reverse Storming | Solve by inverting assumptions |
| Empathetic | Role Storming | Ideate from another’s perspective |
| Balanced | Morphological Mix | Hybridize fragments into new ideas |

**Implementation:**
- Backend selects technique via sentiment/personality classifier  
- Frontend displays chip: “Using: Metaphor Remix”  
- Allows override (“Try a different method”)  

---

## 🌿 Phase 4 — Branchable Idea Threads
**Goal:** Encourage nonlinear creative exploration — every idea can evolve, pivot, or merge.

**Core interactions:**
- “Expand” → deepen an idea  
- “Refine” → clarify  
- “Pivot” → jump laterally  
- “Combine” → merge two paths  

**Technical Notes:**
- Backend tracks `parent_idea_id` and `action`  
- Each response returns `path` (idea lineage)  
- Frontend renders idea orbits → clickable to branch  

**Differentiator:** “Follow the tangent” – structured divergence visualized.

---

## 🗺️ Phase 5 — Organize & Decide
**Goal:** Synthesize brainstorming sessions into actionable next steps.  

**Backend (`/summarize`):**
- Cluster ideas into **themes**
- Rank by **novelty, feasibility, sentiment**
- Suggest **next actions**

**Frontend views:**
- **Mind Map:** dynamic node clusters  
- **Sticky Wall:** drag and vote  
- **Outline:** structured summary (export to doc or PDF)

**Output:**  
“Session Summary” including top ideas, branches, and sentiment chart.

---

## 🎙️ Phase 6 — Voice-First Facilitation
**Goal:** Deliver a **multimodal, accessible experience.**

**Voice Input:**  
- Streamlit microphone → Gemini speech/text or GCP Speech-to-Text  

**Voice Output:**  
- Natural voice TTS via ElevenLabs or GCP TTS  
- Expressive tone based on session phase (“energetic coach” for lightning, “reflective narrator” for summary)

**Differentiator:** Spoken co-facilitator with adaptive tone.

---

## 🧩 API Overview
| Endpoint | Description | Returns |
|-----------|--------------|----------|
| `POST /brainstorm` | Generate ideas, optionally time-bound & technique-based | `{ideas[], chosen_technique, phase_end_at}` |
| `POST /branch` | Continue from an existing idea | `{ideas[], path[]}` |
| `POST /summarize` | Cluster and rank final output | `{clusters[], top[], next_steps[]}` |

---

## 👥 Team Roles
| Member | Role | Focus |
|---------|------|--------|
| **Renee Cannon** | Strategist & Technical Lead | Architecture, system instruction, creative logic |
| **Mujib-ur-Rahman** | Backend & Data Engineer | API logic, branching engine, GCP deployment |
| **Izwa Areeb** | Frontend Engineer | Streamlit UX, timer animation, branching UI |

---

## 🧱 Tech Stack Summary
- **Backend:** FastAPI on Cloud Run  
- **Frontend:** Streamlit (with timer, mic input, and visual mind map)  
- **LLM Core:** Gemini 2.5 Flash (Vertex AI)  
- **Storage:** PostgreSQL / Firestore (session logs)  
- **Voice:** Speech-to-Text + TTS API  
- **Versioning:** GitHub → Cloud Build CI/CD  

---

## ✅ Next Steps
- [ ] Confirm backend health on Cloud Run  
- [ ] Implement Phase 2 timer logic  
- [ ] Integrate `/technique/suggest` endpoint  
- [ ] Connect voice in/out pipeline  
- [ ] Polish visualization + export  

---

**Tagline:**  
> *“Not just another brainstorming app — an AI collaborator that guides creative momentum.”*
