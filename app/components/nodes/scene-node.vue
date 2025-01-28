<script setup lang="ts">
interface NodeData {
  label: string;
  // Add any other properties that your node data might have
}

defineProps<{
  id: string;
  data: NodeData;
}>();

</script>
<template>
  <div class="bg-white rounded-lg shadow-md p-4 w-64">
    <h3 class="text-lg font-semibold mb-4">Scene Node</h3>
    <div class="flex flex-col items-center">
      <UButton
        class="mb-4"
        color="primary"
        label="Add Image"
      />
    </div>
    <div class="absolute bottom-4 right-4">
      <UButton
        color="secondary"
        icon="i-heroicons-plus"
        label="Add Progress Icon"
      />
    </div>
  </div>
</template>