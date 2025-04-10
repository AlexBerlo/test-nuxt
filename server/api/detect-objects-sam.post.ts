import Replicate from 'replicate';

interface SAMPrediction {
  masks: string[];
  bounds: Array<{
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  }>;
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { replicateToken } = useRuntimeConfig();

  const replicate = new Replicate({
    auth: user.id === 2766042 || user.id === 153495995 ? replicateToken : ''
  });

  try {
    const body = await readBody(event);
    const { imageUrl } = body;

    console.log(imageUrl);

    if (!imageUrl) {
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
          mask_prompt: 'hat',
          adjustment_factor: -15,
          negative_mask_prompt: ''
        }
      }
    ) as unknown as SAMPrediction;
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
