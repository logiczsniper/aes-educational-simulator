import { useTheme } from 'vuetify';

export enum ThemeName {
  Light = 'light',
  Dark = 'dark',
}

export const useThemeName = defineStore(getKey`theme`, () => {
  const name = ref<ThemeName>(ThemeName.Light);
  const theme = useTheme()

  const flip = () => {
    name.value = name.value === ThemeName.Light ? ThemeName.Dark : ThemeName.Light;
    theme.global.name.value = name.value
  }

  const setInitialTheme = () => {
    theme.global.name.value = name.value
  }

  return {
    name,
    flip,
    setInitialTheme
  }
}, {
  persist: true
})