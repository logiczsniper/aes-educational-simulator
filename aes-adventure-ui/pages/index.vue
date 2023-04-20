<script setup lang="ts">
const { t } = useI18n();
const { locale } = useI18n()

definePageMeta({
  layout: 'landing-page',
  pageTransition: {
    name: 'slide'
  }
})

useHead({
  htmlAttrs: { lang: locale.value ?? 'en' },
  link: [{ rel: 'canonical', href: `https://aes-adventure.web.app/${locale.value ?? 'en'}` }],
  meta: [
    {
      name: 'description',
      content: t('seo.home-description')
    },
    { property: 'og:locale', content: locale.value ?? 'en' },
  ]
})
</script>

<template>
  <div class="homePage">
    <Infographic />
  </div>
</template>

<style scoped lang="scss">
.homePage {
  height: 100vh;
  padding-top: 10%;
}
</style>
