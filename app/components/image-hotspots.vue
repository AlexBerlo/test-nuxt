<template>
  <div class="relative">
    <!-- Base image -->
    <img
      ref="imageRef"
      :src="imageUrl"
      :alt="alt"
      class="w-full h-auto"
      @load="onImageLoad"
    >

    <!-- Mask-based hotspot overlay -->
    <div
      v-if="imageLoaded"
      class="absolute top-0 left-0 w-full h-full pointer-events-none"
    >
      <!-- Hat mask hotspot -->
      <div class="hat-hotspot">
        <!-- Invisible hotspot area for hover detection -->
        <div
          v-if="processedMaskUrl"
          class="hat-hover-area"
          :style="{
            maskImage: `url(${processedMaskUrl})`,
            WebkitMaskImage: `url(${processedMaskUrl})`
          }"
          @mouseenter="isHoveringMask = true"
          @mouseleave="isHoveringMask = false"
        />

        <!-- Highlight overlay that appears on hover -->
        <div
          v-if="processedMaskUrl && isHoveringMask"
          class="hat-highlight"
          :style="{
            maskImage: `url(${processedMaskUrl})`,
            WebkitMaskImage: `url(${processedMaskUrl})`
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { ImageHotspot } from '../../types/image';

const processedMaskUrl = ref<string | null>(null);

const props = defineProps<{
  imageUrl: string;
  alt?: string;
  isSelectable?: boolean;
  maskUrl: string;
}>();

// Define emits for compatibility, but we're not using them in this implementation
defineEmits<{
  (e: 'select', hotspot: ImageHotspot): void;
}>();

const imageRef = ref<HTMLImageElement | null>(null);
const imageLoaded = ref(false);
const isHoveringMask = ref(false);

const onImageLoad = () => {
  if (imageRef.value) {
    imageLoaded.value = true;
  }
};

// Function to process the mask image
const processMask = async () => {
  try {
    // Process the mask image to create a transparent version
    processedMaskUrl.value = await createTransparentMask(props.maskUrl);
    console.log('Processed mask URL:', processedMaskUrl.value);
  }
  catch (error) {
    console.error('Error processing mask:', error);
  }
};

watch(() => props.maskUrl, async (newMaskUrl) => {
  if (newMaskUrl) {
    await processMask();
  }
}, { immediate: true });
</script>

<style scoped>
.hat-hotspot {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hat-hover-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  pointer-events: auto;
  background-color: rgba(255, 255, 255, 0.01); /* Very slight background to enable hover */
  mask-size: 100% 100%;
  -webkit-mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
}

.hat-highlight {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  transition: opacity 0.2s;
  pointer-events: none;
  mask-size: 100% 100%;
  -webkit-mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
}
</style>
