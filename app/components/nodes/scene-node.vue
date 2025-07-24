<script setup lang="ts">
interface NodeData {
  label: string;
  imageUrl?: string;
}

const props = defineProps<{
  id: string;
  data: NodeData;
  isEditing?: boolean;
}>();

// const emit = defineEmits<{
//   (e: 'update:data', data: NodeData): void;
// }>();

const handleNodeClick = () => {
  if (!props.data.imageUrl) {
    navigateTo(`/story/scene/${props.id}`);
  }
};
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md p-4 w-96 h-56 bg-cover bg-center"
    :style="{ backgroundImage: data.imageUrl ? `url(${data.imageUrl})` : 'none' }"
    @click="handleNodeClick"
  >
    <h3
      class="text-lg font-semibold mb-4 text-white"
      style="text-shadow: 1px 1px 2px black;"
    >
      {{ data.label || 'Scene Node' }}
    </h3>

    <div
      v-if="!data.imageUrl"
      class="flex flex-col items-center"
    >
      <UButton
        class="cursor-pointer mb-4 w-12 h-12 flex items-center justify-center"
        color="primary"
        variant="solid"
        aria-label="Add Image"
      >
        <UIcon
          name="i-heroicons-plus"
          class="w-8 h-8 text-gray-700"
        />
      </UButton>
    </div>
  </div>
</template>
