import { useValidatedBody, z } from 'h3-zod';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

export default eventHandler(async (event) => {
  const { storyId, imageUrl, position } = await useValidatedBody(event, {
    storyId: z.string(),
    imageUrl: z.string().optional(),
    position: z.object({
      x: z.number(),
      y: z.number()
    }).optional()
  });
  const { user } = await requireUserSession(event);

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

  const sceneId = nanoid();

  const [scene] = await useDB()
    .insert(tables.scenes)
    .values({
      id: sceneId,
      storyId,
      imageUrl: imageUrl || null,
      position: position || { x: 250, y: 250 }
    })
    .returning();

  if (scene && !story.startSceneId) {
    await useDB()
      .update(tables.stories)
      .set({ startSceneId: scene.id })
      .where(eq(tables.stories.id, storyId));
  }

  return scene;
});
