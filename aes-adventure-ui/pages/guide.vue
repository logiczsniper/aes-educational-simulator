<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath()
const { locale } = useI18n()

definePageMeta({
  layout: 'landing-page',
  pageTransition: {
    name: 'slide'
  }
})

useHead({
  titleTemplate: `%s: ${t('seo.guide')}`,
  htmlAttrs: { lang: locale.value ?? 'en' },
  link: [{ rel: 'canonical', href: `https://aes-adventure.web.app/${locale.value ?? 'en'}/guide` }],
  meta: [
    {
      name: 'description',
      content: t('seo.guide-description')
    },
    { property: 'og:locale', content: locale.value ?? 'en' },
  ]
})
</script>

<template>
  <div class="guidePage">
    <header class="guideHeader">
      <h4>{{ t('home.guide.title') }}</h4>
      <NuxtLink :to="localePath('/')">
        <v-btn
          variant="plain"
          icon
        >
          <v-icon
            icon="mdi-close"
            size="20"
          />
        </v-btn>
      </NuxtLink>
    </header>
    <p>TODO: when tool is actually done. Some ideas: 100% height but scrollable, use fragments for headers, maybe even
      have GIFs or other complementary images that can be collapsed/hidden/revealed. Table of contents? Good luck future
      Logan</p>
  </div>
</template>

<style scoped lang="scss">
.guidePage {
  width: 100%;
  padding: 36px 60px;
  height: 100vh;

  .guideHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;

    a {
      color: #2C1D66;
    }
  }
}
</style>