<script setup lang="ts">
import MainFlow from '~/components/main-flow.vue';

const route = useRoute();
const storyId = route.params.id as string;

const { data: story } = await useFetch(`/api/stories/${storyId}`);
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
      fallback-tag="span"
      fallback="Loading flow..."
    >
      <MainFlow :story="story" />
    </ClientOnly>
  </UContainer>
</template>
