import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const baseColors = {
  primary: '#745CD0',
  'primary-darken-1': '#2C1D66',
  'primary-lighten-1': '#8C75E4',
  secondary: '#D755B9',
  error: '#C34A36',
  info: '#0084DB',
  success: '#67BAA6',
  warning: '#FFC65B'

}

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#f9f9f9',
    surface: '#ffffff',
    opposite: '#0f0a23',
    inverse: '#000000',
    skeleton: '#f0f0f0',
    "off-surface": '#d9d9d9',
    ...baseColors
  }
}

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#17141b',
    surface: '#141217',
    opposite: '#ded6ff',
    inverse: '#ffffff',
    skeleton: '#141317',
    "off-surface": '#745CD0',
    ...baseColors
  }
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: lightTheme,
        dark: darkTheme,
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})