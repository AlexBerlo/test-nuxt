<script setup lang="ts">
import type { Story } from '~~/types/api';

const route = useRoute();
const storyId = route.params.id as string;

const { data: story } = await useFetch<Story>(`/api/stories/${storyId}`);
</script>

<template>
  <UContainer>
    <div
      v-if="story"
      class="py-4"
    >
      <h1 class="text-2xl font-bold">
        {{ story.title }}
      </h1>
    </div>
    <ClientOnly
      v-if="story"
      fallback-tag="span"
      fallback="Loading..."
    >
      <MainFlow
        v-if="story.startSceneId"
        :story="story"
      />
    </ClientOnly>
  </UContainer>
</template>
