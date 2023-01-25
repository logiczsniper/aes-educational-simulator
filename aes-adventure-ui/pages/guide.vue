<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: 'landing-page'
})
</script>

<template>
  <div class="guidePage">
    <v-toolbar color="transparent" :title="t('home.guide.title')">
      <NuxtLink to="/">
        <v-btn variant="plain" icon>
          <v-icon icon="mdi-close" size="20" />
        </v-btn>
      </NuxtLink>
    </v-toolbar>
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
}
</style>