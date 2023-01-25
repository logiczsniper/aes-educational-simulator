<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: 'landing-page'
})
</script>

<template>
  <div class="homePage">
    <Infographic />
  </div>
</template>

<style scoped lang="scss">
.homePage {
  padding: 36px 60px;
  height: 100vh;
}
</style>
