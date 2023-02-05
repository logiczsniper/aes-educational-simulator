<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: 'landing-page',
  pageTransition: {
    name: 'slide'
  }
})
</script>

<template>
  <div class="settingsPage">
    <header class="settingsHeader">
      <h4>{{ t('home.settings.title') }}</h4>
      <NuxtLink to="/">
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

    a {
      color: #2C1D66;
    }
  }
}
</style>