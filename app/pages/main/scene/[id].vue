<script setup lang="ts">
import GenerateImageForm from '~/components/generate-image-form.vue';
import SceneHotspotsEditor from '~/components/scene-hotspots-editor.vue';

type View = 'image-generation' | 'hotspots-editor';

const route = useRoute();
const sceneId = route.params.id as string;
const storyId = route.query.storyId as string;
const isNewScene = sceneId === 'new';
const generatedImageUrl = ref('');
const currentView = ref<View>('image-generation');

const handleImageGenerated = (imageUrl: string) => {
  generatedImageUrl.value = imageUrl;
};

async function saveScene() {
  if (!generatedImageUrl.value) {
    return;
  }

  if (isNewScene) {
    const scene = await $fetch('/api/scenes', {
      method: 'POST',
      body: {
        storyId,
        imageUrl: generatedImageUrl.value
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

const switchToHotspotsEditor = () => {
  currentView.value = 'hotspots-editor';
};

const switchToImageGeneration = () => {
  currentView.value = 'image-generation';
};
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
      Configure Scene
    </h1>

    <div class="flex justify-end space-x-2 mb-4">
      <UButton
        v-if="generatedImageUrl"
        label="Edit Hotspots"
        :variant="currentView === 'hotspots-editor' ? 'solid' : 'outline'"
        @click="switchToHotspotsEditor"
      />
      <UButton
        label="Edit Image"
        :variant="currentView === 'image-generation' ? 'solid' : 'outline'"
        @click="switchToImageGeneration"
      />
      <UButton
        v-if="generatedImageUrl"
        label="Save Scene"
        color="primary"
        @click="saveScene"
      />
    </div>

    <GenerateImageForm
      v-if="currentView === 'image-generation'"
      :initial-image-url="generatedImageUrl"
      @image-generated="handleImageGenerated"
    />
    <SceneHotspotsEditor
      v-else-if="currentView === 'hotspots-editor' && generatedImageUrl"
      :image-url="generatedImageUrl"
      :scene-id="sceneId"
    />
  </div>
</template>
