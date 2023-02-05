<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: 'simulator-page',
  pageTransition: {
    name: 'slide-right',
  }
})
</script>

<template>
  <main class="encryptPage">
    Encrypt
  </main>
</template>

<style scoped lang="scss">
.encryptPage {
  // width: 100%;
  height: 100%;

  background-color: green;
}
</style>