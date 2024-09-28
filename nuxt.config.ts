export default defineNuxtConfig({
  compatibilityDate: '2024-07-30',
  future: { compatibilityVersion: 4 },
  modules: [
    '@nuxthub/core',
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@nuxt/eslint'
  ],
  hub: {
    database: true
  },
  // Development config
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        commaDangle: 'never'
      }
    }
  },
  devtools: {
    enabled: true
  },
  runtimeConfig: {
    session: {
      password: process.env.NUXT_SESSION_PASSWORD
    },
    oauth: {
      github : {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
      }
    },
    hub: {
      projectKey: process.env.NUXT_HUB_PROJECT_KEY,
      env: process.env.NUXT_HUB_ENV,
    }
  }
})
