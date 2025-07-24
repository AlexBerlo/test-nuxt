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
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="fw-600 text-xl"
        >
          Multivia
        </NuxtLink>
      </template>
      <template #right>
        <NuxtLink to="/story">
          Stories
        </NuxtLink>
        <NuxtLink to="/images-list">
          Image gallery
        </NuxtLink>
      </template>
    </UHeader>
    <UContainer class="flex flex-col">
      <div class="mb-2 text-right">
        <UButton
          square
          variant="ghost"
          color="black"
          :icon="$colorMode.preference === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
          @click="toggleColorMode"
        />
      </div>
      <NuxtPage />
    </UContainer>
  </UApp>
</template>

<style lang="postcss">
body {
  @apply font-sans text-gray-950 bg-gray-50 dark:bg-gray-950 dark:text-gray-50;
}
</style>
