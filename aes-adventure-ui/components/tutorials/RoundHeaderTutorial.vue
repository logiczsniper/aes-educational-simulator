<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="tutorialBody">
    <p v-html="t('simulator.tutorial.rounds-header.body')" />
  </div>
</template>

<style lang="scss">
.tutorialBody {
  display: grid;
  gap: 14px;
}
</style>