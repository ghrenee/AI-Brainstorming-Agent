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
import re

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

class IdeaQuestionRequest(BaseModel):
    question: str = Field(..., example="How can I implement this idea?")
    idea_text: str = Field(..., example="Create a blockchain marketplace")
    topic: Optional[str] = Field(None, example="Reducing plastic waste")
    context: Optional[str] = Field(None, example="Additional context about the idea")

class IdeaQuestionResponse(BaseModel):
    answer: str
    suggested_followups: Optional[List[str]] = None

class ConversationRequest(BaseModel):
    message: str = Field(..., example="I have an idea for reducing plastic waste")
    conversation_history: Optional[List[dict]] = Field(None, example=[])
    context: Optional[str] = Field(None, example="User is brainstorming")

class ConversationResponse(BaseModel):
    response: str
    extracted_topic: Optional[str] = None
    extracted_name: Optional[str] = None
    should_proceed: bool = False
    suggested_questions: Optional[List[str]] = None

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

@app.post("/ask-about-idea", response_model=IdeaQuestionResponse)
async def ask_about_idea(request: IdeaQuestionRequest):
    """Answer questions about a specific idea."""
    try:
        # Generate contextual answer based on question and idea
        answer = generate_idea_answer(request.question, request.idea_text, request.topic, request.context)
        suggested_followups = generate_followup_questions(request.question)
        return {
            "answer": answer,
            "suggested_followups": suggested_followups
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

def generate_idea_answer(question: str, idea_text: str, topic: Optional[str] = None, context: Optional[str] = None) -> str:
    """Generate an answer about an idea based on the question."""
    question_lower = question.lower()
    
    # Context-aware answers
    if "how" in question_lower or "implement" in question_lower:
        return f"To implement '{idea_text}', you could start by breaking it down into smaller phases. First, identify the core components and stakeholders involved. Consider creating a prototype to validate the concept, then iterate based on feedback. You might also want to research similar solutions and learn from their approaches."
    
    elif "why" in question_lower or "benefit" in question_lower or "important" in question_lower:
        return f"This idea is valuable because it addresses {topic or 'the problem'} in an innovative way. '{idea_text}' could provide unique benefits by offering a fresh perspective and potentially solving challenges that traditional approaches haven't addressed effectively."
    
    elif "who" in question_lower or "target" in question_lower or "user" in question_lower:
        return f"For '{idea_text}', your target audience could include people who are interested in {topic or 'innovative solutions'}. Consider who would benefit most from this approach and who might face the challenges this idea addresses."
    
    elif "what" in question_lower and ("next" in question_lower or "step" in question_lower):
        return f"Next steps for '{idea_text}' could include: 1) Research and validate the concept, 2) Create a detailed plan, 3) Identify resources and partnerships needed, 4) Build a prototype or MVP, 5) Test and gather feedback, 6) Iterate and improve."
    
    elif "challenge" in question_lower or "problem" in question_lower or "difficulty" in question_lower:
        return f"Potential challenges for '{idea_text}' might include: technical complexity, resource requirements, market adoption, or regulatory considerations. However, these challenges also present opportunities for creative problem-solving and innovation."
    
    elif "cost" in question_lower or "expensive" in question_lower or "budget" in question_lower:
        return f"The cost of implementing '{idea_text}' would depend on various factors like scale, technology choices, and resources. Consider starting with a lean approach, using open-source tools where possible, and scaling gradually based on results."
    
    else:
        # Generic helpful answer
        return f"Regarding '{idea_text}': {question}. This is an interesting aspect to explore. The idea offers potential for innovation in {topic or 'this area'}. To dive deeper, consider researching similar solutions, identifying key stakeholders, and thinking about how to make this idea unique and valuable."

def generate_followup_questions(original_question: str) -> List[str]:
    """Generate suggested follow-up questions."""
    followups = [
        "What are the key challenges in implementing this?",
        "Who would benefit most from this idea?",
        "What are the next steps to get started?",
        "How does this compare to existing solutions?",
        "What resources would be needed?"
    ]
    # Return 3 random followups
    return random.sample(followups, k=min(3, len(followups)))

@app.post("/conversation", response_model=ConversationResponse)
async def conversation(request: ConversationRequest):
    """Handle conversational messages and extract information."""
    try:
        message_lower = request.message.lower()
        extracted_topic = None
        extracted_name = None
        should_proceed = False
        
        # Extract name
        name_patterns = [
            r"(?:my name is|i'm|i am|call me|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
            r"^([A-Z][a-z]+)\s+(?:here|speaking)"
        ]
        for pattern in name_patterns:
            match = re.search(pattern, request.message, re.IGNORECASE)
            if match:
                extracted_name = match.group(1).strip()
                break
        
        # Extract topic/idea
        # Look for idea-related keywords
        idea_keywords = ['idea', 'thinking about', 'want to', 'problem', 'challenge', 'trying to', 'explore']
        if any(keyword in message_lower for keyword in idea_keywords):
            # Extract sentences that might contain the idea
            sentences = re.split(r'[.!?]+', request.message)
            for sentence in sentences:
                sentence = sentence.strip()
                if len(sentence) > 20 and any(keyword in sentence.lower() for keyword in idea_keywords):
                    # Clean up the sentence
                    sentence_lower = sentence.lower()
                    for phrase in ['i have an idea for', 'i want to', "i'm thinking about", 'i am thinking about']:
                        sentence_lower = sentence_lower.replace(phrase, '').strip()
                    if sentence_lower and len(sentence_lower) > 10:
                        extracted_topic = sentence_lower.capitalize()[:100]
                        break
        
        # If no clear topic found, use the message if it's substantial
        if not extracted_topic and len(request.message) > 30:
            # Remove greeting words
            cleaned = message_lower
            for word in ['hello', 'hi', 'hey', 'my name is', "i'm", 'i am', 'call me']:
                cleaned = cleaned.replace(word, '', 1)
            cleaned = cleaned.strip()
            if len(cleaned) > 15:
                extracted_topic = cleaned.capitalize()[:100]  # Limit length
        
        # Generate conversational response
        response = generate_conversational_response(request.message, request.conversation_history, extracted_topic)
        
        # Determine if we should proceed (have topic and enough conversation)
        if extracted_topic and len(request.conversation_history or []) >= 2:
            should_proceed = True
        
        # Generate suggested questions
        suggested_questions = [
            "Tell me more about this idea",
            "What problem does it solve?",
            "Who would benefit from this?",
            "What makes it unique?",
            "How would you implement it?"
        ]
        
        return {
            "response": response,
            "extracted_topic": extracted_topic,
            "extracted_name": extracted_name,
            "should_proceed": should_proceed,
            "suggested_questions": suggested_questions[:3]
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

def generate_conversational_response(message: str, history: Optional[List[dict]] = None, topic: Optional[str] = None) -> str:
    """Generate a conversational response based on user message."""
    message_lower = message.lower()
    history = history or []
    
    # Greeting responses
    if any(word in message_lower for word in ['hello', 'hi', 'hey']):
        return "Hello! I'm excited to help you brainstorm. What idea or problem would you like to explore today?"
    
    # Idea-related responses
    if any(word in message_lower for word in ['idea', 'thinking about', 'want to', 'thought']):
        if topic:
            return f"That's a fascinating idea about {topic}! Tell me more about it. What problem does it solve, or what makes it unique?"
        return "That sounds interesting! Tell me more about your idea. What problem does it solve, or what makes it unique?"
    
    # Problem-related responses
    if any(word in message_lower for word in ['problem', 'challenge', 'issue', 'struggling']):
        return "I see. Let's think about this problem from different angles. What have you tried so far? What obstacles are you facing?"
    
    # Implementation questions
    if any(word in message_lower for word in ['how', 'implement', 'build', 'create', 'make']):
        return "Great question! Let's break this down. What's the core concept? Who would use this? What resources would you need?"
    
    # Agreement/continuation
    if any(word in message_lower for word in ['yes', 'sure', 'okay', 'ok', 'yeah', 'yep']):
        if topic:
            return f"Perfect! Let's dive deeper into {topic}. What aspect would you like to explore first?"
        return "Great! Tell me more about what you're thinking. What's the main concept?"
    
    # More information request
    if any(word in message_lower for word in ['more', 'elaborate', 'explain', 'tell me']):
        return "I'd love to hear more! Can you describe the key components? What would make this idea successful?"
    
    # Generic helpful response
    responses = [
        "That's a great point! Tell me more about that.",
        "I understand. What are you hoping to achieve with this?",
        "Interesting! What makes this important to you?",
        "Let's explore that further. What are the key aspects?",
        "That's valuable insight! How would this work in practice?"
    ]
    
    # Use context from history if available
    if len(history) >= 2:
        return responses[random.randint(0, len(responses) - 1)]
    
    return "I'm listening! Tell me more about your idea. What excites you about it?"
