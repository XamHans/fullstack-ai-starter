import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import {
  withAuthentication,
  parseRequestBody,
  validateRequiredFields,
} from '@/lib/api/base';

export const POST = withAuthentication(async (_session, req, _params, logger) => {
  logger?.info('Generate image request received');
  const body = await parseRequestBody<{
    prompt: string;
  }>(req);

  validateRequiredFields(body, ['prompt']);

  try {
    const result = await generateText({
      model: google('gemini-2.5-flash-image-preview'),
      prompt: body.prompt,
    });

    // Debug logging to see actual response structure
    logger?.info('Gemini result structure:', {
      hasFiles: !!result.files,
      filesLength: result.files?.length || 0,
      text: result.text,
      keys: Object.keys(result)
    });

    if (result.files) {
      logger?.info('Files details:', result.files.map((file, i) => ({
        index: i,
        mediaType: file.mediaType,
        hasUint8Array: !!file.uint8Array,
        uint8ArrayLength: file.uint8Array?.length || 0
      })));
    }

    // Find the first image file
    let imageUrl: string | null = null;

    if (result.files) {
      const imageFile = result.files.find(file => file.mediaType.startsWith('image/'));
      if (imageFile) {
        // Convert Uint8Array to base64 data URL
        const base64 = Buffer.from(imageFile.uint8Array).toString('base64');
        imageUrl = `data:${imageFile.mediaType};base64,${base64}`;

        logger?.info('Successfully created image URL:', {
          mediaType: imageFile.mediaType,
          base64Length: base64.length,
          dataUrlLength: imageUrl.length
        });
      }
    }

    if (!imageUrl) {
      logger?.error('No image generated or found in response');
      throw new Error('No image was generated');
    }

    logger?.info('Image generated successfully');

    return {
      imageUrl,
      success: true
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger?.error(`Failed to generate image: ${errorMessage}`);
    throw new Error('Failed to generate image. Please try again.');
  }
});