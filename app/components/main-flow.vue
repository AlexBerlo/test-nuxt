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
</script>

<template>
  <div class="container h-300 w-500 border-amber-400 border-2">
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
  </div>
</template>
