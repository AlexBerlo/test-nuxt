export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event);
    const form = await readFormData(event);
    const image = form.get('image') as File;

    const name = `${new Date('2050-01-01').getTime() - Date.now()}`;

    const result = await hubBlob().put(`${name}.webp`, image, {
      prefix: `generated-image_${user.id}`,
      addRandomSuffix: true,
      customMetadata: {
        userId: user.id.toString()
      }
    });

    return {
      success: true,
      filePath: result.pathname,
      metaData: result.customMetadata
    };
  }
  catch (error) {
    console.error('Error uploading image:', error);
  }
});
