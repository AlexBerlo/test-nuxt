import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// The main story container
export const stories = sqliteTable('stories', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(), // Creator's ID
  title: text('title', { length: 50 }).notNull(),
  description: text('description', { length: 255 }),
  startSceneId: text('start_scene_id'), // Foreign key to scenes table
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// Individual nodes in the story graph
export const scenes = sqliteTable('scenes', {
  id: text('id').primaryKey(),
  storyId: text('story_id').notNull().references(() => stories.id),
  imageUrl: text('image_url'),
  text: text('text'),
  // Storing position for the visual editor
  position: text('position', { mode: 'json' }).$type<{ x: number; y: number }>()
});

// The edges/links that represent the progression options
export const sceneTransitions = sqliteTable('scene_transitions', {
  id: text('id').primaryKey(),
  storyId: text('story_id').notNull().references(() => stories.id),
  sourceSceneId: text('source_scene_id').notNull().references(() => scenes.id),
  targetSceneId: text('target_scene_id').notNull().references(() => scenes.id),
  optionText: text('option_text').notNull()
});

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(), // GitHub Id
  title: text('title').notNull(),
  completed: integer('completed').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});
