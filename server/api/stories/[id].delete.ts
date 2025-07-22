import { and, eq } from 'drizzle-orm';
import { useValidatedParams, z } from 'h3-zod';
import type { User } from '#auth-utils';

export default eventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: z.string()
  });
  const { user } = (await requireUserSession(event)) as { user: User };

  let deletedStory = null;
  try {
    // First, delete all scene transitions associated with the story
    await useDB().delete(tables.sceneTransitions).where(eq(tables.sceneTransitions.storyId, id));

    // Next, delete all scenes associated with the story
    await useDB().delete(tables.scenes).where(eq(tables.scenes.storyId, id));

    // Finally, delete the story itself
    deletedStory = await useDB().delete(tables.stories).where(and(
      eq(tables.stories.id, id),
      eq(tables.stories.userId, String(user.id))
    )).returning().get();
  }
  catch (e) {
    console.log(e);
  }

  if (!deletedStory) {
    throw createError({
      statusCode: 404,
      message: 'Story not found'
    });
  }
  return deletedStory;
});
