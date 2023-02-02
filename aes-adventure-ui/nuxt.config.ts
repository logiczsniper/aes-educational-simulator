import en from './lang/en.json'
import es from './lang/es.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  typescript: {
    shim: false
  },
  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],
  i18n: {
    locales: [
      {
        name: 'English',
        code: 'en',
        iso: 'en-US',
        emoji: '🇺🇸'
      },
      {
        name: 'Español',
        code: 'es',
        iso: 'es-ES',
        emoji: '🇪🇸'
      },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    vueI18n: {
      legacy: false,
      missingWarn: false,
      messages: {
        en,
        es
      }
    }
  },
  pinia: {
    autoImports: [
      'defineStore',
    ],
  },
  piniaPersistedstate: {
    storage: "localStorage"
  },
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  app: {
    pageTransition: { name: 'slide' },
    layoutTransition: { name: 'fade' }
  },
})
