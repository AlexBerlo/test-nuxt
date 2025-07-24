<script setup lang="ts">
import GenerateImageForm from '~/components/generate-image-form.vue';
import SceneHotspotsEditor from '~/components/scene-hotspots-editor.vue';
import ScenePreviewer from '~/components/scene-previewer.vue';
import TextProgressionEditor from '~/components/text-progression-editor.vue';

const route = useRoute();
const sceneId = route.params.id as string;
const storyId = route.query.storyId as string;
const sceneCount = parseInt(route.query.scCnt as string);
const isNewScene = sceneId === 'new';
const generatedImageUrl = ref('');
const detectedMaskUrl = ref<string | undefined>(undefined);
const progressionOptions = ref<string[]>([]);

const progressionsHeader = useTemplateRef('progressionsHeader');

const handleImageGenerated = async (imageUrl: string) => {
  generatedImageUrl.value = imageUrl;
  // Reset mask when new image is generated
  console.log(progressionsHeader.value);
  // progressionsHeader.value?.scrollIntoView({ behavior: 'smooth' });
  await nextTick();
  setTimeout(() => {
    progressionsHeader.value?.scrollIntoView({ behavior: 'smooth' });
  }, 200);
  detectedMaskUrl.value = undefined;
};

const handleMaskDetected = (maskUrl: string) => {
  detectedMaskUrl.value = maskUrl;
};

const handleAddProgression = (text: string) => {
  if (progressionOptions.value.length < 5) {
    progressionOptions.value.push(text);
  }
};

const handleUpdateProgression = (index: number, text: string) => {
  if (progressionOptions.value[index] !== undefined) {
    progressionOptions.value[index] = text;
  }
};

const handleReorderProgressions = (newOrder: string[]) => {
  progressionOptions.value = newOrder;
};

const saveImage = async () => {
  if (generatedImageUrl.value) {
    const response = await fetch(generatedImageUrl.value);
    if (!response.ok)
      throw new Error('Network response was not ok');

    const imageBlob = await response.blob();

    const formData = new FormData();
    formData.append('image', new File([imageBlob], `scene.jpg`, { type: 'image/jpeg' }));

    const result = await $fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });

    if (result && result.filePath) {
      return `/images/${result.filePath}`;
    }
  }
  return null;
};

const saveScene = async () => {
  const finalImageUrl = await saveImage();
  if (!finalImageUrl) {
    // Handle image saving error
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

    const body: { storyId: string; imageUrl: string; position?: { x: number; y: number } | null; progressionOptions?: string[] } = {
      storyId,
      imageUrl: finalImageUrl,
      progressionOptions: progressionOptions.value
    };

    if (position) {
      body.position = position;
    }

    const scene = await $fetch('/api/scenes', {
      method: 'POST',
      body
    });

    if (scene) {
      navigateTo(`/story/${storyId}`);
    }
  }
  else {
    // TODO: Implement update logic for existing scenes
  }
};

watch(progressionsHeader, (newVal) => {
  if (newVal) {
    console.log('new val');
    // progressionsHeader.value?.scrollIntoView({ behavior: 'smooth' });
  }
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-4">
      <UButton
        :to="sceneCount > 0 ?`/story/${storyId}` : '/story'"
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
        :disabled="!generatedImageUrl"
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
        :progression-options="progressionOptions"
        @regenerate="() => {}"
        @use-image="() => {}"
        @save-image="saveImage"
        @update-progression="handleUpdateProgression"
        @reorder-progressions="handleReorderProgressions"
      />
    </div>

    <!-- Step 2: Add Progression Options -->
    <div v-if="generatedImageUrl">
      <div
        ref="progressionsHeader"
        class="flex items-center mb-4"
      >
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-sm mr-3">
          2
        </div>
        <h2 class="text-xl font-semibold">
          Add Progressions
        </h2>
      </div>

      <div class="mb-4">
        <TextProgressionEditor
          :disabled="progressionOptions.length >= 5"
          @add-progression="handleAddProgression"
        />
      </div>

      <SceneHotspotsEditor
        :image-url="generatedImageUrl"
        :scene-id="sceneId"
        @mask-detected="handleMaskDetected"
      />
    </div>
  </div>
</template>
