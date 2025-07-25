import { useValidatedBody, z } from 'h3-zod';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

export default eventHandler(async (event) => {
  const { storyId, imageUrl, position, progressionOptions } = await useValidatedBody(event, {
    storyId: z.string(),
    imageUrl: z.string().optional(),
    position: z.object({
      x: z.number(),
      y: z.number()
    }).optional(),
    progressionOptions: z.array(z.string()).optional()
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

  try {
    const [scene] = await useDB()
      .insert(tables.scenes)
      .values({
        id: sceneId,
        storyId,
        imageUrl: imageUrl || null,
        position: position || { x: 250, y: 250 }
      })
      .returning();

    // Create scene transitions for progression options
    if (progressionOptions && progressionOptions.length > 0) {
      const transitionPromises = progressionOptions.map(optionText =>
        useDB()
          .insert(tables.sceneTransitions)
          .values({
            id: nanoid(),
            storyId,
            sourceSceneId: sceneId,
            targetSceneId: null, // Null for unconnected transitions
            optionText
          })
      );

      await Promise.all(transitionPromises);
    }

    if (scene && !story.startSceneId) {
      await useDB()
        .update(tables.stories)
        .set({ startSceneId: scene.id })
        .where(eq(tables.stories.id, storyId));
    }

    return scene;
  }
  catch (e) {
    console.log(e);
    throw createError({
      statusCode: 500,
      message: 'Error creating scene'
    });
  }
});
