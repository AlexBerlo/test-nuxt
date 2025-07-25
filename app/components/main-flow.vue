<script setup lang="ts">
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { markRaw, ref, watch } from 'vue';
import type { Node, Edge } from '@vue-flow/core';
import SceneNode from './nodes/scene-node.vue';
import type { StoryWithRelations } from '~~/types/api';
import { calculateNewNodePosition } from '~/utils/flow-utils';

interface SceneNodeData {
  label: string;
  imageUrl: string | null;
  progressionOptions: Array<{
    id: string;
    text: string;
    connected: boolean;
  }>;
}

const props = defineProps<{
  story: StoryWithRelations;
}>();

const { onConnect, addEdges, removeNodes } = useVueFlow();

/* eslint-disable @typescript-eslint/no-explicit-any */
const nodeTypes = {
  'scene-node': markRaw(SceneNode)
} as any;
/* eslint-enable @typescript-eslint/no-explicit-any */

const nodes = ref<Node<SceneNodeData>[]>([]);
const edges = ref<Edge[]>([]);

watch(
  () => props.story,
  (story) => {
    if (story && story.scenes) {
      nodes.value = story.scenes.map((scene) => {
        // Get progression options for this scene
        const sceneTransitions = story.transitions
          ? story.transitions.filter(t => t.sourceSceneId === scene.id)
          : [];

        return {
          id: scene.id,
          type: 'scene-node',
          label: `Scene ${scene.id.slice(-4)}`,
          position: scene.position || { x: Math.random() * 400, y: Math.random() * 400 },
          data: {
            label: `Scene ${scene.id.slice(-4)}`,
            imageUrl: scene.imageUrl,
            progressionOptions: sceneTransitions.map(t => ({
              id: t.id,
              text: t.optionText,
              connected: !!t.targetSceneId
            }))
          }
        };
      });

      // Convert transitions to edges
      if (story.transitions) {
        edges.value = story.transitions
          .filter(transition => transition.targetSceneId) // Only connected transitions
          .map(transition => ({
            id: transition.id,
            source: transition.sourceSceneId,
            target: transition.targetSceneId!,
            type: 'default',
            style: {
              stroke: '#374151',
              strokeWidth: 2
            }
          }));
      }
    }
  },
  { immediate: true }
);

onConnect(async (params) => {
  // Extract the transition ID from the source handle
  const sourceHandleId = params.sourceHandle;
  const targetSceneId = params.target;

  if (sourceHandleId && sourceHandleId.startsWith('option-')) {
    const transitionId = sourceHandleId.replace('option-', '');

    try {
      // Update the scene transition with the target scene ID
      await $fetch(`/api/scene-transitions/${transitionId}`, {
        method: 'PUT',
        body: {
          targetSceneId
        }
      });

      // Add the edge to the flow
      addEdges([{
        ...params,
        type: 'default',
        style: {
          stroke: '#374151',
          strokeWidth: 2
        }
      }]);

      // Refresh the story data to show the updated connection
      // You might want to emit an event here to refresh the parent component
      console.log('Connection created successfully');
    }
    catch (error) {
      console.error('Failed to create connection:', error);
    }
  }
  else {
    // Regular connection
    addEdges([params]);
  }
});

// Handle add new node click
const handleAddNewNode = () => {
  const newPosition = calculateNewNodePosition(nodes.value);
  // Store position in sessionStorage to use after scene creation
  sessionStorage.setItem('newNodePosition', JSON.stringify(newPosition));
  // Navigate to scene creation
  navigateTo(`/story/scene/new?storyId=${props.story.id}`);
};

// Handle scene deletion using Vue Flow's removeNodes API
const handleSceneDeleted = (sceneId: string) => {
  // Use Vue Flow's removeNodes to properly remove the node from the graph
  removeNodes(sceneId);
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
      <template #node-scene-node="nodeProps">
        <SceneNode
          v-bind="nodeProps"
          @scene-deleted="handleSceneDeleted"
        />
      </template>
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
  </div>
</template>
