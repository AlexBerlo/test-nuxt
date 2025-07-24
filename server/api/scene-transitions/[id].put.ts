import { useValidatedBody, z } from 'h3-zod';
import { eq } from 'drizzle-orm';

export default eventHandler(async (event) => {
  const transitionId = getRouterParam(event, 'id');
  const { targetSceneId } = await useValidatedBody(event, {
    targetSceneId: z.string()
  });

  if (!transitionId) {
    throw createError({
      statusCode: 400,
      message: 'Missing transition ID'
    });
  }

  try {
    const [updatedTransition] = await useDB()
      .update(tables.sceneTransitions)
      .set({ targetSceneId })
      .where(eq(tables.sceneTransitions.id, transitionId))
      .returning();

    if (!updatedTransition) {
      throw createError({
        statusCode: 404,
        message: 'Transition not found'
      });
    }

    return updatedTransition;
  }
  catch (e) {
    console.log(e);
    throw createError({
      statusCode: 500,
      message: 'Error updating transition'
    });
  }
});
