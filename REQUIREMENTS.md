# Learning Objectives

• Design a minimal but coherent product (problem → users → core flows).

• Implement CRUD for at least **two distinct entities** with **auth** and **validation**.

• Ship a clear **API** (REST or GraphQL) with basic **docs** and light **testing**.

• Add a practical **AI feature** (LLM or small ML model) and evaluate it.

• Practice DX/DevOps basics: environment files, scripts, and repeatable setup.

• Communicate design trade-offs in a concise **≤ 5-page report**.

You can pick any domain, but your app **must** include:

## Frontend (SPA or mobile)

• At least **4 real screens**: list, detail, create/edit form, auth/profile.

• Form validation, loading/empty/error states, and responsive layout.

• Client-side routing and state management (context/store).

## Backend (REST or GraphQL)

• **Two entities** minimum with full **CRUD**.

• **Auth**: simple is fine (cookie session or JWT). Add basic ownership checks for edits/deletes.

• **Validation & errors**: return sensible HTTP codes/messages.

• **Listing**: support a basic list with `limit` (pagination optional). A simple `?q=` filter is a plus.

• **API docs (lightweight)**: either a short README section listing each endpoint with a sample request/response **or** a Postman/Insomnia collection. (OpenAPI/Swagger optional.)

• **Light tests (pick one)**: write **2 small unit tests** _or_ **1 integration test** that hits a real endpoint.

## Data Layer

• Any relational DB or MongoDB. **SQLite/Postgres recommended.**

• Provide a **seed script** with ~10–20 rows so graders can click around.

• **Migrations**: optional but nice. A schema SQL/Prisma file is enough.

• Include a **.env.example** with the needed keys.

## AI Feature (pick one path)

1. **LLM/Embeddings** (recommended):

   ○ Add a feature like summarization, tagging, semantic search, or recommendation.

   ○ Show **prompt design** (system + user prompts) and briefly **note cost/latency** handling (caching/batching/model choice) — a short paragraph is enough.

   ○ Provide a tiny **evaluation**: a 5–10 item labeled set or a brief before/after qualitative comparison with clear criteria.

2. **Classical/Small Model**:

   ○ Use a small HF model or train a lightweight classifier/regressor.

   ○ Document preprocessing, inference path, and evaluation metric.

**Must**: Be explicit about **safety** (PII handling), **rate limits**, and **fallbacks** (e.g., graceful degradation if the AI API is down).

## Non-Functional Requirements

• Accessibility basics (alt text, focus order, color contrast).

• Performance: aim for CRUD p95 < **800 ms** locally; cache if it's easy.

• Security hygiene: no secrets in repo, input sanitation, CORS set deliberately.

## Deliverables

1. **Repository link(s) with**:

   ○ Clear structure, meaningful commits, and a top-level **README**.

   ○ **README must include**: problem statement, how to run locally, environment variables, seed data, test commands, and API docs link.

   ○ **Scripts**: `dev`, `seed`; `test` optional but encouraged (Makefile or npm scripts are fine).

   ○ **.env.example** and **schema/migrations**.

2. **(Optional): Deployed URL** (frontend + API) or a **3–5 min demo video** if deployment isn't feasible.

**Note:** These are just suggestions, and you can change minor specs.
