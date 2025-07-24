<script setup>
const { loggedIn } = useUserSession();
const colorMode = useColorMode();

watch(loggedIn, () => {
  if (!loggedIn.value) {
    navigateTo('/');
  }
});

const toggleColorMode = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
};

useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'icon', href: '/icon.png' }]
});

useSeoMeta({
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  title: 'Multivia',
  description:
    'Multivia is a platform for creating and sharing interactive stories.',
  ogImage: '/social-image.png',
  twitterImage: '/social-image.png',
  twitterCard: 'summary_large_image'
});
</script>

<template>
  <UApp>
    <div class="flex items-center justify-between px-4 py-2">
      <div>
        <NuxtLink
          to="/"
          class="fw-600 text-xl"
        >
          Multivia
        </NuxtLink>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/story">
          Stories
        </NuxtLink>
        <NuxtLink to="/images-list">
          Image gallery
        </NuxtLink>
        <UButton
          square
          variant="ghost"
          color="black"
          :icon="$colorMode.preference === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
          @click="toggleColorMode"
        />
      </div>
    </div>
    <UContainer class="flex flex-col">
      <div class="mb-2 text-right" />
      <NuxtPage />
    </UContainer>
  </UApp>
</template>

<style lang="postcss">
body {
  @apply font-sans text-gray-950 bg-gray-50 dark:bg-gray-950 dark:text-gray-50;
}
</style>
