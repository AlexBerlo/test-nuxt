<script setup lang="ts">
const props = defineProps<{
  imageUrl: string;
}>();

const emit = defineEmits<{
  'mask-detected': [maskUrl: string];
}>();

const maskPrompt = ref('');
const detectedImages = ref<string[]>([]);
const detectionLoading = ref(false);

const detectObjectsInImage = async () => {
  if (props.imageUrl) {
    try {
      detectionLoading.value = true;
      const detectResponse = await $fetch<string[]>('/api/detect-objects-sam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { imageUrl: props.imageUrl, maskPrompt: maskPrompt.value }
      });

      detectedImages.value = detectResponse;

      // Emit the mask URL to the parent when detected
      if (detectResponse.length > 0 && detectResponse[2]) {
        emit('mask-detected', detectResponse[2]);
      }
    }
    catch (err) {
      console.error('Error detecting objects:', err);
    }
    finally {
      detectionLoading.value = false;
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
      <UProgress
        v-if="!detectedImages.length && detectionLoading"
        animation="carousel"
      />
      <div
        v-if="detectedImages.length && detectedImages[2]"
        class="mt-4 p-4 bg-green-50 rounded-lg text-center text-green-700"
      >
        <p>✓ Objects detected! Hotspots are now available in the image preview above.</p>
      </div>
      <div
        v-else-if="maskPrompt"
        class="mt-4 p-4 bg-gray-50 rounded-lg text-center text-gray-600"
      >
        <p>Click "Detect objects" to identify interactive elements in your scene image.</p>
      </div>
    </UCard>
  </div>
</template>
