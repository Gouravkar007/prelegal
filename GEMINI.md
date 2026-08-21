# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

The current implementation supports all 11 document types via AI chat with full user authentication and document persistence.

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via OpenRouter to the `openrouter/openai/gpt-oss-20b` model with Cerebras as the inference provider. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

There is an OPENROUTER_API_KEY in the .env file in the project root.

## Technical design

The entire project should be packaged into a Docker container.  
The backend should be in backend/ and be a uv project, using FastAPI.  
The frontend should be in frontend/  
The database should use SQLLite and be created from scratch each time the Docker container is brought up, allowing for a users table with sign up and sign in.  
Consider statically building the frontend and serving it via FastAPI, if that will work.  
There should be scripts in scripts/ for:  
```bash
# Mac
scripts/start-mac.sh    # Start
scripts/stop-mac.sh     # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```
Backend available at http://localhost:8000

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`

## Implementation Status

### PL-4: V1 Product Foundation (Completed)
- **Frontend Architecture**: Next.js 16 app configured for static export (`output: 'export'`) with a prototype authentication screen (`LoginScreen.tsx`), user session state management, and color palette alignment.
- **FastAPI Backend & SQLite**: `uv` FastAPI backend in `backend/` with auto-initializing SQLite database on startup (`users` table creation & seed demo data). Exposes `/api/health`, `/api/users`, and `/api/auth/login` endpoints while serving static frontend assets.
- **Docker Containerization**: Multi-stage `Dockerfile` and cross-platform start/stop scripts in `scripts/` (`start-mac.sh`, `stop-mac.sh`, `start-linux.sh`, `stop-linux.sh`, `start-windows.ps1`, `stop-windows.ps1`) running on http://localhost:8000.
- **Automated Testing**: 15 Vitest frontend unit/integration tests and 4 Pytest backend tests passing.

### PL-5: Freeform AI Contract Drafter (Completed)
- **LiteLLM & Cerebras Integration**: `backend/app/ai_chat.py` implementing LiteLLM via OpenRouter to `openrouter/openai/gpt-oss-20b` with Cerebras inference provider, Pydantic Structured Outputs (`AIChatResponseSchema`), robust Markdown JSON code block stripping, and model failover.
- **Rule-Based NLP Fallback Engine**: Local extraction fallback engine supporting multi-word canonical US states (e.g. New York, Delaware), Party 1/2 details (name, type, state, signer title), purpose, confidentiality term/years, and agreement term years.
- **Frontend AI Chat Panel Component**: Interactive `AIChatPanel.tsx` in Next.js with real-time field auto-population, quick suggestion prompts, responsive chat bubbles, and offline fallback parser.
- **FastAPI Endpoint**: Exposed `/api/chat` endpoint processing message history and document state, returning populated fields and friendly assistant response summaries.
- **Automated Test Suite**: 16 passing Pytest unit/integration tests in `backend/tests/` and Vitest frontend tests.

