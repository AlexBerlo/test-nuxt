<script setup lang="ts">
import { ref, watch, toRef, nextTick } from 'vue';
import { useSortable, moveArrayElement } from '@vueuse/integrations/useSortable';
import { createTransparentMask } from '~/utils/mask-utils';

const props = defineProps<{
  imageUrl: string;
  maskUrl?: string;
  showActions?: boolean;
  progressionOptions?: string[];
}>();

const emit = defineEmits<{
  'regenerate': [];
  'use-image': [];
  'save-image': [];
  'update-progression': [index: number, text: string];
  'reorder-progressions': [progressions: string[]];
}>();

const imageRef = ref<HTMLImageElement | null>(null);
const imageLoaded = ref(false);
const isHoveringMask = ref(false);
const processedMaskUrl = ref<string | null>(null);
const editingIndex = ref<number | null>(null);
const editingText = ref('');
const sortableList = useTemplateRef<HTMLElement>('sortableList');
const progressionOptionsRef = toRef(props, 'progressionOptions', []);

watch(progressionOptionsRef, () => {
  nextTick(() => {
    useSortable(sortableList, progressionOptionsRef, {
      animation: 150,
      handle: '.drag-handle',
      onUpdate: (e: { oldIndex: number; newIndex: number }) => {
        moveArrayElement(progressionOptionsRef.value, e.oldIndex, e.newIndex, e);
        nextTick(() => {
          /* do something */
        });
      }
    });
  });
}, { deep: true, immediate: true });

const startEditing = (index: number, text: string) => {
  editingIndex.value = index;
  editingText.value = text;
};

const saveEdit = (index: number) => {
  if (editingIndex.value !== null) {
    emit('update-progression', index, editingText.value);
    editingIndex.value = null;
    editingText.value = '';
  }
};

const cancelEdit = () => {
  editingIndex.value = null;
  editingText.value = '';
};

const onImageLoad = () => {
  if (imageRef.value) {
    imageLoaded.value = true;
  }
};

const downloadImage = async () => {
  if (!props.imageUrl) return;

  try {
    const response = await fetch(props.imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scene-image-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
  catch (error) {
    console.error('Error downloading image:', error);
  }
};

// Process mask image when maskUrl changes
const processMask = async () => {
  if (!props.maskUrl) {
    processedMaskUrl.value = null;
    return;
  }

  try {
    processedMaskUrl.value = await createTransparentMask(props.maskUrl);
    console.log('Processed mask URL:', processedMaskUrl.value);
  }
  catch (error) {
    console.error('Error processing mask:', error);
  }
};

watch(() => props.maskUrl, async (newMaskUrl) => {
  if (newMaskUrl) {
    await processMask();
  }
  else {
    processedMaskUrl.value = null;
  }
}, { immediate: true });
</script>

<template>
  <UCard>
    <div class="relative bg-gray-100 rounded-lg overflow-hidden w-5/6 mx-auto">
      <img
        ref="imageRef"
        :src="imageUrl"
        alt="Scene preview image"
        class="w-full h-full object-cover"
        @load="onImageLoad"
      >

      <!-- Hotspot overlay (only shown when maskUrl is provided) -->
      <div
        v-if="maskUrl && imageLoaded"
        class="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <div class="hotspot-overlay">
          <!-- Invisible hotspot area for hover detection -->
          <div
            v-if="processedMaskUrl"
            class="hotspot-hover-area"
            :style="{
              maskImage: `url(${processedMaskUrl})`,
              WebkitMaskImage: `url(${processedMaskUrl})`
            }"
            @mouseenter="isHoveringMask = true"
            @mouseleave="isHoveringMask = false"
          />

          <!-- Highlight overlay that appears on hover -->
          <div
            v-if="processedMaskUrl && isHoveringMask"
            class="hotspot-highlight"
            :style="{
              maskImage: `url(${processedMaskUrl})`,
              WebkitMaskImage: `url(${processedMaskUrl})`
            }"
          />
        </div>
      </div>
    </div>

    <!-- Progression Options Display -->
    <div
      v-if="progressionOptions && progressionOptions.length > 0"
      class="bg-black text-white p-4 mt-4 rounded-lg"
    >
      <ul ref="sortableList">
        <li
          v-for="(option, index) in progressionOptionsRef"
          :key="index"
          class="mb-2 flex items-center justify-between"
        >
          <div class="flex items-center">
            <span class="mr-2">{{ index + 1 }}.</span>
            <div v-if="editingIndex !== index">
              {{ option }}
            </div>
            <div
              v-if="editingIndex === index"
              class="flex-grow"
            >
              <UInput
                v-model="editingText"
                class="flex-grow"
                @keyup.enter="saveEdit(index)"
                @keyup.escape="cancelEdit"
              />
            </div>
          </div>

          <div class="flex items-center space-x-2 ml-4">
            <UButton
              v-if="editingIndex !== index"
              icon="i-heroicons-pencil"
              size="xs"
              @click="startEditing(index, option)"
            />
            <UButton
              v-if="editingIndex === index"
              icon="i-heroicons-check"
              size="xs"
              @click="saveEdit(index)"
            />
            <UButton
              v-if="editingIndex === index"
              icon="i-heroicons-x-mark"
              size="xs"
              @click="cancelEdit"
            />
            <UButton
              v-if="editingIndex !== index"
              icon="i-heroicons-bars-3"
              class="drag-handle"
              :class="{ 'cursor-move': editingIndex === null }"
              :disabled="editingIndex !== null"
              size="xs"
            />
          </div>
        </li>
      </ul>
    </div>

    <!-- Action buttons -->
    <div
      v-if="showActions"
      class="flex justify-center space-x-2 mt-4"
    >
      <UButton
        label="Save"
        color="primary"
        @click="emit('save-image')"
      />
      <UButton
        label="Download"
        variant="outline"
        icon="i-heroicons-arrow-down-tray"
        @click="downloadImage"
      />
      <UButton
        label="Regenerate"
        variant="outline"
        icon="i-heroicons-arrow-path"
        @click="emit('regenerate')"
      />
      <UButton
        label="Use This Image"
        color="primary"
        icon="i-heroicons-check"
        @click="emit('use-image')"
      />
    </div>
  </UCard>
</template>

<style scoped>
.hotspot-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hotspot-hover-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  pointer-events: auto;
  background-color: rgba(255, 255, 255, 0.01); /* Very slight background to enable hover */
  mask-size: 100% 100%;
  -webkit-mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
}

.hotspot-highlight {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  transition: opacity 0.2s;
  pointer-events: none;
  mask-size: 100% 100%;
  -webkit-mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
}
</style>
