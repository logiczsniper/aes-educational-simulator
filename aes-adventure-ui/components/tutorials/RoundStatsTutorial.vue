<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="tutorialBody">
    <p v-html="t('simulator.tutorial.rounds-stats.diffusion')" />
    <p v-html="t('simulator.tutorial.rounds-stats.confusion')" />
    <TutorialsCommonLearnMore :links="[
      { label: t('simulator.tutorial.rounds-stats.learn-more.conf-diff'), href: 'http://www.cs.sjsu.edu/~stamp/CS265/SecurityEngineering/chapter5_SE/conAndDiff.html' },
      { label: t('simulator.tutorial.rounds-stats.learn-more.avalanche'), href: 'https://www.educative.io/answers/what-is-the-avalanche-effect' }
    ]" />
  </div>
</template>

<style lang="scss">
.tutorialBody {
  display: grid;
  gap: 14px;
}
</style>