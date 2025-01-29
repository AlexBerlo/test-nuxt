<script setup>
import { ref } from 'vue'
import { VueFlow, Panel } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import SceneNode from './nodes/scene-node.vue'
import { markRaw } from 'vue';
import { v4 as uuidv4 } from 'uuid';


const nodeTypes = {
  'scene-node': markRaw(SceneNode),
}

const nodes = ref([
  {
    id: uuidv4(),
    type: 'scene-node', // Add this line to use the custom node type
    data: { label: 'Scene Node' },
    position: { x: 10, y: 10 },
  }
]);

const edges = ref([])

const addNode = () => {
  console.log('add node');
  nodes.value.push({
    id: uuidv4(),
    type: 'scene-node', // Add this line to use the custom node type
    data: { label: 'Scene Node' },
    position: { x: 100, y: 100 },
  })
};
</script>

<template>
  <div class="container h-300 w-500 border-amber-400 border-2">
    <VueFlow :nodes="nodes" :edges="edges" fit-view-on-init elevate-edges-on-select :node-types="nodeTypes">
      <Panel>
        <button type="button" @click="addNode">
          Add a node
        </button>
      </Panel>
      <MiniMap />
      <Controls />
      <Background />
    </VueFlow>
  </div>
</template>