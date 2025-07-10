import { useValidatedBody, z } from 'h3-zod';
import { nanoid } from 'nanoid';

export default eventHandler(async (event) => {
  const { title } = await useValidatedBody(event, {
    title: z.string().min(1).max(100)
  });
  const { user } = await requireUserSession(event);

  const storyId = nanoid();
  const startSceneId = nanoid();

  // Insert story for the current user
  const story = await useDB()
    .insert(tables.stories)
    .values({
      id: storyId,
      userId: String(user.id),
      title,
      startSceneId,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning()
    .get();

  return story;
});
