<script setup lang="ts">
import GenerateImageForm from '~/components/generate-image-form.vue';
import SceneHotspotsEditor from '~/components/scene-hotspots-editor.vue';

type View = 'image-generation' | 'hotspots-editor';

const route = useRoute();
const sceneId = route.params.id as string;
const generatedImageUrl = ref('');
const currentView = ref<View>('image-generation');

const handleImageGenerated = (imageUrl: string) => {
  generatedImageUrl.value = imageUrl;
};

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
