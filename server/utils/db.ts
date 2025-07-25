import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../database/schema';

export { and, eq, or, sql } from 'drizzle-orm';

export const tables = schema;

export const useDB = () => {
  return drizzle(hubDatabase(), { schema });
};

export type Story = typeof schema.stories.$inferSelect;
export type Scene = typeof schema.scenes.$inferSelect;
export type SceneTransition = typeof schema.sceneTransitions.$inferSelect;
