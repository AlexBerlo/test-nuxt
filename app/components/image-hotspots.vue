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
import { ref, onMounted } from 'vue';
import type { ImageHotspot } from '../../types/image';

// Original mask URL - white hat on black background
const originalMaskUrl = 'https://replicate.delivery/xezq/wG5Hq6x2oI5NP9GFaUiqX4cPbgFWvmMOwds4XDeF7LeBG0eoA/mask.jpg';
const processedMaskUrl = ref<string | null>(null);

// Keep original props for compatibility
defineProps<{
  imageUrl: string;
  hotspots: ImageHotspot[];
  alt?: string;
  isSelectable?: boolean;
  selectedHotspot?: ImageHotspot | null;
}>();

// Define emits for compatibility, but we're not using them in this implementation
defineEmits<{
  (e: 'select', hotspot: ImageHotspot): void;
}>();

const imageRef = ref<HTMLImageElement | null>(null);
const imageLoaded = ref(false);
const imageWidth = ref(0);
const imageHeight = ref(0);
const isHoveringMask = ref(false);

// Simple function to create a data URL with a transparent background
const createTransparentMask = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      // Create a canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Make black pixels transparent
      for (let i = 0; i < data.length; i += 4) {
        // Check if pixel is black or dark
        const isBlack = data[i]! < 50 && data[i + 1]! < 50 && data[i + 2]! < 50;

        // If black, make transparent
        if (isBlack) {
          data[i + 3] = 0; // Alpha channel
        }
      }

      // Put the modified data back
      ctx.putImageData(imageData, 0, 0);

      // Return as data URL
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

const onImageLoad = () => {
  if (imageRef.value) {
    imageWidth.value = imageRef.value.naturalWidth;
    imageHeight.value = imageRef.value.naturalHeight;
    imageLoaded.value = true;
  }
};

onMounted(async () => {
  if (imageRef.value && imageRef.value.complete) {
    onImageLoad();
  }

  try {
    // Process the mask image to create a transparent version
    processedMaskUrl.value = await createTransparentMask(originalMaskUrl);
    console.log('Processed mask URL:', processedMaskUrl.value);
  }
  catch (error) {
    console.error('Error processing mask:', error);
  }
});
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
