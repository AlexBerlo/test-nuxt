<!-- pages/generate-image.vue -->
<script setup lang="ts">
const prompt = ref('');
const maskPrompt = ref('');
const generatedImage = ref('');
const uploadedImage = ref<File | null>(null);
const uploadedImagePreviewUrl = ref<string | null>(null);
const uploadedImageUrl = ref<string | null>(null);
const useForContext = ref(false);
const isUploadingForContext = ref(false);
const imageDescription = ref('');
const imageGenerationLoading = ref(false);
const imageDescriptionLoading = ref(false);
const detectedImages = ref<string[]>([]);

const generateImage = async () => {
  detectedImages.value = [];
  imageGenerationLoading.value = true;

  const body: { prompt: string; imageUrl?: string | null } = {
    prompt: prompt.value
  };
  console.log(uploadedImageUrl);

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
  console.log('asd');
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

const uploadForContext = async () => {
  console.log('uploading');
  if (!uploadedImage.value) {
    return;
  }

  isUploadingForContext.value = true;
  const formData = new FormData();
  formData.append('image', uploadedImage.value);

  try {
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data.filePath) {
        uploadedImageUrl.value = `https://multivia.ai/images/${data.filePath}`;
        console.log(uploadedImageUrl.value);
      }
    }
    else {
      console.error('Failed to upload image for context');
      useForContext.value = false; // Uncheck on failure
    }
  }
  catch (error) {
    console.error('Error uploading for context:', error);
    useForContext.value = false; // Uncheck on failure
  }
  finally {
    isUploadingForContext.value = false;
  }
};

watch(useForContext, (newValue) => {
  if (newValue) {
    uploadForContext();
  }
  else {
    uploadedImageUrl.value = null;
  }
});

const saveImage = async () => {
  if (generatedImage.value) {
    const response = await fetch(generatedImage.value);
    if (!response.ok)
      throw new Error('Network response was not ok');

    const imageBlob = await response.blob();

    const formData = new FormData();
    formData.append('image', new File([imageBlob], `drawing.jpg`, { type: 'image/jpeg' }));

    await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });
  }
};

const detectObjectsInImage = async () => {
  if (generatedImage.value) {
    try {
      const detectResponse = await $fetch('/api/detect-objects-sam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { imageUrl: generatedImage.value, maskPrompt: maskPrompt.value }
      });

      detectedImages.value = detectResponse;
      console.log('Detected objects:', detectResponse);
      // Handle the result as needed (e.g., display detected objects)
    }
    catch (error) {
      console.error('Error detecting objects:', error);
    }
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-4">
      <UButton
        to="/"
        icon="i-heroicons-arrow-left"
        variant="ghost"
      />
    </div>
    <h1 class="text-2xl font-bold mb-6">
      Image Generator
    </h1>
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
          <UButton
            label="Save"
            color="primary"
            :disabled="!generatedImage"
            @click="saveImage"
          />
          <UButton
            label="Detect objects"
            color="primary"
            :disabled="!generatedImage && !maskPrompt"
            @click="detectObjectsInImage"
          />
          <UInput
            v-model="maskPrompt"
            :disabled="!generatedImage"
            placeholder="Enter object detection prompt"
            class="flex-grow"
          />
        </div>
        <UProgress
          v-if="!generatedImage && imageGenerationLoading"
          animation="carousel"
        />
        <div
          v-else-if="generatedImage"
          class="mt-4"
        >
          <img
            :src="generatedImage"
            alt="Generated Image"
            class="max-w-full h-auto"
          >
        </div>
        <div
          v-if="detectedImages.length && detectedImages[2]"
          class="mt-4"
        >
          <image-hotspots
            :image-url="generatedImage"
            :mask-url="detectedImages[2]"
          />
        </div>
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
          v-if="uploadedImage"
          class="flex items-center space-x-2 mt-4"
        >
          <UCheckbox
            v-model="useForContext"
            label="Use as context for generation"
            :disabled="isUploadingForContext"
          />
          <UProgress
            v-if="isUploadingForContext"
            animation="carousel"
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
