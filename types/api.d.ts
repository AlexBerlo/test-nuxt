import type { ImageHotspot } from './image';

export interface Scene {
  id: string;
  imageUrl: string;
  hotspots: ImageHotspot[];
  progressionOptions: Record<string, ProgressionOption[]>;
}

export interface ProgressionOption {
  id: string;
  label: string;
  targetSceneId: string | null;
}

export interface UploadResponse {
  success: boolean;
  url: string;
  filePath: string;
  metaData: Record<string, string>;
}

export interface DetectionResponse {
  hotspots: ImageHotspot[];
}
