<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="tutorialBody">
    <p v-html="t('simulator.tutorial.key-rounds-header.body')" />
    <p v-html="t('simulator.tutorial.key-rounds-header.aes-a')" />
    <p v-html="t('simulator.tutorial.key-rounds-header.note')" />
  </div>
</template>

<style lang="scss">
.tutorialBody {
  display: grid;
  gap: 14px;
}
</style>