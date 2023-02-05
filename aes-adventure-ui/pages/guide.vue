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
  <div class="guidePage">
    <header class="guideHeader">
      <h4>{{ t('home.guide.title') }}</h4>
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