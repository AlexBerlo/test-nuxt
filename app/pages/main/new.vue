<script setup lang="ts">
import Flow from '~/components/flow.vue';

</script>


<template>
  <UContainer>
    <ClientOnly fallback-tag="span" fallback="Loading flow...">
      <Flow />
    </ClientOnly>
  </UContainer>
</template>

