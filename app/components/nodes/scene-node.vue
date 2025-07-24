<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { getRandomColor } from '~/utils/flow-utils';

interface ProgressionOption {
  id: string;
  text: string;
  connected: boolean;
}

interface NodeData {
  label: string;
  imageUrl?: string;
  progressionOptions?: ProgressionOption[];
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

const hoveredOption = ref<string | null>(null);
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md p-4 w-96 h-56 bg-cover bg-center relative"
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

    <!-- Progression Options as Vue Flow Handles -->
    <template
      v-if="data.progressionOptions && data.progressionOptions.length > 0"
    >
      <Handle
        v-for="(option, index) in data.progressionOptions"
        :id="`option-${option.id}`"
        :key="option.id"
        type="source"
        :position="Position.Bottom"
        class="!w-6 !h-6 !border-2 !border-white !rounded-full !shadow-lg !transition-all !cursor-pointer !opacity-100 hover:!scale-110"
        :style="{
          left: `${20 + (index * 40)}px`,
          bottom: '-12px',
          backgroundColor: option.connected ? '#22c55e' : getRandomColor(index)
        }"
        @mouseenter="hoveredOption = option.id"
        @mouseleave="hoveredOption = null"
      />

      <!-- Custom Tooltip -->
      <template v-if="hoveredOption">
        <div
          v-for="(option, index) in data.progressionOptions"
          v-show="hoveredOption === option.id"
          :key="`tooltip-${option.id}`"
          class="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none"
          :style="{
            left: `${20 + (index * 40) - 20}px`,
            bottom: '20px',
            fontSize: '14px',
            minWidth: '120px',
            maxWidth: '200px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }"
        >
          {{ option.text }}
          <div
            class="absolute w-2 h-2 bg-gray-900 rotate-45"
            :style="{
              left: '50%',
              bottom: '-4px',
              transform: 'translateX(-50%) rotate(45deg)'
            }"
          />
        </div>
      </template>
    </template>

    <!-- Target handle for receiving connections -->
    <Handle
      id="target"
      type="target"
      :position="Position.Top"
      class="!w-4 !h-4 !bg-blue-500 !border-2 !border-white !opacity-60 hover:!opacity-100 !transition-opacity"
      :style="{
        left: '50%',
        transform: 'translateX(-50%)',
        top: '-8px'
      }"
    />
  </div>
</template>
