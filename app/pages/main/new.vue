<script setup lang="ts">
import Flow from '~/components/flow.vue';

const asd = ref();
</script>

<template>
  <UContainera>
    <ClientOnly fallback-tag="span" fallback="Loading flow...">
      <Flow />
    </ClientOnly>
  </UContainera>
</template>
