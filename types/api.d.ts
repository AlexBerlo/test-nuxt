import type { Story, Scene, SceneTransition } from '~~/server/utils/db';

export interface UploadResponse {
  success: boolean;
  url: string;
  filePath: string;
  metaData: Record<string, string>;
}

export interface StoryWithRelations extends Story {
  scenes: Scene[];
  transitions: SceneTransition[];
}
