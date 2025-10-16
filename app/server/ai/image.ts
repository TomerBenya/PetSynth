// Image generation utilities
import OpenAI from 'openai';
import { downloadAndSaveImage, generateImageFilename } from '../utils/download-image.js';

/**
 * Generate placeholder image URL
 */
function placeholderImage(text: string): string {
  const encoded = encodeURIComponent(text);
  return `https://placehold.co/640x480?text=${encoded}`;
}

/**
 * Generate image using OpenAI DALL-E API
 * Downloads and saves image locally, returns local path
 */
async function generateWithOpenAI(
  imagePrompt: string,
  name?: string,
  petId?: string
): Promise<{ imageUrl: string; warning?: string }> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        imageUrl: placeholderImage(name ?? imagePrompt.slice(0, 40)),
        warning: "OpenAI API key not configured; using placeholder",
      };
    }

    const client = new OpenAI({ apiKey });

    // Enhance prompt for consistent sizing
    const enhancedPrompt = `${imagePrompt}. Professional product photography, centered composition, clean background, studio lighting, high quality, 1024x1024`;

    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid',
    });

    const tempImageUrl = response.data?.[0]?.url;

    if (!tempImageUrl) {
      throw new Error('No image URL in OpenAI response');
    }

    // Download and save image locally
    let localImageUrl: string;
    try {
      // Generate filename based on petId or name
      const filename = petId
        ? generateImageFilename(petId)
        : generateImageFilename(name?.toLowerCase().replace(/\s+/g, '-') ?? `pet-${Date.now()}`);

      // Download and save
      localImageUrl = await downloadAndSaveImage(tempImageUrl, filename);

      console.log(`✓ Saved image locally: ${localImageUrl}`);
    } catch (downloadError) {
      console.error('Failed to download image, using temporary URL:', downloadError);
      // Fallback to temporary URL if download fails
      localImageUrl = tempImageUrl;
    }

    return { imageUrl: localImageUrl };
  } catch (error) {
    console.error('OpenAI DALL-E error:', error);
    return {
      imageUrl: placeholderImage(name ?? imagePrompt.slice(0, 40)),
      warning: `OpenAI DALL-E generation failed: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

/**
 * Generate image using fal.ai API
 */
async function generateWithFal(
  imagePrompt: string,
  name?: string
): Promise<{ imageUrl: string; warning?: string }> {
  try {
    const apiKey = process.env.FAL_API_KEY;
    if (!apiKey) {
      return {
        imageUrl: placeholderImage(name ?? imagePrompt.slice(0, 40)),
        warning: "fal.ai API key not configured; using placeholder",
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const response = await fetch('https://fal.run/fal-ai/flux/dev', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: imagePrompt,
        image_size: 'landscape_4_3',
        num_inference_steps: 28,
        num_images: 1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`fal.ai API error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.images?.[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL in fal.ai response');
    }

    return { imageUrl };
  } catch (error) {
    console.error('fal.ai error:', error);
    return {
      imageUrl: placeholderImage(name ?? imagePrompt.slice(0, 40)),
      warning: `fal.ai generation failed: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

/**
 * Generate image using Stability AI API
 */
async function generateWithStability(
  imagePrompt: string,
  name?: string
): Promise<{ imageUrl: string; warning?: string }> {
  try {
    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      return {
        imageUrl: placeholderImage(name ?? imagePrompt.slice(0, 40)),
        warning: "Stability AI API key not configured; using placeholder",
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text_prompts: [{ text: imagePrompt }],
          cfg_scale: 7,
          height: 640,
          width: 896,
          steps: 30,
          samples: 1,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Stability AI API error: ${response.status}`);
    }

    const data = await response.json();
    const base64 = data.artifacts?.[0]?.base64;

    if (!base64) {
      throw new Error('No image data in Stability AI response');
    }

    // Return data URL (or upload to storage in production)
    return { imageUrl: `data:image/png;base64,${base64}` };
  } catch (error) {
    console.error('Stability AI error:', error);
    return {
      imageUrl: placeholderImage(name ?? imagePrompt.slice(0, 40)),
      warning: `Stability AI generation failed: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

/**
 * Generate image using Replicate API
 */
async function generateWithReplicate(
  imagePrompt: string,
  name?: string
): Promise<{ imageUrl: string; warning?: string }> {
  try {
    const apiKey = process.env.REPLICATE_API_TOKEN;
    if (!apiKey) {
      return {
        imageUrl: placeholderImage(name ?? imagePrompt.slice(0, 40)),
        warning: "Replicate API token not configured; using placeholder",
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    // Start prediction
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'black-forest-labs/flux-schnell',
        input: {
          prompt: imagePrompt,
          num_outputs: 1,
        },
      }),
      signal: controller.signal,
    });

    if (!createResponse.ok) {
      throw new Error(`Replicate API error: ${createResponse.status}`);
    }

    const prediction = await createResponse.json();
    const predictionId = prediction.id;

    // Poll for completion
    let result = prediction;
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${apiKey}`,
          },
          signal: controller.signal,
        }
      );

      result = await pollResponse.json();

      if (result.status === 'succeeded') {
        break;
      }

      if (result.status === 'failed') {
        throw new Error('Replicate prediction failed');
      }
    }

    clearTimeout(timeout);

    const imageUrl = result.output?.[0];
    if (!imageUrl) {
      throw new Error('No image URL in Replicate response');
    }

    return { imageUrl };
  } catch (error) {
    console.error('Replicate error:', error);
    return {
      imageUrl: placeholderImage(name ?? imagePrompt.slice(0, 40)),
      warning: `Replicate generation failed: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

/**
 * Create image using configured provider
 * Never throws - always returns a result (fallback to placeholder)
 */
export async function createImage(
  imagePrompt: string,
  name?: string,
  petId?: string
): Promise<{ imageUrl: string; warning?: string }> {
  const provider = (process.env.IMAGE_PROVIDER ?? 'none').toLowerCase();

  if (provider === 'none') {
    return {
      imageUrl: placeholderImage(name ?? imagePrompt.slice(0, 40)),
    };
  }

  try {
    switch (provider) {
      case 'openai':
        return await generateWithOpenAI(imagePrompt, name, petId);

      case 'fal':
        return await generateWithFal(imagePrompt, name);

      case 'stability':
        return await generateWithStability(imagePrompt, name);

      case 'replicate':
        return await generateWithReplicate(imagePrompt, name);

      default:
        return {
          imageUrl: placeholderImage(name ?? imagePrompt.slice(0, 40)),
          warning: `image provider '${provider}' not supported; using placeholder`,
        };
    }
  } catch (error) {
    // Catch any unexpected errors
    console.error('Image generation error:', error);
    return {
      imageUrl: placeholderImage(name ?? imagePrompt.slice(0, 40)),
      warning: `unexpected error: ${error instanceof Error ? error.message : 'unknown'}`,
    };
  }
}
