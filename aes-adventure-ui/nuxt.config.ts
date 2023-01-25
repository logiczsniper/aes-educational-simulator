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
  ],
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    vueI18n: {
      legacy: false,
      missingWarn: false,
      messages: {
        en,
        es
      }
    }
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
    // layoutTransition: { name: 'slide', mode: 'out-in' }
  },
})
