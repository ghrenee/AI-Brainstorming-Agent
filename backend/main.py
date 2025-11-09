"""
AI Brainstorming Agent – Backend API (placeholder version)

This FastAPI app exposes two endpoints:
  • GET /health → simple readiness probe.
  • POST /brainstorm → accepts a prompt and optional parameters, returns placeholder ideas.

To enable real Vertex AI integration later, replace the
`generate_ideas_placeholder()` function with a call using
`google-cloud-aiplatform` or a LangChain chain.

Run locally:
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import random

# -----------------------------------------------------------------------------
# configuration
# -----------------------------------------------------------------------------
APP_ENV = os.getenv("APP_ENV", "dev")
PROJECT_ID = os.getenv("GCP_PROJECT_ID", "demo-project")
REGION = os.getenv("GCP_REGION", "us-central1")
VERTEX_MODEL = os.getenv("VERTEX_MODEL", "gemini-1.0-pro")
USE_VERTEX = os.getenv("USE_VERTEX", "false").lower() == "true"

# -----------------------------------------------------------------------------
# app + models
# -----------------------------------------------------------------------------
app = FastAPI(title="AI Brainstorming Agent")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BrainstormRequest(BaseModel):
    prompt: str = Field(..., example="Ideas for reducing plastic waste")
    max_ideas: int = Field(5, ge=1, le=10)
    temperature: float = Field(0.8, ge=0.0, le=1.0)

class Idea(BaseModel):
    text: str
    novelty: float
    sentiment: float

class BrainstormResponse(BaseModel):
    ideas: List[Idea]

# -----------------------------------------------------------------------------
# core logic (placeholder version)
# -----------------------------------------------------------------------------
def generate_ideas_placeholder(prompt: str, max_ideas: int, temperature: float) -> List[Idea]:
    """
    Generates mock ideas locally for quick iteration.
    Replace this with real Vertex AI logic later.
    """
    random.seed(len(prompt))
    
    # More diverse and topic-aware idea templates
    base_templates = [
        f"Leverage {prompt} through community micro-grants and local partnerships",
        f"Gamify {prompt} with digital rewards and engagement systems",
        f"Partner with educational institutions for {prompt} innovation",
        f"Use sustainable and biodegradable solutions for {prompt}",
        f"Adopt open-source tracking and transparency for {prompt}",
        f"Create {prompt} marketplace with blockchain technology",
        f"Design {prompt} mobile app with AR/VR integration",
        f"Build {prompt} platform using AI-powered matching algorithms",
        f"Implement {prompt} through crowdsourcing and collective intelligence",
        f"Develop {prompt} solution with IoT sensor networks",
    ]
    
    # Select unique ideas
    selected = random.sample(base_templates, k=min(max_ideas, len(base_templates)))
    
    return [
        Idea(
            text=idea,
            novelty=round(random.uniform(0.5, 1.0), 2),
            sentiment=round(random.uniform(0.3, 0.9), 2),
        )
        for idea in selected
    ]

# -----------------------------------------------------------------------------
# endpoints
# -----------------------------------------------------------------------------
@app.get("/health")
async def health_check():
    """Simple readiness check."""
    return {"status": "ok", "env": APP_ENV}

@app.post("/brainstorm", response_model=BrainstormResponse)
async def brainstorm(request: BrainstormRequest):
    """Return a list of brainstormed ideas for the given prompt."""
    try:
        if USE_VERTEX:
            # placeholder for future Vertex AI integration
            raise NotImplementedError("Vertex AI call not yet implemented")
        ideas = generate_ideas_placeholder(request.prompt, request.max_ideas, request.temperature)
        return {"ideas": ideas}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
