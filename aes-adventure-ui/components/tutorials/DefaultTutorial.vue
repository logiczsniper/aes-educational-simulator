<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div>
    <i18n-t
      keypath="simulator.tutorial.description"
      tag="p"
    >
      <template v-slot:tutorialIcon>
        <TutorialIconButton />
      </template>
    </i18n-t>
    <br />
    <p v-html="t('simulator.tutorial.tip')" />
  </div>
</template>