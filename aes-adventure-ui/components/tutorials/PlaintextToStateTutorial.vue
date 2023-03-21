<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div>
    <p v-html="t('simulator.tutorial.encryption.plaintext-to-state.body')" />
  </div>
</template>