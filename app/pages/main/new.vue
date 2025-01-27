<script setup lang="ts">
import Flow from '~/components/flow.vue';

const asd = ref()
</script>

<template>
  <UContainer>
    <ClientOnly fallback-tag="span" fallback="Loading flow...">
      <Flow />
    </ClientOnly>
  </UContainer>
</template>
