// /server/api/upload-image.post.ts
import { readFiles } from 'h3-formidable';

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event);
    const form = await readFormData(event);
    const image = form.get('image') as File;

    const name = `${new Date('2050-01-01').getTime() - Date.now()}`;

    const result = await hubBlob().put(`${name}.webp`, image, {
      prefix: 'generated-image',
      addRandomSuffix: true,
      customMetadata: {
        userId: user.id.toString(),
      },
    });

    return {
      success: true,
      filePath: result.pathname,
      metaData: result.customMetadata,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw createError({
      statusCode: (error as any).statusCode || 500,
      message: (error as any).message || 'An error occurred while uploading the image',
    });
  }
});
