# OpenAI Integration Setup

## Overview
Your PetSynth application now supports OpenAI integration for both text generation (GPT-4) and image generation (DALL-E 3).

## Configuration

### 1. Add your OpenAI API Key
Edit the `.env` file in the project root and replace `your-openai-api-key-here` with your actual API key:

```env
OPENAI_API_KEY="sk-proj-..."
```

### 2. Environment Variables

The `.env` file contains the following configuration:

- `DATABASE_URL`: Path to SQLite database
- `AI_TEXT_PROVIDER`: Set to `"openai"` to use GPT-4o-mini for pet generation
- `IMAGE_PROVIDER`: Set to `"openai"` to use DALL-E 3 for image generation
- `OPENAI_API_KEY`: Your OpenAI API key
- `JWT_SECRET`: Secret key for JWT authentication

## Features Implemented

### 1. OpenAI DALL-E 3 Image Generation
Located in: `app/server/ai/image.ts`

- **Model**: DALL-E 3
- **Size**: 1024x1024 (uniform size for all images)
- **Quality**: Standard
- **Style**: Vivid
- **Enhancement**: Automatically adds professional photography instructions to ensure uniform, high-quality images

**Usage**: Images are automatically generated when users create pets via the `/api/generate` endpoint.

### 2. 20 Fantastical Seed Pets
Located in: `app/server/db/seed.ts`

The database is now seeded with 20 creative pets including:
- Nimbus the Orbital Puff (Zero-G Cloud Ferret)
- Whisper (Theremin Cat)
- Tick-Tock (Clockwork Axolotl)
- Jitter (Caffeine Mole-Rat)
- Ember (Velvet Basilisk)
- Fractal (Recursive Gecko)
- Fog (Liminal Space Hound)
- Pixel (Bitmap Butterfly)
- Melody (Synesthetic Songbird)
- Quantum (Schrödinger's Hamster)
- Prism (Refraction Rabbit)
- Echo (Reverb Raven)
- Marble (Philosophical Tortoise)
- Shimmer (Soap Bubble Sloth)
- Glitch (Error Message Eel)
- Whiskers (Probability Cloud Cat)
- Void (Absence Owl)
- Puzzle (Tessellation Terrier)
- Ripple (Interference Pattern Fish)
- Möbius (One-Sided Snake)

All pets include:
- Unique species names
- Creative traits (3-6 adjectives)
- Whimsical descriptions
- Detailed care instructions (8-14 lines)
- Prices ranging from $349 to $1,420

## How It Works

### Pet Generation Flow

1. **User submits prompt** → POST `/api/generate`
2. **LLM generates pet data** → Uses OpenAI GPT-4o-mini to create:
   - Name, species, traits
   - Description
   - Care instructions
   - Price
   - Image prompt
3. **Image generation** → DALL-E 3 creates a 1024x1024 image based on the prompt
4. **Response returned** → Pet draft with image URL

### Image Prompt Enhancement

The system automatically enhances image prompts to ensure uniformity:
```typescript
const enhancedPrompt = `${imagePrompt}. Professional product photography, centered composition, clean background, studio lighting, high quality, 1024x1024`;
```

This ensures all generated images:
- Are uniformly sized (1024x1024)
- Have consistent professional styling
- Feature centered subjects
- Have clean backgrounds
- Use studio lighting

## Reseed the Database

To populate the database with all 20 pets:

```bash
cd /Users/tomerbenyaakov/Documents/Code/Assignment\ 1\ -\ foundations\ of\ networks/tomer-hw
DATABASE_URL="file:./app/pets.db" bun run app/server/db/seed.ts
```

## Testing

1. **Start the server**:
   ```bash
   bun run dev
   ```

2. **Register/Login** at http://localhost:8787/login

3. **View catalog** at http://localhost:8787/catalog
   - You should see all 20 seed pets

4. **Generate a new pet**:
   - Use the generate endpoint with your authentication token
   - The system will create a pet with a DALL-E generated image

## API Endpoints

### Generate Pet
```bash
POST /api/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "A cosmic hamster that runs on dark matter"
}
```

### Accept Generated Pet
```bash
POST /api/generate/accept
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "...",
  "species": "...",
  "traits": [...],
  "description": "...",
  "careInstructions": "...",
  "priceCents": 50000,
  "imageUrl": "https://..."
}
```

## Cost Considerations

- **DALL-E 3**: ~$0.040 per 1024x1024 image
- **GPT-4o-mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens

Typical pet generation costs ~$0.04-0.05 per pet.

## Fallback Behavior

If the OpenAI API key is not configured or the API fails:
- **Text generation**: Falls back to mock data
- **Image generation**: Uses placeholder images from placehold.co

## Files Modified

1. `app/server/ai/image.ts` - Added OpenAI DALL-E integration
2. `app/server/db/seed.ts` - Added 20 fantastical pets
3. `.env` - Added OpenAI configuration
4. `app/server/routes/generate.ts` - Already integrated (no changes needed)

## Next Steps

1. Add your OpenAI API key to `.env`
2. Reseed the database if needed
3. Start the server and test pet generation
4. Optionally: Generate images for the 20 seed pets using the OpenAI API
