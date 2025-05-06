<script setup lang="ts">
import type { ImageHotspot } from '../../../types/image';

interface NodeData {
  label: string;
  imageUrl?: string;
}

const props = defineProps<{
  id: string;
  data: NodeData;
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:data', data: NodeData): void;
}>();

const handleNodeClick = () => {
  if (!props.data.imageUrl) {
    navigateTo(`/main/scene/${props.id}`);
  }
};

const onHotspotSelect = (hotspot: ImageHotspot) => {
  const updatedData = {
    ...props.data,
    selectedHotspot: hotspot
  };
  emit('update:data', updatedData);
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-4 w-96">
    <h3 class="text-lg font-semibold mb-4">
      {{ data.label || 'Scene Node' }}
    </h3>

    <div
      v-if="data.imageUrl"
      class="mb-4"
    >
      <ImageHotspots
        :image-url="data.imageUrl"
        :is-selectable="isEditing"
        @select="onHotspotSelect"
      />
    </div>
    <div
      v-else
      class="flex flex-col items-center"
    >
      <UButton
        class="cursor-pointer mb-4 w-12 h-12 flex items-center justify-center"
        color="primary"
        variant="solid"
        aria-label="Add Image"
        @click="handleNodeClick"
      >
        <UIcon
          name="i-heroicons-plus"
          class="w-8 h-8 text-gray-700"
        />
      </UButton>
    </div>
  </div>
</template>
