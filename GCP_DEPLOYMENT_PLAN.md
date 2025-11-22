# GCP Deployment & Vertex AI Integration Plan

## Overview
This document outlines the plan for deploying the AI Brainstorming Agent to Google Cloud Platform (GCP) and integrating real Vertex AI calls to replace placeholder functionality.

---

## Phase 1: GCP Project Setup & Prerequisites

### 1.1 GCP Project Configuration
- **Create/Select GCP Project**
  - Create new project or use existing one
  - Enable billing
  - Note Project ID for configuration

- **Enable Required APIs**
  - Vertex AI API
  - Cloud Build API
  - Artifact Registry API
  - Cloud Run API
  - Service Usage API
  - IAM API

### 1.2 Authentication & Service Accounts
- **Create Service Account**
  - Name: `brainstorming-agent-sa`
  - Roles:
    - `roles/aiplatform.user` (Vertex AI access)
    - `roles/artifactregistry.writer` (for Cloud Build)
    - `roles/run.developer` (Cloud Run deployment)
    - `roles/storage.objectViewer` (if using Cloud Storage for prompts)

- **Create & Download Service Account Key**
  - Generate JSON key file
  - Store securely (consider Secret Manager for production)
  - Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable locally

### 1.3 Artifact Registry Setup
- **Create Repository**
  - Repository name: `brainstorming-agent`
  - Format: Docker
  - Region: `us-east5` (or preferred region)
  - Full path: `us-east5-docker.pkg.dev/$PROJECT_ID/brainstorming-agent/follow-the-spark`

---

## Phase 2: Vertex AI Integration

### 2.1 Update Backend Dependencies
**File: `backend/requirements.txt`**
```
fastapi
uvicorn[standard]
google-cloud-aiplatform>=1.38.0
pydantic
python-dotenv
```

### 2.2 Create Vertex AI Service Module
**New File: `backend/utils/vertex_ai_service.py`**

**Key Functions:**
1. **`initialize_vertex_client()`**
   - Initialize Vertex AI client with project/region
   - Handle authentication (service account or default credentials)
   - Return configured client

2. **`generate_ideas_with_vertex(prompt, max_ideas, temperature, personality, technique_info)`**
   - Load appropriate system prompt from `backend/prompts/`
   - Construct user prompt based on technique (SCAMPER, Metaphor Remix, etc.)
   - Call Gemini model via Vertex AI
   - Parse response to extract ideas
   - Calculate novelty/sentiment scores (or request from model)
   - Return formatted ideas

3. **`ask_about_idea_with_vertex(question, idea_text, topic, context)`**
   - Construct context-aware prompt
   - Call Gemini for Q&A
   - Return answer with suggested follow-ups

4. **`handle_voice_conversation_with_vertex(message, conversation_history, context)`**
   - Maintain conversation context
   - Extract structured data (name, topic)
   - Return response with extracted info

**Implementation Details:**
- Use `google.cloud.aiplatform` SDK
- Model: `gemini-1.0-pro` or `gemini-1.5-pro` (configurable)
- Temperature: Dynamic based on request (0.7-0.9)
- Token limits: Set appropriate max_tokens
- Error handling: Fallback to placeholder if Vertex AI fails
- Retry logic: Exponential backoff for transient errors

### 2.3 Update Main Backend Logic
**File: `backend/main.py`**

**Changes:**
1. Import vertex_ai_service module
2. Update `/brainstorm` endpoint:
   - Check `USE_VERTEX` environment variable
   - If true, call `generate_ideas_with_vertex()`
   - If false or error, fallback to `generate_ideas_placeholder()`
   - Maintain backward compatibility

3. Update `/ask-about-idea` endpoint:
   - Integrate Vertex AI for Q&A
   - Fallback to placeholder response

4. Update `/conversation` endpoint:
   - Integrate Vertex AI for voice conversations
   - Extract structured data from responses

### 2.4 Environment Variables
**New/Updated Variables:**
```bash
# GCP Configuration
GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1
VERTEX_MODEL=gemini-1.0-pro  # or gemini-1.5-pro

# Feature Flags
USE_VERTEX=true  # Enable Vertex AI integration
APP_ENV=production

# Authentication (for local dev)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

---

## Phase 3: Prompt Engineering & Optimization

### 3.1 Enhance System Prompts
**Files: `backend/prompts/`**

**Updates Needed:**
1. **`base_prompt.txt`**
   - Add instructions for structured JSON output
   - Specify idea format (text, novelty, sentiment)
   - Include technique-specific guidance

2. **`branching_prompt.txt`**
   - Update for Vertex AI context window
   - Add few-shot examples
   - Specify output schema

3. **`gemini_system_instruction.txt`**
   - Optimize for Gemini model
   - Add token efficiency instructions
   - Include error handling guidance

### 3.2 Technique-Specific Prompts
**Create: `backend/prompts/technique_prompts.py`**
- Map each technique to optimized prompt template
- Include examples for each technique
- Dynamic prompt construction based on personality

### 3.3 Response Parsing
- Implement robust JSON parsing
- Handle malformed responses gracefully
- Validate idea structure (text, novelty, sentiment)
- Fallback to regex extraction if JSON fails

---

## Phase 4: Docker & Containerization

### 4.1 Update Dockerfile
**File: `Dockerfile`**

**Changes:**
1. Use Python 3.11 base image
2. Install system dependencies if needed
3. Copy only backend files (optimize for smaller image)
4. Set working directory to `/app/backend`
5. Install dependencies from `requirements.txt`
6. Expose port 8080 (Cloud Run standard)
7. Use production uvicorn command with workers

**Optimized Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy only requirements first (for caching)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Set environment variables
ENV PORT=8080
ENV PYTHONUNBUFFERED=1

EXPOSE 8080

# Production command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "2"]
```

### 4.2 Multi-Stage Build (Optional)
- Consider multi-stage build for smaller final image
- Separate build and runtime stages
- Reduce image size for faster deployments

### 4.3 .dockerignore
**Create: `.dockerignore`**
```
frontend/
node_modules/
.git/
.env
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
```

---

## Phase 5: Cloud Build Configuration

### 5.1 Update cloudbuild.yaml
**File: `cloudbuild.yaml`**

**Changes:**
1. Fix duplicate steps (remove duplicates)
2. Add environment variable substitution
3. Add build arguments for version tagging
4. Add caching for Docker layers
5. Add build timeouts
6. Add step for running tests (optional)

**Improved cloudbuild.yaml:**
```yaml
options:
  logging: CLOUD_LOGGING_ONLY
  machineType: 'E2_HIGHCPU_8'
  substitution_option: 'ALLOW_LOOSE'

substitutions:
  _REGION: 'us-east5'
  _SERVICE_NAME: 'follow-the-spark-agent'
  _IMAGE_NAME: 'follow-the-spark'

steps:
  # Step 1: Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - '${_REGION}-docker.pkg.dev/$PROJECT_ID/brainstorming-agent/${_IMAGE_NAME}:$SHORT_SHA'
      - '-t'
      - '${_REGION}-docker.pkg.dev/$PROJECT_ID/brainstorming-agent/${_IMAGE_NAME}:latest'
      - '.'
    id: 'build-image'

  # Step 2: Push to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - '--all-tags'
      - '${_REGION}-docker.pkg.dev/$PROJECT_ID/brainstorming-agent/${_IMAGE_NAME}'
    id: 'push-image'

  # Step 3: Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - '${_SERVICE_NAME}'
      - '--image'
      - '${_REGION}-docker.pkg.dev/$PROJECT_ID/brainstorming-agent/${_IMAGE_NAME}:$SHORT_SHA'
      - '--region'
      - '${_REGION}'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--memory'
      - '2Gi'
      - '--cpu'
      - '2'
      - '--timeout'
      - '300'
      - '--max-instances'
      - '10'
      - '--set-env-vars'
      - 'GCP_PROJECT_ID=$PROJECT_ID,GCP_REGION=${_REGION},VERTEX_MODEL=gemini-1.0-pro,USE_VERTEX=true,APP_ENV=production'
      - '--service-account'
      - 'brainstorming-agent-sa@$PROJECT_ID.iam.gserviceaccount.com'
    id: 'deploy-cloud-run'

images:
  - '${_REGION}-docker.pkg.dev/$PROJECT_ID/brainstorming-agent/${_IMAGE_NAME}:$SHORT_SHA'
  - '${_REGION}-docker.pkg.dev/$PROJECT_ID/brainstorming-agent/${_IMAGE_NAME}:latest'

timeout: '1200s'
```

### 5.2 Cloud Build Triggers
- Set up trigger on push to `main` branch
- Add manual trigger option
- Configure branch-based deployments (staging/production)

---

## Phase 6: Cloud Run Deployment

### 6.1 Service Configuration
- **Memory**: 2Gi (adjust based on model size)
- **CPU**: 2 vCPU (for faster responses)
- **Timeout**: 300 seconds (for long-running AI calls)
- **Min Instances**: 0 (cost optimization)
- **Max Instances**: 10 (scale as needed)
- **Concurrency**: 80 requests per instance

### 6.2 Environment Variables
Set in Cloud Run service:
- `GCP_PROJECT_ID`: From project
- `GCP_REGION`: Deployment region
- `VERTEX_MODEL`: `gemini-1.0-pro`
- `USE_VERTEX`: `true`
- `APP_ENV`: `production`
- `CORS_ORIGINS`: Frontend URL (for production CORS)

### 6.3 Service Account
- Attach `brainstorming-agent-sa` service account
- Grants Vertex AI access without storing keys

### 6.4 Custom Domain (Optional)
- Map custom domain to Cloud Run service
- Configure SSL certificate
- Update frontend CORS settings

---

## Phase 7: Frontend Integration

### 7.1 Update Frontend Environment
**File: `frontend/.env.production`**
```
VITE_BACKEND_URL=https://follow-the-spark-agent-xxxxx.run.app
```

### 7.2 Update Frontend Build
**File: `frontend/vite.config.js`**
- Ensure environment variables are properly injected
- Configure production build optimizations

### 7.3 Frontend Deployment Options
**Option A: Cloud Run (Same Service)**
- Serve static files from FastAPI
- Add static file serving to backend

**Option B: Cloud Storage + Cloud CDN**
- Build frontend to static files
- Upload to Cloud Storage bucket
- Configure Cloud CDN for performance
- Set up custom domain

**Option C: Firebase Hosting**
- Deploy frontend to Firebase Hosting
- Connect to Cloud Run backend
- Configure rewrites for API calls

**Recommended: Option C (Firebase Hosting)**
- Easy deployment
- Good performance
- Free tier available
- Automatic SSL

---

## Phase 8: Monitoring & Logging

### 8.1 Cloud Logging
- Structured logging in backend
- Log levels: INFO, WARNING, ERROR
- Include request IDs for tracing
- Log Vertex AI API calls and responses

### 8.2 Cloud Monitoring
- Set up alerts for:
  - High error rates
  - Slow response times (>5s)
  - Vertex AI quota limits
  - Cloud Run instance scaling issues

### 8.3 Error Tracking
- Integrate error tracking service (Sentry, etc.)
- Track Vertex AI API errors
- Monitor fallback to placeholder usage

### 8.4 Performance Metrics
- Track API response times
- Monitor Vertex AI token usage
- Track cost per request
- Set up dashboards in Cloud Monitoring

---

## Phase 9: Security & Compliance

### 9.1 Authentication (Optional)
- Implement API key authentication
- Or use Cloud Run IAM authentication
- Restrict CORS to frontend domain

### 9.2 Secrets Management
- Store service account keys in Secret Manager
- Use Secret Manager API in Cloud Run
- Rotate keys regularly

### 9.3 Input Validation
- Validate all inputs in FastAPI
- Sanitize prompts before sending to Vertex AI
- Rate limiting (consider Cloud Endpoints)

### 9.4 Data Privacy
- Review Vertex AI data usage policies
- Implement data retention policies
- Consider user data deletion requests

---

## Phase 10: Cost Optimization

### 10.1 Vertex AI Costs
- Monitor token usage
- Optimize prompts to reduce tokens
- Cache common responses (optional)
- Set budget alerts

### 10.2 Cloud Run Costs
- Optimize container size
- Set appropriate min/max instances
- Use request-based autoscaling
- Monitor instance hours

### 10.3 Caching Strategy (Future)
- Implement Redis for caching common prompts
- Cache technique-specific responses
- Reduce Vertex AI API calls

---

## Phase 11: Testing & Validation

### 11.1 Local Testing
- Test Vertex AI integration locally
- Use service account key for authentication
- Validate all endpoints
- Test error handling

### 11.2 Staging Environment
- Deploy to staging Cloud Run service
- Test with real Vertex AI calls
- Validate response formats
- Load testing

### 11.3 Production Deployment
- Deploy to production
- Monitor initial requests
- Validate Vertex AI integration
- Check error rates

---

## Phase 12: Documentation & Runbooks

### 12.1 Deployment Documentation
- Document deployment process
- Create runbook for common issues
- Document rollback procedures

### 12.2 API Documentation
- Update API docs with Vertex AI integration
- Document new environment variables
- Create troubleshooting guide

### 12.3 Operational Runbooks
- Vertex AI API error handling
- Cloud Run scaling issues
- Cost optimization procedures
- Incident response procedures

---

## Rollback Plan

1. Set `USE_VERTEX=false` environment variable in Cloud Run
2. Redeploy with placeholder functionality
3. Monitor error rates
4. Fix Vertex AI integration issues
5. Re-enable Vertex AI when fixed

---

## Success Criteria

- ✅ Vertex AI integration working in production
- ✅ Response times < 5 seconds for idea generation
- ✅ Error rate < 1%
- ✅ Cost within budget
- ✅ Monitoring and alerts configured
- ✅ Documentation complete
- ✅ Frontend successfully calling production backend

---

## Next Steps

1. Review and approve this plan
2. Set up GCP project and enable APIs
3. Create service account and download key
4. Begin Phase 2 implementation (Vertex AI Integration)
5. Test locally before deploying to Cloud Run

