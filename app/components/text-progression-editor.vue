<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: 'add-progression', text: string): void;
}>();

const progressionText = ref('');

const addProgression = () => {
  if (progressionText.value.trim() && !props.disabled) {
    emit('add-progression', progressionText.value.trim());
    progressionText.value = '';
  }
};
</script>

<template>
  <div class="flex items-center space-x-2">
    <UButton
      icon="i-heroicons-plus"
      :disabled="!progressionText.trim() || disabled"
      @click="addProgression"
    />
    <UInput
      v-model="progressionText"
      placeholder="Add text progression option"
      class="flex-grow"
      @keyup.enter="addProgression"
    />
  </div>
</template>
