<script setup lang="ts">
const themeName = useThemeName()

const { t } = useI18n()
const i18nHead = useLocaleHead({
  addSeoAttributes: true
})

useHead({
  title: 'AES Adventure',
  meta: [
    { name: 'description', content: t('home.description') },
    ...(i18nHead.value.meta ?? [])
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ...(i18nHead.value.link ?? [])
  ],
  htmlAttrs: {
    ...(i18nHead.value.htmlAttrs ?? {})
  }
})

onMounted(() => {
  themeName.setInitialTheme()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
@use '~/assets/global-font.scss';
@use '~/assets/code-font.scss';
@use '~/assets/math-font.scss';
@use '~/assets/emoji-font.scss';
@use '~/assets/vuetify-overrides.scss';
@use '~/assets/html-overrides.scss';
@use '~/assets/utility-classes.scss';
@use '~/assets/vue-transitions.scss';
@use '~/assets/custom-scrollbar.scss';
@use '~/assets/animation-grid.scss';

body {
  margin: 0;
}
</style>