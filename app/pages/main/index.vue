<script setup lang="ts">
import type { Story } from '~~/types/api';

const { data: stories, refresh } = await useFetch<Story[]>('/api/stories');
const isModalOpen = ref(false);
const storyToDelete = ref<Story | null>(null);

const openConfirmationModal = (story: Story) => {
  storyToDelete.value = story;
  isModalOpen.value = true;
};

const deleteStory = async () => {
  if (storyToDelete.value) {
    await $fetch(`/api/stories/${storyToDelete.value.id}`, { method: 'DELETE' });
    if (stories.value?.length) {
      stories.value = stories.value.filter(t => t.id !== storyToDelete.value?.id);
    }
    await refresh();
    isModalOpen.value = false;
    storyToDelete.value = null;
  }
};
</script>

<template>
  <UContainer>
    <div class="py-4">
      <h1 class="text-2xl font-bold">
        Your Stories
      </h1>
      <UButton
        to="/main/new"
        label="New Story"
        class="mt-4"
      />
    </div>
    <div
      v-if="stories"
      class="space-y-4 flex flex-wrap gap-8"
    >
      <UCard
        v-for="story in stories"
        :key="story.id"
      >
        <template #header>
          <h2 class="font-bold">
            {{ story.title }}
          </h2>
        </template>
        <div class="flex gap-2">
          <UButton
            :to="`/main/${story.id}`"
            label="Edit"
          />
          <UButton
            icon="i-heroicons-trash"
            color="error"
            variant="soft"
            @click="openConfirmationModal(story)"
          />
        </div>
        <template
          v-if="story.description"
          #footer
        >
          {{ story.description }}
        </template>
      </UCard>
    </div>
    <div v-else>
      <p>You don't have any stories yet.</p>
    </div>
    <UModal
      v-model:open="isModalOpen"
      title="   Confirm Deletion"
    >
      <template #body>
        <p>Are you sure you want to delete this story? This action cannot be undone.</p>
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="secondary"
            variant="ghost"
            @click="isModalOpen = false"
          />
          <UButton
            label="Delete"
            color="error"
            @click="deleteStory"
          />
        </div>
      </template>
    </UModal>
  </UContainer>
</template>
