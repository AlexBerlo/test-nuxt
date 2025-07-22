<script setup lang="ts">
const props = defineProps<{
  initialImageUrl?: string;
}>();

const prompt = ref('');
const generatedImage = ref(props.initialImageUrl || '');
const uploadedImage = ref<File | null>(null);
const uploadedImagePreviewUrl = ref<string | null>(null);
const uploadedImageUrl = ref<string | null>(null);
const useForContext = ref(false);
const imageDescription = ref('');
const imageGenerationLoading = ref(false);
const imageDescriptionLoading = ref(false);

const emit = defineEmits(['image-generated']);

const regenerateImage = () => {
  generateImage();
};

// Expose the method so parent can call it
defineExpose({
  regenerateImage
});

const generateImage = async () => {
  imageGenerationLoading.value = true;

  const body: { prompt: string; imageUrl?: string | null } = {
    prompt: prompt.value
  };

  if (uploadedImageUrl.value) {
    body.imageUrl = uploadedImageUrl.value;
  }

  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.imageUrl)) {
        generatedImage.value = data.imageUrl[0];
      }
      else {
        generatedImage.value = data.imageUrl;
      }
      emit('image-generated', generatedImage.value);
    }
    else {
      console.error('Failed to generate image');
    }
  }
  catch (error) {
    console.error('Error generating image:', error);
  }
  finally {
    imageGenerationLoading.value = false;
  }
};

const describeImage = async () => {
  if (!uploadedImage.value) {
    console.error('No image selected');
    return;
  }
  imageDescriptionLoading.value = true;

  const formData = new FormData();
  formData.append('image', uploadedImage.value);
  formData.append('prompt', 'Describe this image in detail.');

  try {
    const response = await fetch('/api/describe-image', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      imageDescription.value = data.description;
    }
    else {
      console.error('Failed to describe image');
    }
  }
  catch (error) {
    console.error('Error describing image:', error);
  }
  finally {
    imageDescriptionLoading.value = false;
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file) {
      uploadedImage.value = file;
      uploadedImagePreviewUrl.value = URL.createObjectURL(file);
      useForContext.value = false; // Reset checkbox on new file
    }
    uploadedImageUrl.value = null; // Reset on new file selection
  }
};

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});

watch(useForContext, async (newValue) => {
  if (newValue && uploadedImage.value) {
    uploadedImageUrl.value = await toBase64(uploadedImage.value);
  }
  else {
    uploadedImageUrl.value = null;
  }
});
</script>

<template>
  <div class="flex">
    <UCard>
      <div class="image-generator">
        <p class="mb-4">
          Enter a description, and we'll generate an image for you!
        </p>
        <UTextarea
          v-model="prompt"
          :rows="3"
          placeholder="Enter image description"
          class="flex-grow mb-4 w-100"
        />
        <div class="flex items-center space-x-2 mb-4">
          <UButton
            label="Generate"
            color="primary"
            @click="generateImage"
          />
        </div>
        <UProgress
          v-if="!generatedImage && imageGenerationLoading"
          animation="carousel"
        />
      </div>
    </UCard>
    <UCard>
      <div class="image-descriptor">
        <p class="mb-4">
          Upload an image to use as context or to generate a description!
        </p>
        <div class="flex items-center space-x-2 mb-4">
          <UInput
            type="file"
            class="flex-grow"
            @change="handleFileUpload"
          />
          <UButton
            label="Describe"
            color="primary"
            :disabled="!uploadedImage"
            @click="describeImage"
          />
        </div>
        <div

          class="flex items-center space-x-2 mt-4"
        >
          <UCheckbox
            v-model="useForContext"
            :disabled="!uploadedImage"
            label="Use as context for generation"
          />
        </div>
        <div
          v-if="uploadedImagePreviewUrl"
          class="mt-4"
        >
          <img
            :src="uploadedImagePreviewUrl"
            alt="Image Preview"
            class="max-w-full h-auto"
          >
        </div>
        <UProgress
          v-if="!imageDescription && imageDescriptionLoading"
          animation="carousel"
        />
        <div
          v-else-if="imageDescription"
          class="mt-4"
        >
          <h2 class="text-xl font-semibold mb-2">
            Image Description:
          </h2>
          <p>{{ imageDescription }}</p>
        </div>
      </div>
    </UCard>
  </div>
</template>
