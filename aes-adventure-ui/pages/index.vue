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
