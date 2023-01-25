<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: 'landing-page'
})
</script>

<template>
  <div class="settingsPage">
    <v-toolbar color="transparent" :title="t('home.settings.title')">
      <NuxtLink to="/">
        <v-btn variant="plain" icon>
          <v-icon icon="mdi-close" size="20" />
        </v-btn>
      </NuxtLink>
    </v-toolbar>
  </div>
</template>

<style scoped lang="scss">
.settingsPage {
  width: 100%;
  padding: 36px 60px;
  height: 100vh;
}
</style>