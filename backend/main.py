"""
AI Brainstorming Agent – Backend API (Gemini-integrated version)

This FastAPI app exposes two endpoints:
  • GET /health → simple readiness probe.
  • POST /brainstorm → accepts a prompt and optional parameters, returns AI-guided ideas.

You can toggle between local mock mode and Vertex AI mode using:
    export USE_VERTEX=true
Run locally:
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from vertexai import init
from vertexai.preview import generative_models as genai
from vertexai.preview.generative_models import types
from pydantic import BaseModel, Field
from typing import List
from vertexai.preview import generative_models as genai
import os

SYSTEM_INSTRUCTION_PATH = os.path.join(
    os.path.dirname(__file__), "prompts", "gemini_system_instruction.txt"
)

model = genai.GenerativeModel(
    model="gemini-2.5-flash-preview-09-2025",
    system_instruction=open(SYSTEM_INSTRUCTION_PATH).read()
)

APP_ENV = os.getenv("APP_ENV", "dev")
PROJECT_ID = os.getenv("GCP_PROJECT_ID", "ai-brainstorming-agent")
REGION = os.getenv("GCP_REGION", "us-east5")
VERTEX_MODEL = os.getenv("VERTEX_MODEL", "gemini-2.5-flash-preview-09-2025")
USE_VERTEX = os.getenv("USE_VERTEX", "false").lower() == "true"

if USE_VERTEX:
    init(project=PROJECT_ID, location=REGION)

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

def generate_ideas_placeholder(prompt: str, max_ideas: int, temperature: float) -> List[Idea]:
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

def generate_ideas_vertex(prompt: str, max_ideas: int, temperature: float) -> List[Idea]:
    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(f"Brainstorm {max_ideas} creative ideas for: {prompt}")]
        )
    ]

    model = genai.GenerativeModel(
        model=VERTEX_MODEL,
        system_instruction=(
            "You are a brainstorming coach helping teams refine ideas. "
            "Guide them by generating creative, high-impact, outlier ideas. "
            "Score each for novelty and emotional resonance (sentiment)."
        ),
    )

    response = model.generate_content(
        contents,
        generation_config=genai.GenerationConfig(
            temperature=temperature,
            max_output_tokens=1024,
        )
    )

    ideas = []
    for line in response.text.split("\n"):
        if line.strip():
            ideas.append(
                Idea(
                    text=line.strip(),
                    novelty=round(random.uniform(0.5, 1.0), 2),
                    sentiment=round(random.uniform(-0.2, 0.9), 2),
                )
            )
        if len(ideas) >= max_ideas:
            break
    return ideas

@app.get("/health")
async def health_check():
    return {"status": "ok", "env": APP_ENV, "vertex_enabled": USE_VERTEX}

@app.post("/brainstorm", response_model=BrainstormResponse)
async def brainstorm(request: BrainstormRequest):
    try:
        if USE_VERTEX:
            ideas = generate_ideas_vertex(request.prompt, request.max_ideas, request.temperature)
        else:
            ideas = generate_ideas_placeholder(request.prompt, request.max_ideas, request.temperature)
        return {"ideas": ideas}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
