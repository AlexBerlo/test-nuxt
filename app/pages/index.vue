<script setup lang="ts">
const { loggedIn } = useUserSession();
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold leading-6">
        Todo List
      </h3>
      <UButton
        v-if="!loggedIn"
        to="/api/auth/github"
        icon="i-simple-icons-github"
        label="Login with GitHub"
        external
      />
      <template v-else>
        <UButton
          to="/todos"
          icon="i-heroicons-list-bullet"
          class="mr-2"
          label="Go to Todos"
        />
        <UButton
          to="/images-list"
          icon="i-heroicons-list-bullet"
          class="mr-2"
          label="Go to Image list"
        />
        <UButton
          to="/story"
          icon="i-heroicons-list-bullet"
          class="mr-2"
          label="Go to Story Creation"
        />
      </template>
    </template>
  </UCard>
</template>
