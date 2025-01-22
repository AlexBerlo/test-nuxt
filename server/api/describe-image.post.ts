import fs from 'node:fs';
import { readFiles } from 'h3-formidable';
// /server/api/describe-image.post.ts
import Replicate from 'replicate';

export default defineEventHandler(async (event) => {
  try {
    // Parse the multipart form data
    const { user } = await requireUserSession(event);
    const { replicateToken } = useRuntimeConfig();
    const { fields, files } = await readFiles(event);

    // Check if an image file was uploaded
    if (!files.image || files.image.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No image file uploaded',
      });
    }

    const imageFile = files.image[0];
    const imagePath = imageFile.filepath;

    // Get the prompt from the form data
    const prompt = fields.prompt?.[0] || 'Describe this image in detail.Focus on the characters, objects, and actions.';

    const replicate = new Replicate({
      auth: user.id === 2766042 || user.id === 153495995 ? replicateToken : '',
    });

    // Read the image file as a base64 string
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const input = {
      image: `data:${imageFile.mimetype};base64,${base64Image}`,
      prompt,
    };

    let fullResponse = '';
    for await (const event of replicate.stream('yorickvp/llava-13b:80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb', {
      input,
    })) {
      fullResponse += event;
    }

    if (!fullResponse) {
      throw createError({
        statusCode: 500,
        message: 'Failed to generate image description',
      });
    }

    // Clean up: delete the temporary uploaded file
    fs.unlinkSync(imagePath);

    return { description: fullResponse.trim() };
  }
  catch (error) {
    console.error('Error describing image:', error);
    throw createError({
      statusCode: (error as any).statusCode || 500,
      message: (error as any).message || 'An error occurred while describing the image',
    });
  }
});
