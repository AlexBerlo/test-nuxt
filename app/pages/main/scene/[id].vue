<script setup lang="ts">
import type { ImageHotspot } from '../../../../types/image';
import type { UploadResponse, DetectionResponse, Scene, ProgressionOption } from '../../../../types/api';

const route = useRoute();
const sceneId = route.params.id as string;

interface SceneState {
  imageUrl: string | null;
  hotspots: ImageHotspot[];
  selectedHotspot: ImageHotspot | null;
  progressionOptions: Record<string, ProgressionOption[]>;
  isProcessing: boolean;
  error: string | null;
  isSaving: boolean;
}

const state = ref<SceneState>({
  imageUrl: null,
  hotspots: [],
  selectedHotspot: null,
  isProcessing: false,
  error: null,
  progressionOptions: {},
  isSaving: false
});

const saveScene = async () => {
  if (!state.value.imageUrl) return;

  try {
    state.value.isSaving = true;
    state.value.error = null;

    const sceneData: Scene = {
      id: sceneId,
      imageUrl: state.value.imageUrl,
      hotspots: state.value.hotspots,
      progressionOptions: state.value.progressionOptions
    };

    await $fetch(`/api/scenes/${sceneId}`, {
      method: 'PUT',
      body: sceneData
    });

    navigateTo('/main/new');
  }
  catch (error) {
    state.value.error = error instanceof Error ? error.message : 'Failed to save scene';
  }
  finally {
    state.value.isSaving = false;
  }
};

const addProgressionOption = (hotspotId: string) => {
  if (!state.value.progressionOptions[hotspotId]) {
    state.value.progressionOptions[hotspotId] = [];
  }

  state.value.progressionOptions[hotspotId].push({
    id: `option-${Date.now()}`,
    label: '',
    targetSceneId: null
  });
};

const removeProgressionOption = (hotspotId: string, optionId: string) => {
  if (state.value.progressionOptions[hotspotId]) {
    state.value.progressionOptions[hotspotId] = state.value.progressionOptions[hotspotId]
      .filter(option => option.id !== optionId);
  }
};

const updateProgressionOption = (
  hotspotId: string,
  optionId: string,
  updates: Partial<ProgressionOption>
) => {
  if (state.value.progressionOptions[hotspotId]) {
    const optionIndex = state.value.progressionOptions[hotspotId]
      .findIndex(option => option.id === optionId);

    if (optionIndex !== -1) {
      const currentOption = state.value.progressionOptions[hotspotId][optionIndex];
      if (currentOption) {
        state.value.progressionOptions[hotspotId][optionIndex] = {
          id: currentOption.id,
          label: updates.label ?? currentOption.label,
          targetSceneId: updates.targetSceneId ?? currentOption.targetSceneId
        };
      }
    }
  }
};

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    state.value.isProcessing = true;
    state.value.error = null;

    // Upload image
    const uploadResponse = await $fetch<UploadResponse>('/api/upload-image', {
      method: 'POST',
      body: formData
    });

    state.value.imageUrl = uploadResponse.url;

    // Detect objects using SAM
    const detectionResponse = await $fetch<DetectionResponse>('/api/detect-objects-sam', {
      method: 'POST',
      body: { imageUrl: uploadResponse.url }
    });

    state.value.hotspots = detectionResponse.hotspots;
  }
  catch (error) {
    state.value.error = error instanceof Error ? error.message : 'Failed to process image';
  }
  finally {
    state.value.isProcessing = false;
  }
};

const onHotspotSelect = (hotspot: ImageHotspot) => {
  state.value.selectedHotspot = hotspot;
};
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="mb-8">
      <h1 class="text-2xl font-bold mb-4">
        Configure Scene
      </h1>

      <!-- Image Upload -->
      <div
        v-if="!state.imageUrl"
        class="mb-4"
      >
        <UButton
          class="relative overflow-hidden"
          color="primary"
          :loading="state.isProcessing"
        >
          <input
            type="file"
            accept="image/*"
            class="absolute inset-0 opacity-0 cursor-pointer"
            @change="handleImageUpload"
          >
          Upload Image
        </UButton>
      </div>

      <!-- Error Message -->
      <p
        v-if="state.error"
        class="text-red-500 mb-4"
      >
        {{ state.error }}
      </p>

      <!-- Image with Hotspots -->
      <div
        v-if="state.imageUrl"
        class="mb-4"
      >
        <ImageHotspots
          :image-url="state.imageUrl"
          :hotspots="state.hotspots"
          :is-selectable="true"
          :selected-hotspot="state.selectedHotspot"
          @select="onHotspotSelect"
        />
      </div>

      <!-- Selected Hotspot Options -->
      <div
        v-if="state.selectedHotspot"
        class="mb-4 p-4 border rounded-lg"
      >
        <h3 class="text-lg font-semibold mb-4">
          Configure Hotspot Options
        </h3>

        <div class="space-y-4">
          <div
            v-for="option in state.progressionOptions[state.selectedHotspot.id] || []"
            :key="option.id"
            class="flex items-start gap-4 p-4 border rounded"
          >
            <div class="flex-grow">
              <UFormGroup label="Option Label">
                <UInput
                  v-model="option.label"
                  placeholder="Enter option text"
                  @input="updateProgressionOption(state.selectedHotspot.id, option.id, { label: option.label })"
                />
              </UFormGroup>
            </div>
            <UButton
              color="error"
              variant="soft"
              icon="i-heroicons-trash"
              @click="removeProgressionOption(state.selectedHotspot.id, option.id)"
            />
          </div>

          <UButton
            color="primary"
            variant="soft"
            class="w-full"
            @click="addProgressionOption(state.selectedHotspot.id)"
          >
            Add Option
          </UButton>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <UButton
          color="primary"
          :loading="state.isSaving"
          :disabled="!state.imageUrl"
          @click="saveScene"
        >
          Save Scene
        </UButton>
      </div>
    </div>
  </div>
</template>
