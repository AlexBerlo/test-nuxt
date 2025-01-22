export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event);
    const { cursor } = await getQuery<{ cursor?: string }>(event);
    const pageSize = 10;

    const blob = hubBlob();
    const { blobs } = await blob.list({
      prefix: `generated-image_${user.id}`,
      limit: pageSize,
      cursor,
    });

    return {
      blobs,
    };
  }
  catch (error) {
    console.error('Error fetching images:', error);
    throw createError({
      statusCode: (error as any).statusCode || 500,
      message: (error as any).message || 'An error occurred while fetching images',
    });
  }
});
