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
    sample_phrases = [
        "Leverage community micro-grants",
        "Gamify the solution with digital rewards",
        "Partner with local schools for innovation drives",
        "Use biodegradable composites in packaging",
        "Adopt open-source sustainability tracking"
    ]
    ideas = random.sample(sample_phrases, k=min(max_ideas, len(sample_phrases)))
    return [
        Idea(
            text=i,
            novelty=round(random.uniform(0.5, 1.0), 2),
            sentiment=round(random.uniform(-0.2, 0.9), 2),
        )
        for i in ideas
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
