import { eq } from 'drizzle-orm';

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const sceneId = getRouterParam(event, 'id');

  if (!sceneId) {
    throw createError({
      statusCode: 400,
      message: 'Missing scene ID'
    });
  }

  // First check if the scene exists and belongs to the user
  const scene = await useDB()
    .select()
    .from(tables.scenes)
    .where(eq(tables.scenes.id, sceneId))
    .get();

  if (!scene) {
    throw createError({
      statusCode: 404,
      message: 'Scene not found'
    });
  }

  // Check if the user owns the story that contains this scene
  const story = await useDB()
    .select()
    .from(tables.stories)
    .where(eq(tables.stories.id, scene.storyId))
    .get();

  if (story?.userId !== String(user.id)) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden'
    });
  }

  // Delete all scene transitions that reference this scene (both source and target)
  await useDB()
    .delete(tables.sceneTransitions)
    .where(eq(tables.sceneTransitions.sourceSceneId, sceneId));

  await useDB()
    .delete(tables.sceneTransitions)
    .where(eq(tables.sceneTransitions.targetSceneId, sceneId));

  // If this scene is the start scene, clear it from the story
  if (story.startSceneId === sceneId) {
    await useDB()
      .update(tables.stories)
      .set({ startSceneId: null })
      .where(eq(tables.stories.id, scene.storyId));
  }

  // Finally delete the scene itself
  await useDB()
    .delete(tables.scenes)
    .where(eq(tables.scenes.id, sceneId));

  return { success: true };
});
