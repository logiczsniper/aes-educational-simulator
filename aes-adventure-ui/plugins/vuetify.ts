import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const baseColors = {
  primary: '#745CD0',
  'primary-darken-1': '#2C1D66',
  'primary-lighten-1': '#8C75E4',
  secondary: '#D755B9',
  error: '#CC3933',
  info: '#0084DB',
  success: '#67BAA6',
  warning: '#FFC65B'

}

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#f7f7f7',
    surface: '#ffffff',
    ...baseColors
  }
}

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#494454',
    surface: '#000000',
    ...baseColors
  }
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      themes: {
        light: lightTheme,
        dark: darkTheme,
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})