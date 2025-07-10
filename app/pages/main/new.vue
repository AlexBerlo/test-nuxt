<script setup lang="ts">
import { ref } from 'vue';
import MainFlow from '~/components/main-flow.vue';

const title = ref('');

async function saveStory() {
  if (!title.value) {
    return;
  }

  await $fetch('/api/stories', {
    method: 'POST',
    body: {
      title: title.value
    }
  });
}
</script>

<template>
  <UContainer>
    <div class="flex items-center justify-between py-4">
      <UInput
        v-model="title"
        placeholder="Story title"
        class="w-1/2"
      />
      <UButton
        :disabled="!title"
        @click="saveStory"
      >
        Save Story
      </UButton>
    </div>
    <ClientOnly
      fallback-tag="span"
      fallback="Loading flow..."
    >
      <MainFlow />
    </ClientOnly>
  </UContainer>
</template>
