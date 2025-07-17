<script setup lang="ts">
import { ref } from 'vue';

const title = ref('');
const description = ref('');

async function saveStory() {
  if (!title.value) {
    return;
  }

  const story = await $fetch('/api/stories', {
    method: 'POST',
    body: {
      title: title.value,
      description: description.value
    }
  });

  if (story) {
    navigateTo(`/main/scene/new?storyId=${story.id}`);
  }
}
</script>

<template>
  <UContainer>
    <div class="py-4">
      <div class="mb-4">
        <UButton
          to="/main"
          icon="i-heroicons-arrow-left"
          variant="ghost"
        />
      </div>
      <h1 class="text-2xl font-bold mb-6">
        Create a New Story
      </h1>
      <div class="space-y-4">
        <UInput
          v-model="title"
          placeholder="Story title"
          maxlength="50"
        />
        <UTextarea
          v-model="description"
          placeholder="Story description"
          maxlength="255"
        />
        <UButton
          :disabled="!title"
          @click="saveStory"
        >
          Save Story
        </UButton>
      </div>
    </div>
  </UContainer>
</template>
