<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: 'simulator-page',
  pageTransition: {
    name: 'slide-left',
  }
})
</script>

<template>
  <main class="keyExpansionPage">
    keyExpansion
  </main>
</template>

<style scoped lang="scss">
.keyExpansionPage {
  // width: 100%;
  height: 100%;
  background-color: pink;
}
</style>