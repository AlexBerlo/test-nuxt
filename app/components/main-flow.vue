<script setup>
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { markRaw, ref, watch } from 'vue';
import SceneNode from './nodes/scene-node.vue';

const props = defineProps({
  story: {
    type: Object,
    required: true
  }
});

const { onConnect, addEdges } = useVueFlow();

const nodeTypes = {
  'scene-node': markRaw(SceneNode)
};

const nodes = ref([]);
const edges = ref([]);

watch(
  () => props.story,
  (story) => {
    if (story && story.scenes) {
      nodes.value = story.scenes.map(scene => ({
        id: scene.id,
        type: 'scene-node',
        label: scene.text || 'Scene',
        position: scene.position || { x: Math.random() * 400, y: Math.random() * 400 },
        data: {
          label: scene.text || 'Scene',
          imageUrl: scene.imageUrl
        }
      }));
    }
  },
  { immediate: true }
);

onConnect((params) => {
  addEdges([params]);
});

// Calculate non-overlapping position for new node
const calculateNewNodePosition = () => {
  const nodeWidth = 384; // w-96
  const nodeHeight = 224; // h-56
  const minSpacing = 50; // minimum gap between nodes
  const gridSize = 150; // grid spacing

  // Start from center of viewport
  const startX = 200;
  const startY = 200;

  // If no existing nodes, use starting position
  if (nodes.value.length === 0) {
    return { x: startX, y: startY };
  }

  // Try positions in expanding spiral
  for (let radius = 0; radius < 2000; radius += gridSize) {
    const positions = [];

    if (radius === 0) {
      positions.push({ x: startX, y: startY });
    }
    else {
      // Generate positions in a circle around the center
      const steps = Math.max(8, Math.floor(radius / 50));
      for (let i = 0; i < steps; i++) {
        const angle = (i * 2 * Math.PI) / steps;
        const x = startX + radius * Math.cos(angle);
        const y = startY + radius * Math.sin(angle);
        positions.push({ x, y });
      }
    }

    // Check each position for overlaps
    for (const pos of positions) {
      let hasOverlap = false;

      for (const node of nodes.value) {
        const dx = Math.abs(pos.x - node.position.x);
        const dy = Math.abs(pos.y - node.position.y);

        if (dx < nodeWidth + minSpacing && dy < nodeHeight + minSpacing) {
          hasOverlap = true;
          break;
        }
      }

      if (!hasOverlap) {
        return pos;
      }
    }
  }

  // Fallback: random position if no suitable position found
  return { x: Math.random() * 400, y: Math.random() * 400 };
};

// Handle add new node click
const handleAddNewNode = () => {
  const newPosition = calculateNewNodePosition();
  // Store position in sessionStorage to use after scene creation
  sessionStorage.setItem('newNodePosition', JSON.stringify(newPosition));
  // Navigate to scene creation
  navigateTo(`/main/scene/new?storyId=${props.story.id}`);
};
</script>

<template>
  <div class="container h-300 w-500 border-amber-400 border-2 relative">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      fit-view-on-init
      elevate-edges-on-select
      :node-types="nodeTypes"
    >
      <MiniMap />
      <Controls />
      <Background />
    </VueFlow>

    <!-- Add New Node Buttons - All 4 corners -->
    <!-- Top-left -->
    <UButton
      class="absolute top-4 left-4 z-10 w-12 h-12 rounded-full shadow-lg"
      color="primary"
      variant="solid"
      @click="handleAddNewNode"
    >
      <UIcon
        name="i-heroicons-plus"
        class="w-6 h-6"
      />
    </UButton>

    <!-- Top-right -->
    <UButton
      class="absolute top-4 right-4 z-10 w-12 h-12 rounded-full shadow-lg"
      color="primary"
      variant="solid"
      @click="handleAddNewNode"
    >
      <UIcon
        name="i-heroicons-plus"
        class="w-6 h-6"
      />
    </UButton>

    <!-- Bottom-left -->
    <UButton
      class="absolute bottom-4 left-4 z-10 w-12 h-12 rounded-full shadow-lg"
      color="primary"
      variant="solid"
      @click="handleAddNewNode"
    >
      <UIcon
        name="i-heroicons-plus"
        class="w-6 h-6"
      />
    </UButton>

    <!-- Bottom-right -->
    <UButton
      class="absolute bottom-4 right-4 z-10 w-12 h-12 rounded-full shadow-lg"
      color="primary"
      variant="solid"
      @click="handleAddNewNode"
    >
      <UIcon
        name="i-heroicons-plus"
        class="w-6 h-6"
      />
    </UButton>
  </div>
</template>
