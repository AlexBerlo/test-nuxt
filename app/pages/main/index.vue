<script setup lang="ts">
const { data: stories } = await useFetch('/api/stories');
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
        <UButton
          :to="`/main/${story.id}`"
          label="Edit"
        />
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
  </UContainer>
</template>
