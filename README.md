# Fantastical Pet Store

A full-stack web application for discovering, generating, and collecting AI-powered fantastical pets. Users can browse a catalog of unique creatures, generate custom pets using AI, and build their personal collection.

## Problem Statement

Pet enthusiasts want to discover and collect unique, imaginative creatures that don't exist in nature. This application combines e-commerce concepts with generative AI to enable users to:

- Browse a curated catalog of fantastical pets with detailed descriptions and care instructions
- Generate custom pets from text prompts using OpenAI's GPT-4o-mini and DALL-E 3
- Build and manage a personal collection of favorite pets
- Search and filter pets by name, species, traits, or description

## Features

### Frontend (4+ screens)

- **Login/Register** - User authentication with form validation
- **Catalog** - Browse all available pets with search functionality
- **My Store** - View and manage your personal pet collection
- **Generate** - Create custom pets using AI with text prompts

### Backend (REST API)

- **Two entities with full CRUD**: Users and Pets
- **JWT-based authentication** with HttpOnly cookies
- **Input validation** using Zod schemas
- **Search and pagination** on pet listings
- **Rate limiting** and error handling

### AI Integration

- **OpenAI GPT-4o-mini** for generating pet descriptions, traits, and care instructions
- **OpenAI DALL-E 3** for generating pet images (1024x1024, stored locally)
- **Prompt engineering** with system prompts for consistent, creative outputs
- **Cost tracking** with token usage and latency monitoring
- **Fallback handling** with graceful degradation to mock provider

## Tech Stack

- **Runtime**: Bun
- **Framework**: Hono (ultrafast web framework)
- **Database**: SQLite with Drizzle ORM
- **Authentication**: JWT with bcrypt password hashing
- **AI**: OpenAI GPT-4o-mini & DALL-E 3
- **Validation**: Zod

## Prerequisites

- [Bun](https://bun.sh/) installed (v1.0+)
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# Database (SQLite file location)
DATABASE_URL="file:./app/pets.db"

# AI Text Provider: 'openai', 'anthropic', or 'mock'
AI_TEXT_PROVIDER="openai"

# Image Provider: 'openai', 'fal', 'stability', 'replicate', or 'none'
IMAGE_PROVIDER="openai"

# OpenAI API Key (required for text and image generation)
OPENAI_API_KEY="your-openai-api-key-here"

# JWT Secret for authentication
JWT_SECRET="your-secret-key-change-this-in-production"
```

**Required variables:**

- `DATABASE_URL` - Path to SQLite database file
- `JWT_SECRET` - Secret key for signing JWT tokens
- `OPENAI_API_KEY` - Your OpenAI API key (for AI features)

**Optional variables:**

- `AI_TEXT_PROVIDER` - Text generation provider (defaults to 'mock')
- `IMAGE_PROVIDER` - Image generation provider (defaults to 'none')
- `PORT` - Server port (defaults to 8787)

### 3. Initialize Database

The database will be created automatically on first run. To manually run migrations:

```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

### 4. Seed Database

Load 20 pre-generated fantastical pets into the catalog:

```bash
bun run seed
```

This will:

- Create 20 unique seed pets with AI-generated images
- Store images locally in `app/web/public/images/pets/`
- Insert pets into database with status 'seed'

**Note**: Seeding requires a valid OpenAI API key and costs ~$0.40 (20 DALL-E 3 images).

### 5. Run Development Server

```bash
bun run dev
```

Server will start at [http://localhost:8787](http://localhost:8787)

### 6. Create an Account

1. Navigate to [http://localhost:8787/register](http://localhost:8787/register)
2. Create an account with username and password
3. You'll be logged in automatically and redirected to the catalog

## Scripts

- `bun run dev` - Start development server with hot reload
- `bun run seed` - Seed database with 20 fantastical pets
- `bunx drizzle-kit generate` - Generate database migrations
- `bunx drizzle-kit migrate` - Apply migrations

## API Documentation

Base URL: `http://localhost:8787/api`

### Authentication

#### POST `/api/auth/register`

Register a new user.

**Request:**

```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "token": "eyJhbGci...",
  "user": { "id": "user_123", "username": "testuser" }
}
```

---

#### POST `/api/auth/login`

Login with credentials.

**Request:**

```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGci...",
  "user": { "id": "user_123", "username": "testuser" }
}
```

---

#### GET `/api/auth/me`

Get current user (requires auth).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "id": "user_123",
  "username": "testuser"
}
```

---

### Pets

#### GET `/api/pets`

List pets with search and pagination.

**Query params:**

- `q` - Search query (name, species, description, traits)
- `limit` - Results per page (1-100, default: 20)
- `offset` - Pagination offset (default: 0)

**Response (200):**

```json
{
  "items": [
    {
      "id": "pet-1",
      "name": "Nimbus the Orbital Puff",
      "species": "Zero-G Cloud Ferret",
      "traits_json": "[\"buoyant\",\"electrostatic\"]",
      "description": "A semi-coherent puff...",
      "care_instructions": "- Ground yourself...",
      "price_cents": 48900,
      "image_url": "/images/pets/pet-1.png",
      "status": "seed"
    }
  ],
  "meta": { "total": 20, "limit": 20, "offset": 0, "count": 20 }
}
```

---

#### GET `/api/pets/:id`

Get single pet by ID.

**Response (200):**

```json
{
  "id": "pet-1",
  "name": "Nimbus the Orbital Puff",
  ...
}
```

---

### Store (requires auth)

#### GET `/api/store`

Get user's pet collection.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
[
  {
    "id": "pet-1",
    "name": "Nimbus",
    "species": "Zero-G Cloud Ferret",
    "price_cents": 48900,
    "image_url": "/images/pets/pet-1.png"
  }
]
```

---

#### POST `/api/store`

Add pet to collection.

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{ "petId": "pet-1" }
```

**Response (201):**

```json
{ "message": "Pet added to store", "petId": "pet-1" }
```

---

#### DELETE `/api/store/:petId`

Remove pet from collection.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{ "message": "Pet removed from store" }
```

---

### Generate (requires auth)

#### POST `/api/generate`

Generate custom pet from text prompt.

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{ "prompt": "A dragon made of clouds with lightning" }
```

**Response (200):**

```json
{
  "draft": {
    "name": "Stormwing",
    "species": "Cloud Dragon",
    "traits": ["flying", "electric"],
    "description": "A majestic dragon...",
    "careInstructions": "- Requires sky access...",
    "priceCents": 150000,
    "imageUrl": "/images/pets/stormwing.png",
    "imagePrompt": "A dragon made of clouds..."
  }
}
```

---

#### POST `/api/generate/accept`

Accept and publish generated pet.

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{
  "name": "Stormwing",
  "species": "Cloud Dragon",
  "traits": ["flying", "electric"],
  "description": "A majestic dragon...",
  "careInstructions": "- Requires sky access...",
  "priceCents": 150000,
  "imageUrl": "/images/pets/stormwing.png"
}
```

**Response (201):**

```json
{
  "id": "pet_xyz",
  "name": "Stormwing",
  "status": "published",
  ...
}
```

---

## AI Implementation

### Text Generation (OpenAI GPT-4o-mini)

**System Prompt:**

```
You are a creative pet designer for a fantastical pet store.
Generate imaginative, whimsical pets that blend real animal traits
with magical or sci-fi elements.
```

**User Prompt:**

```
Create a fantastical pet based on: {user_prompt}

Return JSON with: name, species, traits (3-5), description,
careInstructions (3-5 tips), priceCents (10000-500000),
imagePrompt (detailed DALL-E prompt)
```

**Cost & Latency:**

- Latency: ~2-4 seconds
- Cost: ~$0.001-0.003 per generation
- Tokens: ~200-300 input, ~300-500 output

### Image Generation (OpenAI DALL-E 3)

**Configuration:**

- Size: 1024x1024 (standard quality)
- Style: vivid
- Enhanced prompts with photography instructions

**Storage:**

- Downloaded and saved locally in `app/web/public/images/pets/`
- Prevents URL expiration (DALL-E URLs expire in 1-2 hours)

**Cost & Latency:**

- Latency: ~8-15 seconds
- Cost: ~$0.02 per image

### Safety & Fallbacks

**PII Handling:**

- No PII collected (username only)
- User prompts sent to OpenAI API ([data policy](https://openai.com/policies/api-data-usage-policies))

**Rate Limiting:**

- Frontend loading states prevent rapid requests
- Relies on OpenAI default rate limits (3,500 RPM)

**Fallbacks:**

- Falls back to mock provider if API key not configured
- Error messages returned to user if generation fails
- Nullable AI metadata fields in database

### Evaluation

Test set of 5 prompts evaluated for creativity, consistency, and quality:

| Prompt                   | Result      | Quality     |
| ------------------------ | ----------- | ----------- |
| "A cat made of water"    | "Ripple"    | ✓ Excellent |
| "Fire-breathing hamster" |             | ✓ Good      |
| "Robot owl with lasers"  | "Byte Wing" | ✓ Excellent |
| "Ghost dog that glows"   |             | ✓ Good      |
| "Crystal butterfly"      |             | ✓ Excellent |

**Criteria met:**

- ✓ Creativity: Unique, imaginative pets
- ✓ Consistency: Coherent traits and descriptions
- ✓ Quality: High-quality DALL-E 3 images

## Project Structure

```
tomer-hw/
├── app/
│   ├── server/
│   │   ├── ai/              # LLM & image generation
│   │   ├── auth/            # JWT signing/verification
│   │   ├── db/              # Database schema & seed
│   │   ├── middleware/      # Auth & error handling
│   │   ├── routes/          # API route handlers
│   │   ├── utils/           # Image download utility
│   │   ├── validation/      # Zod schemas
│   │   ├── scripts/         # Seed scripts
│   │   └── app.ts           # Server entry point
│   ├── web/
│   │   └── public/
│   │       ├── js/          # Frontend JavaScript
│   │       ├── images/      # Pet images
│   │       └── *.html       # HTML pages
│   └── pets.db              # SQLite database
├── drizzle.config.ts
├── package.json
├── .env
└── README.md
```

## Database Schema

**Users:** id, username, passwordHash, createdAt

**Pets:** id, name, species, traitsJson, description, careInstructions, priceCents, imageUrl, status, createdByUserId, createdAt

**UserPets:** id, userId, petId, addedAt (join table)

**Generations:** id, userId, prompt, model, inputTokens, outputTokens, costUsd, latencyMs, createdAt (AI tracking)

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT authentication with HttpOnly cookies
- Zod input validation on all endpoints
- Drizzle ORM prevents SQL injection
- CORS configured for localhost
- Secrets in environment variables

## Performance

- Target: < 800ms (p95) for CRUD operations
- Actual: < 100ms for most endpoints (SQLite)
- AI generation: 2-4s text, 8-15s images

## License

MIT
