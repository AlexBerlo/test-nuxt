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

  const story = await useDB()
    .select()
    .from(tables.stories)
    .where(eq(tables.stories.id, storyId))
    .get();

  if (story?.userId !== String(user.id)) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden'
    });
  }

  // also fetch scenes and transitions
  const scenes = await useDB()
    .select()
    .from(tables.scenes)
    .where(eq(tables.scenes.storyId, storyId))
    .all();

  const transitions = await useDB()
    .select()
    .from(tables.sceneTransitions)
    .where(eq(tables.sceneTransitions.storyId, storyId))
    .all();

  return {
    ...story,
    scenes,
    transitions
  };
});
