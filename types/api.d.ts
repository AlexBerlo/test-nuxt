export interface Scene {
  id: string;
  storyId: string;
  imageUrl: string | null;
  text: string | null;
  position: { x: number; y: number } | null;
}

export interface SceneTransition {
  id: string;
  storyId: string;
  sourceSceneId: string;
  targetSceneId: string;
  optionText: string;
}

export interface Story {
  id: string;
  userId: string;
  title: string;
  startSceneId: string;
  createdAt: string;
  updatedAt: string;
  scenes: Scene[];
  description: string;
  transitions: SceneTransition[];
}

export interface UploadResponse {
  success: boolean;
  url: string;
  filePath: string;
  metaData: Record<string, string>;
}
