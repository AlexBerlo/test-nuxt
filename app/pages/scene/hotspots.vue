<script setup lang="ts">
const route = useRoute();
const imageUrl = ref(route.query.imageUrl as string || '');
const maskPrompt = ref('');
const detectedImages = ref<string[]>([]);

const detectObjectsInImage = async () => {
  if (imageUrl.value) {
    try {
      const detectResponse = await $fetch('/api/detect-objects-sam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { imageUrl: imageUrl.value, maskPrompt: maskPrompt.value }
      });

      detectedImages.value = detectResponse;
      console.log('Detected objects:', detectResponse);
    }
    catch (error) {
      console.error('Error detecting objects:', error);
    }
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-4">
      <UButton
        to="/scene"
        icon="i-heroicons-arrow-left"
        variant="ghost"
      />
    </div>
    <h1 class="text-2xl font-bold mb-6">
      Add Progression Hotspots
    </h1>
    <UCard>
      <div class="flex items-center space-x-2 mb-4">
        <UButton
          label="Detect objects"
          color="primary"
          :disabled="!imageUrl && !maskPrompt"
          @click="detectObjectsInImage"
        />
        <UInput
          v-model="maskPrompt"
          :disabled="!imageUrl"
          placeholder="Enter object detection prompt"
          class="flex-grow"
        />
      </div>
      <div
        v-if="detectedImages.length && detectedImages[2]"
        class="mt-4"
      >
        <image-hotspots
          :image-url="imageUrl"
          :mask-url="detectedImages[2]"
        />
      </div>
      <div
        v-else-if="imageUrl"
        class="mt-4"
      >
        <img
          :src="imageUrl"
          alt="Generated Image"
          class="max-w-full h-auto"
        >
      </div>
    </UCard>
  </div>
</template>
