<script setup lang="ts">
const props = defineProps<{
  imageUrl: string;
}>();

const maskPrompt = ref('');
const detectedImages = ref<string[]>([]);

const detectObjectsInImage = async () => {
  if (props.imageUrl) {
    try {
      const detectResponse = await $fetch<string[]>('/api/detect-objects-sam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { imageUrl: props.imageUrl, maskPrompt: maskPrompt.value }
      });

      detectedImages.value = detectResponse;
    }
    catch (err) {
      console.error('Error detecting objects:', err);
    }
  }
};
</script>

<template>
  <div>
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
