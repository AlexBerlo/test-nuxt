import Replicate from 'replicate';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { replicateToken } = useRuntimeConfig();

  const replicate = new Replicate({
    auth: user.id === 2766042 || user.id === 153495995 ? replicateToken : ''
  });

  try {
    const body = await readBody(event);
    console.log(body);
    const { imageUrl, maskPrompt } = body;

    console.log(imageUrl);
    console.log('imageUrl');
    console.log('imageUrl');
    console.log('imageUrl');

    if (!imageUrl && imageUrl.length) {
      throw createError({
        statusCode: 400,
        message: 'Image URL is required'
      });
    }

    // Call SAM model on Replicate
    const prediction = await replicate.run(
      'schananas/grounded_sam:ee871c19efb1941f55f66a3d7d960428c8a5afcb77449547fe8e5a3ab9ebc21c',
      {
        input: {
          image: imageUrl,
          mask_prompt: maskPrompt,
          adjustment_factor: -15,
          negative_mask_prompt: ''
        }
      }
    ) as unknown as string[];
    console.log(prediction);

    // const hotspots: ImageHotspot[] = prediction.masks.map((mask: string, index: number) => ({
    //   id: `mask-${index}`,
    //   mask,
    //   bounds: prediction.bounds[index]
    // }));

    return prediction;
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to detect objects: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
});
