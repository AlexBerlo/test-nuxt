import { eq } from 'drizzle-orm';

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const storyId = getRouterParam(event, 'id');

  if (!storyId) {
    throw createError({
      statusCode: 400,
      message: 'Missing story ID'
    });
  }

  const body = await readBody(event);

  // Verify the story belongs to the user
  const story = await useDB()
    .select()
    .from(tables.stories)
    .where(eq(tables.stories.id, storyId))
    .get();

  if (!story) {
    throw createError({
      statusCode: 404,
      message: 'Story not found'
    });
  }

  if (story.userId !== String(user.id)) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden'
    });
  }

  // Update the story
  const updatedStory = await useDB()
    .update(tables.stories)
    .set({
      ...body,
      updatedAt: new Date()
    })
    .where(eq(tables.stories.id, storyId))
    .returning()
    .get();

  return updatedStory;
});
