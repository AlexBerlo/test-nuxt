<script setup lang="ts">
import MainFlow from '~/components/main-flow.vue';
</script>

<template>
  <UContainer>
    <ClientOnly
      fallback-tag="span"
      fallback="Loading flow..."
    >
      <MainFlow />
    </ClientOnly>
  </UContainer>
</template>
