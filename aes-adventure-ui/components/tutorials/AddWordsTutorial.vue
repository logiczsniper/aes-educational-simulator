<script setup lang="ts">

const { t } = useI18n();

const copyInput = (input: Uint8Array) => Uint8Array.from(input)
</script>

<template>
  <div class="tutorialBody">
    <p v-html="t('simulator.tutorial.add-words.body')" />
    <p v-html="t('simulator.tutorial.add-words.note')" />
  </div>
</template>

<style lang="scss">
.tutorialBody {
  display: grid;
  gap: 14px;
}
</style>