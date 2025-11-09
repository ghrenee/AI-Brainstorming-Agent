"""
Technique Mapping for AI Brainstorming Agent
---------------------------------------------
Maps personality tone or group energy to structured creativity techniques.
Used during Phase 3 to determine which brainstorming method Gemini should use
to guide the next generation round.
"""

TECHNIQUE_MAP = {
    "high_energy": {
        "method": "Metaphor Remix",
        "description": "Encourages lateral thinking by reframing the challenge through vivid analogies and playful comparisons.",
        "prompt_hint": "Use metaphors or surprising analogies to shift perspective."
    },
    "analytical": {
        "method": "SCAMPER",
        "description": "Applies structured creativity—Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse.",
        "prompt_hint": "Systematically analyze how to modify or recombine existing ideas."
    },
    "contrarian": {
        "method": "Reverse Storming",
        "description": "Flips assumptions to discover opportunities hidden in problems or constraints.",
        "prompt_hint": "Ask: how could we intentionally make this worse, then reverse the answer?"
    },
    "empathetic": {
        "method": "Role Storming",
        "description": "Ideate through another person’s perspective or stakeholder lens.",
        "prompt_hint": "Think like a specific role or character—how would they approach this?"
    },
    "balanced": {
        "method": "Morphological Mix",
        "description": "Combines fragments from multiple concepts into novel hybrids.",
        "prompt_hint": "Fuse two unrelated ideas into a single hybrid concept."
    }
}

def suggest_technique(personality_signal: str) -> dict:
    """Return the suggested technique dict given a personality or sentiment signal."""
    key = personality_signal.lower()
    return TECHNIQUE_MAP.get(key, TECHNIQUE_MAP["balanced"])
