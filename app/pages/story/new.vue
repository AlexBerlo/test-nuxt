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
    navigateTo(`/story/scene/new?storyId=${story.id}?scCnt=0`);
  }
}
</script>

<template>
  <UContainer>
    <div class="py-4">
      <div class="mb-4">
        <UButton
          to="/story"
          icon="i-heroicons-arrow-left"
          variant="ghost"
        />
      </div>
      <h1 class="text-2xl font-bold mb-6 text-center">
        Create a New Story
      </h1>
      <div class="space-y-4 flex flex-col items-center">
        <UInput
          v-model="title"
          placeholder="Story title"
          maxlength="50"
          class="w-100"
        />
        <UTextarea
          v-model="description"
          placeholder="Story description"
          maxlength="255"
          class="w-100"
        />
        <UButton
          class="w-50 text-center"
          :disabled="!title"
          @click="saveStory"
        >
          Save Story
        </UButton>
      </div>
    </div>
  </UContainer>
</template>
