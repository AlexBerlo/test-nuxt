<script setup lang="ts">
const router = useRouter();

function goToNewStory() {
  router.push('/main/new');
}
</script>

<template>
  <div class="p-4">
    <UContainer>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">
          My Stories
        </h1>
        <UButton
          icon="i-heroicons-plus" color="primary" variant="solid" aria-label="Add new story"
          @click="goToNewStory"
        />
      </div>
    </UContainer>
  </div>
</template>

<style scoped lang="scss"></style>
