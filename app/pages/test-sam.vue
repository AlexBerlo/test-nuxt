<template>
  <div class="container mx-auto p-4">
    <div class="mb-8">
      <h1 class="text-2xl font-bold mb-4">
        Test SAM Object Detection with Hover Effect
      </h1>

      <!-- Test Image -->
      <div class="mb-4">
        <!-- <ClientOnly
          fallback-tag="span"
          fallback="Loading flow..."
        >
      </ClientOnly> -->
        <ImageHotspots
          :image-url="testImageUrl"
          :hotspots="state.hotspots"
          :is-selectable="true"
          :selected-hotspot="state.selectedHotspot"
          @select="onHotspotSelect"
        />
      </div>

      <p
        v-if="state.error"
        class="text-red-500 mb-4"
      >
        {{ state.error }}
      </p>

      <!-- Selected Hotspot Info -->
      <div
        v-if="state.selectedHotspot"
        class="mb-4 p-4 border rounded-lg"
      >
        <h3 class="text-lg font-semibold mb-2">
          Selected Hotspot
        </h3>
        <pre class="bg-gray-100 p-4 rounded overflow-auto">{{ state.selectedHotspot }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import type { BlobObject } from '@nuxthub/core';
import type { ImageHotspot } from '../../types/image';
// import type { DetectionResponse } from '../../types/api';

// Using a direct image URL for testing the hover effect
const testImageUrl = 'https://test-nuxt.nuxt.dev/images/generated-image_2766042/794380633107-dade0d1d.webp';

interface State {
  hotspots: ImageHotspot[];
  selectedHotspot: ImageHotspot | null;
  error: string | null;
}

// interface ApiResponse {
//   blobs: BlobObject[];
// }

const state = ref<State>({
  hotspots: [],
  selectedHotspot: null,
  error: null
});

// const data = ref<{
//   blobs: BlobObject[];
//   cursor?: string;
//   hasMore: boolean;
// }>({
//   blobs: [],
//   hasMore: true
// });

// const loadImage = async () => {
//   const more = await $fetch<ApiResponse>(`/api/generate-image`);

//   data.value.blobs.push(...more.blobs);
//   // Assume there's more if we got a full page of results
//   data.value.hasMore = more.blobs.length === 10;
// };

// Detect objects on component mount
onMounted(async () => {
  // await loadImage();
  try {
    // const detectionResponse = await $fetch<DetectionResponse>('/api/detect-objects-sam', {
    //   method: 'POST',
    //   body: { imageUrl: testImageUrl }
    // });

    // state.value.hotspots = detectionResponse.hotspots;
  }
  catch (error) {
    state.value.error = error instanceof Error ? error.message : 'Failed to detect objects';
  }
});

const onHotspotSelect = (hotspot: ImageHotspot) => {
  state.value.selectedHotspot = hotspot;
};
</script>
