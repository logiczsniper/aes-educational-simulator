<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: 'simulator-page',
  pageTransition: {
    name: 'slide-right',
  }
})

const encryptState = useEncryptState();
</script>

<template>
  <main class="encryptPage">
    Encrypt
    <TutorialIconButton :tutorial-key="TutorialKey.Test" />
    <TutorialIconButton :tutorial-key="TutorialKey.Default" />

    <ClientOnly>
      <BinaryInputArea
        v-model="encryptState.plaintext"
        title-key="Plaintext"
      />
    </ClientOnly>
  </main>
</template>

<style scoped lang="scss">
.encryptPage {
  // width: 100%;
  height: 100%;

  // background-color: green;
}
</style>