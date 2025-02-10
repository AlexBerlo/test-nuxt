<script setup lang="ts">
import { UseTimeAgo, vInfiniteScroll } from '@vueuse/components';

interface CustomMetadata {
  description?: string;
  aiImage?: boolean;
  userUrl?: string;
  userAvatar?: string;
  userName?: string;
  uploadedAt?: string;
}

interface BlobObject {
  pathname: string;
  uploadedAt: string;
  customMetadata?: CustomMetadata;
}

interface ApiResponse {
  blobs: BlobObject[];
}

const data = ref<{
  blobs: BlobObject[];
  cursor?: string;
  hasMore: boolean;
}>({
  blobs: [],
  hasMore: true
});

const loading = ref(false);
const loadMore = async () => {
  if (loading.value || !data.value.hasMore)
    return;
  loading.value = true;

  const more = await $fetch<ApiResponse>(`/api/generate-image`, {
    query: { cursor: data.value.cursor }
  });

  data.value.blobs.push(...more.blobs);
  // Assume there's more if we got a full page of results
  data.value.hasMore = more.blobs.length === 10;
  loading.value = false;
};

const drawingTitle = (drawing: BlobObject) => {
  const title = drawing.customMetadata?.description || 'no description available';
  if (!drawing.customMetadata?.aiImage) {
    return `${title}\n[AI image could not be generated]`;
  }
  return title;
};
</script>

<template>
  <div class="my-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ">
      <div
        v-for="drawing in data.blobs"
        :key="drawing.pathname"
        class="flex flex-col gap-2"
      >
        <div
          class="group relative max-w-[400px]"
          :title="drawingTitle(drawing)"
        >
          <img
            :src="`/images/${drawing.pathname}`"
            :alt="drawing.customMetadata?.description || drawing.pathname"
            class="w-full rounded aspect-1"
            loading="lazy"
          >
        </div>
        <div class="flex items-center justify-between max-w-[400px]">
          <NuxtLink
            class="flex items-center gap-1"
            :to="drawing.customMetadata?.userUrl"
            target="_blank"
          >
            <UAvatar
              :src="drawing.customMetadata?.userAvatar"
              size="xs"
              icon="i-ph-mask-happy-duotone"
              class="border-red-600 border-2"
            />
            <span class="text-xs font-semibold">{{ drawing.customMetadata?.userName }}</span>
          </NuxtLink>
          <UseTimeAgo
            v-slot="{ timeAgo }"
            :time="new Date(drawing.customMetadata?.uploadedAt || drawing.uploadedAt)"
          >
            <span class="text-xs text-gray-500">{{ timeAgo }}</span>
          </UseTimeAgo>
        </div>
      </div>
    </div>
    <div
      v-if="data.hasMore"
      v-infinite-scroll="[loadMore, { distance: 10, interval: 1000 }]"
      class="flex items-center justify-center mt-2 p-4"
    >
      <UButton
        color="secondary"
        block
        size="md"
        :loading="loading"
        :label="loading ? 'Loading more drawings...' : 'Load more drawings'"
        @click="loadMore"
      />
    </div>
  </div>
</template>
