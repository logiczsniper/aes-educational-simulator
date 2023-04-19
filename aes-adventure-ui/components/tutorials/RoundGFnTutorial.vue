<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="tutorialBody">
    <p v-html="t('simulator.tutorial.round-g-fn.body')" />
    <TutorialsCommonLearnMore :links="[
      { label: t('simulator.tutorial.round-g-fn.learn-more.rcon'), href: 'https://en.wikipedia.org/wiki/AES_key_schedule#Round_constants' },
    ]" />
  </div>
</template>

<style lang="scss">
.tutorialBody {
  display: grid;
  gap: 14px;
}
</style>