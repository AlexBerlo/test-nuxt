import Replicate from 'replicate';

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event);
    const body = await readBody(event);
    const { prompt } = body;
    const { replicateToken } = useRuntimeConfig();

    if (!prompt) {
      throw createError({
        statusCode: 400,
        message: 'Prompt is required',
      });
    }

    const replicate = new Replicate({
      auth: user.id === 2766042 ? replicateToken : '',
    });

    // const input = {
    //   prompt,
    //   prompt_upsampling: true,
    //   safety_tolerance: 5,
    // };

    const input = {
      prompt,
      go_fast: true,
      megapixels: '1',
      num_outputs: 1,
      aspect_ratio: '1:1',
      output_format: 'webp',
      output_quality: 80,
      num_inference_steps: 4,
      disableSafetyChecker: true,
    };

    // const output = await replicate.run('black-forest-labs/flux-1.1-pro', { input });
    const output = await replicate.run('black-forest-labs/flux-schnell', { input });

    if (!output || !(output as any).length) {
      throw createError({
        statusCode: 500,
        message: 'Failed to generate image',
      });
    }

    // Assuming the first item in the output array is the image URL
    const imageUrl = output;

    return { imageUrl };
  } catch (error) {
    console.error('Error generating image:', error);
    throw createError({
      statusCode: (error as any).statusCode || 500,
      message: (error as any).message || 'An error occurred while generating the image',
    });
  }
});
