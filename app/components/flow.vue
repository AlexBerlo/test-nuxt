
<script setup>
import { ref, onMounted } from 'vue'
import { VueFlow, Panel } from '@vue-flow/core'

const nodes = ref([
  {
    id: '1',
    position: { x: 50, y: 50 },
    data: { label: 'Node 1', },
  }
]);

const addNode= () => {
  const id = Date.now().toString()
  
  nodes.value.push({
    id,
    position: { x: 150, y: 50 },
    data: { label: `Node ${id}`, },
  })
}
</script>

<template>
    <div class="container h-300 w-500 border-amber-400 border-2">
    <VueFlow :nodes="nodes">
      <Panel>
        <button type="button" @click="addNode">Add a node</button>
      </Panel>
    </VueFlow>
  </div>
</template>
