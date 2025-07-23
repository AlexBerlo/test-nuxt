import { and, eq } from 'drizzle-orm';
import { useValidatedParams, z } from 'h3-zod';
import type { User } from '#auth-utils';

export default eventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: z.string()
  });
  const { user } = (await requireUserSession(event)) as { user: User };

  try {
    const deletedStory = await useDB().batch([
      useDB().delete(tables.sceneTransitions).where(eq(tables.sceneTransitions.storyId, id)),
      useDB().delete(tables.scenes).where(eq(tables.scenes.storyId, id)),
      useDB().delete(tables.stories).where(and(
        eq(tables.stories.id, id),
        eq(tables.stories.userId, String(user.id))
      ))
    ]);
    return deletedStory;
  }
  catch (e) {
    console.log(e);
    throw createError({
      statusCode: 500,
      message: 'Error deleting story'
    });
  }
});
