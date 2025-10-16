// Utility to download images and save them locally
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

/**
 * Download an image from a URL and save it locally
 * @param imageUrl - The URL of the image to download
 * @param filename - The filename to save as (e.g., 'pet-1.png')
 * @returns The local path to the saved image (e.g., '/images/pets/pet-1.png')
 */
export async function downloadAndSaveImage(
  imageUrl: string,
  filename: string
): Promise<string> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }

    // Get the image as array buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine the save path (relative to project root)
    const savePath = resolve(
      import.meta.dir,
      '../../web/public/images/pets',
      filename
    );

    // Save the file
    await writeFile(savePath, buffer);

    // Return the public URL path (served by static middleware)
    return `/images/pets/${filename}`;
  } catch (error) {
    console.error(`Error downloading image ${filename}:`, error);
    throw error;
  }
}

/**
 * Generate a filename for a pet image
 * @param petId - The pet ID (e.g., 'pet-1')
 * @param extension - The file extension (default: 'png')
 * @returns Filename like 'pet-1.png'
 */
export function generateImageFilename(petId: string, extension: string = 'png'): string {
  return `${petId}.${extension}`;
}
