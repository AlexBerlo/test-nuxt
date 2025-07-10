import { eq } from 'drizzle-orm';

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const stories = await useDB()
    .select()
    .from(tables.stories)
    .where(eq(tables.stories.userId, String(user.id)))
    .all();

  return stories;
});
