<script setup lang="ts">
import type { BlobObject } from '@nuxthub/core'
import { UseTimeAgo, vInfiniteScroll } from '@vueuse/components'

const { user } = useUserSession();
const { data } = await useFetch('/api/generate-image', {
  // don't return a shallowRef as we mutate the array
  deep: true,
})

console.log(data.value);

const loading = ref(false)
async function loadMore() {
  //@ts-ignore
  if (loading.value || !data.value?.hasMore) return
  loading.value = true

  const more = await $fetch(`/api/generate-image`, {
    //@ts-ignore
    query: { cursor: data.value.cursor },
  })

  //@ts-ignore
  data.value.blobs.push(...more.blobs)
  //@ts-ignore
  data.value.cursor = more.cursor
  //@ts-ignore
  data.value.hasMore = more.hasMore
  loading.value = false
}

function drawingTitle(drawing: BlobObject) {
  const title = drawing.customMetadata?.description || 'no description available'
  if (!drawing.customMetadata?.aiImage) {
    return title + '\n[AI image could not be generated]'
  }
  return title
}
</script>

<template>
  <div class="my-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ">
      <div v-for="drawing in data?.blobs" :key="drawing.pathname" class="flex flex-col gap-2">
        <div class="group relative max-w-[400px]" :title="drawingTitle(drawing as any)">
          <img :src="`/test-nuxt/${drawing.pathname}`" :alt="drawing.customMetadata?.description || drawing.pathname"
            class="w-full rounded aspect-1" loading="lazy">
        </div>
        <div class="flex items-center justify-between max-w-[400px]">
          <NuxtLink class="flex items-center gap-1" :to="drawing.customMetadata?.userUrl" target="_blank">
            <UAvatar :src="drawing.customMetadata?.userAvatar" size="xs" icon="i-ph-mask-happy-duotone" />
            <span class="text-xs font-semibold">{{ drawing.customMetadata?.userName }}</span>
          </NuxtLink>
          <UseTimeAgo v-slot="{ timeAgo }" :time="new Date(drawing.customMetadata?.uploadedAt || drawing.uploadedAt)">
            <span class="text-xs text-gray-500">{{ timeAgo }}</span>
          </UseTimeAgo>
        </div>
      </div>
    </div>
    <div v-if="(data as any)?.hasMore" v-infinite-scroll="[loadMore, { distance: 10, interval: 1000 }]"
      class="flex items-center justify-center mt-2 p-4">
      <UButton color="gray" block size="md" :loading="loading"
        :label="loading ? 'Loading more drawings...' : 'Load more drawings'" @click="loadMore" />
    </div>
  </div>
</template>