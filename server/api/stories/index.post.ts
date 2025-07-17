import { useValidatedBody, z } from 'h3-zod';
import { nanoid } from 'nanoid';

export default eventHandler(async (event) => {
  const { title, description } = await useValidatedBody(event, {
    title: z.string().min(1).max(50),
    description: z.string().max(255).optional()
  });
  const { user } = await requireUserSession(event);

  const storyId = nanoid();

  // Insert story for the current user
  const [story] = await useDB()
    .insert(tables.stories)
    .values({
      id: storyId,
      userId: String(user.id),
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning();

  return story;
});
