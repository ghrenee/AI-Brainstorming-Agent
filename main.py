AI-Brainstorming-Agent/
│
├── Dockerfile
├── cloudbuild.yaml
├── main.py                 ← 🧠 Backend API entrypoint (for Cloud Run)
├── requirements.txt
│
├── frontend/
│   ├── main.py             ← Streamlit frontend (local app)
│   └── requirements.txt
│
├── backend/ (optional if you later reorganize)
│   └── ...                 ← can move FastAPI here later if you prefer
│
└── README.md
