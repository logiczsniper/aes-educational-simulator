<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath()

definePageMeta({
  layout: 'landing-page',
  pageTransition: {
    name: 'slide'
  }
})

useHead({
  titleTemplate: `%s: ${t('seo.preferences')}`,
  meta: [
    {
      name: 'description',
      content: t('seo.preferences-description')
    }
  ]
})
</script>

<template>
  <div class="preferencesPage">
    <header class="preferencesHeader">
      <h2>{{ t('home.preferences.title') }}</h2>
      <NuxtLink
        :to="localePath('/')"
        aria-label="Close preferences link."
      >
        <v-btn
          variant="plain"
          icon
          aria-label="Close preferences button."
        >
          <v-icon
            icon="mdi-close"
            size="20"
          />
        </v-btn>
      </NuxtLink>
    </header>
    <LanguageSelect />
    <ThemeToggle />
  </div>
</template>

<style scoped lang="scss">
.preferencesPage {
  width: 100%;
  padding: 36px 60px;
  height: 100vh;

  .preferencesHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    a {
      color: rgb(var(--v-theme-opposite));
    }
  }
}
</style>