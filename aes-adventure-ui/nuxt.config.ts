import ar from './lang/ar.json'
import cs from './lang/cs.json'
import cy from './lang/cy.json'
import da from './lang/da.json'
import de from './lang/de.json'
import el from './lang/el.json'
import en from './lang/en.json'
import es from './lang/es.json'
import fi from './lang/fi.json'
import fr from './lang/fr.json'
import gd from './lang/gd.json'
import hi from './lang/hi.json'
import hr from './lang/hr.json'
import hu from './lang/hu.json'
import id from './lang/id.json'
import it from './lang/it.json'
import ja from './lang/ja.json'
import ko from './lang/ko.json'
import lt from './lang/lt.json'
import mn from './lang/mn.json'
import ms from './lang/ms.json'
import nl from './lang/nl.json'
import pl from './lang/pl.json'
import pt from './lang/pt.json'
import ro from './lang/ro.json'
import ru from './lang/ru.json'
import sl from './lang/sl.json'
import so from './lang/so.json'
import sv from './lang/sv.json'
import th from './lang/th.json'
import tr from './lang/tr.json'
import uk from './lang/uk.json'
import vi from './lang/vi.json'
import zh from './lang/zh.json'


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
      {
        name: 'Cymraeg',
        code: 'cy',
        iso: 'cy',
        emoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿'
      },
      {
        name: 'Україна',
        code: 'uk',
        iso: 'uk',
        emoji: '🇺🇦'
      },
      {
        name: 'svenska',
        code: 'sv',
        iso: 'sv-se',
        emoji: '🇸🇪'
      },
      {
        name: 'Soomaali',
        code: 'so',
        iso: 'so',
        emoji: '🇸🇴'
      },
      {
        name: 'Slovenščina',
        code: 'sl',
        iso: 'sl',
        emoji: '🇸🇮'
      },
      {
        name: 'Română',
        code: 'ro',
        iso: 'ro',
        emoji: '🇷🇴'
      },
      {
        name: 'Монгол',
        code: 'mn',
        iso: 'mn',
        emoji: '🇲🇳'
      },
      {
        name: 'Melayu',
        code: 'ms',
        iso: 'ms-my',
        emoji: '🇲🇾'
      },
      {
        name: 'lietuvių',
        code: 'lt',
        iso: 'lt',
        emoji: '🇱🇹'
      },
      {
        name: 'Magyar',
        code: 'hu',
        iso: 'hu',
        emoji: '🇭🇺'
      },
      {
        name: 'Ελληνικά',
        code: 'el',
        iso: 'el',
        emoji: '🇬🇷'
      },
      {
        name: 'Suomalainen',
        code: 'fi',
        iso: 'fi',
        emoji: '🇫🇮'
      },
      {
        name: 'dansk',
        code: 'da',
        iso: 'da',
        emoji: '🇩🇰'
      },
      {
        name: 'čeština',
        code: 'cs',
        iso: 'cs',
        emoji: '🇨🇿'
      },
      {
        name: 'Hrvatski',
        code: 'hr',
        iso: 'hr',
        emoji: '🇭🇷'
      },
      {
        name: 'Nederlands',
        code: 'nl',
        iso: 'nl-nl',
        emoji: '🇳🇱'
      },
      {
        name: 'Gaeilge',
        code: 'gd',
        iso: 'gd-ie',
        emoji: '🇮🇪'
      },
      {
        name: 'Polski',
        code: 'pl',
        iso: 'pl',
        emoji: '🇵🇱'
      },
      {
        name: 'แบบไทย',
        code: 'th',
        iso: 'th',
        emoji: '🇹🇭'
      },
      {
        name: 'Italiano',
        code: 'it',
        iso: 'it-it',
        emoji: '🇮🇹'
      },
      {
        name: 'Tiếng Việt',
        code: 'vi',
        iso: 'vi',
        emoji: '🇻🇳'
      },
      {
        name: 'Türkçe',
        code: 'tr',
        iso: 'tr',
        emoji: '🇹🇷'
      },
      {
        name: '日本',
        code: 'ja',
        iso: 'ja',
        emoji: '🇯🇵'
      },
      {
        name: 'Deutsch',
        code: 'de',
        iso: 'de-de',
        emoji: '🇩🇪'
      },
      {
        name: 'bahasa Indonesia',
        code: 'id',
        iso: 'id',
        emoji: '🇮🇩'
      },
      {
        name: 'Português',
        code: 'pt',
        iso: 'pt-pt',
        emoji: '🇵🇹'
      },
      {
        name: 'Русский',
        code: 'ru',
        iso: 'ru',
        emoji: '🇷🇺'
      },
      {
        name: 'عربي',
        code: 'ar',
        iso: 'ar-eg',
        emoji: '🇪🇬'
      },
      {
        name: 'Français',
        code: 'fr',
        iso: 'fr-fr',
        emoji: '🇫🇷'
      },
      {
        name: 'हिंदी',
        code: 'hi',
        iso: 'hi',
        emoji: '🇮🇳'
      },
      {
        name: '中国人',
        code: 'zh',
        iso: 'zh-cn',
        emoji: '🇨🇳'
      },
    ],
    defaultLocale: 'en',
    vueI18n: {
      legacy: false,
      missingWarn: false,
      messages: {
        en,
        es,
        cy,
        uk,
        sv,
        so,
        sl,
        ro,
        mn,
        ms,
        lt,
        hu,
        el,
        fi,
        da,
        cs,
        hr,
        nl,
        gd,
        pl,
        th,
        it,
        ko,
        vi,
        tr,
        ja,
        de,
        id,
        pt,
        ru,
        ar,
        fr,
        hi,
        zh
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
    layoutTransition: { name: 'fade' },
    head: {
      meta: [
        { property: 'og:title', content: 'The Intuitive AES Simulator' },
        { property: 'og:description', content: 'The Advanced Encryption Standard is the most popular symmetric-key cipher. Use AES Adventure to learn the basics, dig deep into the details, or experiment with AES.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://aes-adventure.web.app' },
        { property: 'og:image', content: 'https://aes-adventure.web.app/banner.png' },
      ]
    }
  },
})
