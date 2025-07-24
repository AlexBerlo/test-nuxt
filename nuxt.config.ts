export default defineNuxtConfig({
  /**
   * why below throws ts error ??
   */
  // images: {
  //   cloudflare: {
  //     baseURL: 'https://that-test.site',
  //   },
  // },
  modules: [
    '@nuxthub/core',
    '@nuxt/ui-pro',
    'nuxt-auth-utils',
    '@nuxt/eslint',
    '@nuxt/image',
    '@vueuse/nuxt'
  ],
  devtools: {
    enabled: true
  },
  css: ['~/assets/css/main.css'],
  // $development: {
  //   hub: {
  //     remote: true,
  //   },
  // },
  runtimeConfig: {
    replicateToken: process.env.NUXT_REPLICATE_TOKEN,
    session: {
      password: process.env.NUXT_SESSION_PASSWORD
    },
    oauth: {
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET
      }
    },
    hub: {
      projectKey: process.env.NUXT_HUB_PROJECT_KEY,
      env: process.env.NUXT_HUB_ENV
    }
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',
  hub: {
    database: true,
    blob: true
  },

  // Development config
  eslint: {
    checker: {
    },
    config: {
      stylistic: {
        quotes: 'single',
        commaDangle: 'never',
        semi: true
      }
    }
  }
});
