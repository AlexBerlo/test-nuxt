<script setup lang="ts">
import { ref } from 'vue';

const title = ref('');

async function saveStory() {
  if (!title.value) {
    return;
  }

  const story = await $fetch('/api/stories', {
    method: 'POST',
    body: {
      title: title.value
    }
  });

  if (story) {
    navigateTo(`/main/scene/new?storyId=${story.id}`);
  }
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
  </UContainer>
</template>
