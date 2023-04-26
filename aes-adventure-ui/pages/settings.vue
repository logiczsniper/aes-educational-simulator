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
  titleTemplate: `%s: ${t('seo.settings')}`,
  htmlAttrs: { lang: locale.value ?? 'en' },
  link: [{ rel: 'canonical', href: `https://aes-adventure.web.app/${locale.value ?? 'en'}/settings` }],
  meta: [
    {
      name: 'description',
      content: t('seo.settings-description')
    },
    { property: 'og:locale', content: locale.value ?? 'en' },
  ]
})
</script>

<template>
  <div class="settingsPage">
    <header class="settingsHeader">
      <h2>{{ t('home.settings.title') }}</h2>
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
    <LanguageSelect />
  </div>
</template>

<style scoped lang="scss">
.settingsPage {
  width: 100%;
  padding: 36px 60px;
  height: 100vh;

  .settingsHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    a {
      color: #2C1D66;
    }
  }
}
</style>