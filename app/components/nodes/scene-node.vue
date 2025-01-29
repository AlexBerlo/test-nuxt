<script setup lang="ts">
interface NodeData {
  label: string;
  // Add any other properties that your node data might have
}

const props = defineProps<{
  id: string;
  data: NodeData;
}>();

const handleNodeClick = () => {
  navigateTo(`/main/scene/${props.id}`);
}


</script>
<template>
  <div class="bg-white rounded-lg shadow-md p-4 w-64">
    <h3 class="text-lg font-semibold mb-4">Scene Node</h3>
    <div class="flex flex-col items-center">
      <UButton @click="handleNodeClick" class="cursor-pointer mb-4 w-12 h-12 flex items-center justify-center"
        color="primary" variant="solid" aria-label="Add Image">
        <UIcon name="i-heroicons-plus" class="w-8 h-8 text-gray-700" />
      </UButton>
    </div>
  </div>
</template>