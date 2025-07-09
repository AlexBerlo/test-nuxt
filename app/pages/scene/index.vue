<script setup lang="ts">
import GenerateImageForm from '~/components/generate-image-form.vue';

const generatedImageUrl = ref('');

const handleImageGenerated = (imageUrl: string) => {
  generatedImageUrl.value = imageUrl;
};

const goToAddProgression = () => {
  if (generatedImageUrl.value) {
    useRouter().push({
      path: '/scene/hotspots',
      query: { imageUrl: generatedImageUrl.value }
    });
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-4">
      <UButton
        to="/"
        icon="i-heroicons-arrow-left"
        variant="ghost"
      />
    </div>
    <h1 class="text-2xl font-bold mb-6">
      Create Scene
    </h1>
    <GenerateImageForm @image-generated="handleImageGenerated" />
    <div
      v-if="generatedImageUrl"
      class="mt-4"
    >
      <UButton
        label="Add progression options"
        color="primary"
        @click="goToAddProgression"
      />
    </div>
  </div>
</template>
