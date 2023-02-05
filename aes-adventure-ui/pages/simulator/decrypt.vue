<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: 'simulator-page',
  pageTransition: {
    name: 'slide-left',
  },
  middleware(to, from) {
    if (typeof (to.meta.pageTransition) == 'object') {
      console.log(to, from)
      to.meta.pageTransition.name = from.name?.toString().includes('encrypt') ? 'slide-left' : 'slide-right'
    }
  }
})
</script>

<template>
  <main class="decryptPage">
    decrypt
  </main>
</template>

<style scoped lang="scss">
.decryptPage {
  // width: 100%;
  height: 100%;
  background-color: red;
}
</style>