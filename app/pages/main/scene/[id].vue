<script setup lang="ts">
import GenerateImageForm from '~/components/generate-image-form.vue';
import SceneHotspotsEditor from '~/components/scene-hotspots-editor.vue';
import ScenePreviewer from '~/components/scene-previewer.vue';

const route = useRoute();
const sceneId = route.params.id as string;
const storyId = route.query.storyId as string;
const isNewScene = sceneId === 'new';
const generatedImageUrl = ref('');
const detectedMaskUrl = ref<string | undefined>(undefined);

const generateImageFormRef = ref();

const handleImageGenerated = (imageUrl: string) => {
  generatedImageUrl.value = imageUrl;
  // Reset mask when new image is generated
  detectedMaskUrl.value = undefined;
};

const handleMaskDetected = (maskUrl: string) => {
  detectedMaskUrl.value = maskUrl;
};

const regenerateImage = () => {
  // Trigger regeneration by calling the generate function in the child component
  if (generateImageFormRef.value?.regenerateImage) {
    generateImageFormRef.value.regenerateImage();
  }
};

async function saveScene() {
  if (!generatedImageUrl.value) {
    return;
  }

  if (isNewScene) {
    // Get the stored position from sessionStorage
    const storedPosition = sessionStorage.getItem('newNodePosition');
    let position = null;
    if (storedPosition) {
      try {
        position = JSON.parse(storedPosition);
        // Clear the stored position after use
        sessionStorage.removeItem('newNodePosition');
      }
      catch (e) {
        console.warn('Failed to parse stored position:', e);
      }
    }

    const scene = await $fetch('/api/scenes', {
      method: 'POST',
      body: {
        storyId,
        imageUrl: generatedImageUrl.value,
        position
      }
    });
    if (scene) {
      navigateTo(`/main/${storyId}`);
    }
  }
  else {
    // TODO: Implement update logic for existing scenes
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-4">
      <UButton
        to="/main/new"
        icon="i-heroicons-arrow-left"
        variant="ghost"
      />
    </div>
    <h1 class="text-2xl font-bold mb-6">
      Create New Scene
    </h1>
    <p class="text-gray-600 mb-8">
      Build your story scene step by step
    </p>

    <div class="flex justify-end mb-4">
      <UButton
        v-if="generatedImageUrl"
        label="Save Scene"
        color="primary"
        @click="saveScene"
      />
    </div>

    <!-- Step 1: Image Generation -->
    <div class="mb-8">
      <div class="flex items-center mb-4">
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-sm mr-3">
          1
        </div>
        <h2 class="text-xl font-semibold">
          Image Generation
        </h2>
      </div>

      <GenerateImageForm
        ref="generateImageFormRef"
        :initial-image-url="generatedImageUrl"
        @image-generated="handleImageGenerated"
      />
    </div>

    <!-- Generated Image Display -->
    <div
      v-if="generatedImageUrl"
      class="mb-8"
    >
      <h3 class="text-lg font-semibold mb-4">
        Generated Image
      </h3>
      <ScenePreviewer
        :image-url="generatedImageUrl"
        :mask-url="detectedMaskUrl"
        :show-actions="true"
        @regenerate="regenerateImage"
        @use-image="() => {}"
      />
    </div>

    <!-- Step 2: Add Progression Options -->
    <div v-if="generatedImageUrl">
      <div class="flex items-center mb-4">
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-sm mr-3">
          2
        </div>
        <h2 class="text-xl font-semibold">
          Add Progressions
        </h2>
      </div>

      <SceneHotspotsEditor
        :image-url="generatedImageUrl"
        :scene-id="sceneId"
        @mask-detected="handleMaskDetected"
      />
    </div>
  </div>
</template>
