import Replicate from 'replicate';

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event);
    const body = await readBody(event);
    const { prompt, imageUrl: image } = body;
    const { replicateToken } = useRuntimeConfig();

    if (!prompt) {
      throw createError({
        statusCode: 400,
        message: 'Prompt is required'
      });
    }

    const replicate = new Replicate({
      auth: user.id === 2766042 || user.id === 153495995 ? replicateToken : ''
    });

    // const input = {
    //   prompt,
    //   prompt_upsampling: true,
    //   safety_tolerance: 5,
    // };

    let model: `${string}/${string}` | `${string}/${string}:${string}`;
    let input: Record<string, unknown>;

    if (image) {
      model = 'black-forest-labs/flux-kontext-pro';
      input = {
        prompt,
        input_image: image,
        output_format: 'jpg'
      };
    }
    else {
      model = 'black-forest-labs/flux-dev-lora';
      input = {
        prompt,
        go_fast: true,
        megapixels: '1',
        num_outputs: 1,
        aspect_ratio: '1:1',
        output_format: 'webp',
        output_quality: 80,
        disableSafetyChecker: true,
        lora_scale: 1,
        lora_weights: 'fofr/flux-80s-cyberpunk'
      };
    }

    const output = await replicate.run(model, { input });
    // const output = await replicate.run('black-forest-labs/flux-1.1-pro', { input });

    if (!output) {
      throw createError({
        statusCode: 500,
        message: 'Failed to generate image'
      });
    }

    // Assuming the first item in the output array is the image URL
    const imageUrl = output;

    return { imageUrl };
  }
  catch (error) {
    console.error('Error generating image:', error);
    throw createError({
      statusCode: 500,
      message: 'An error occurred while generating the image'
    });
  }
});
