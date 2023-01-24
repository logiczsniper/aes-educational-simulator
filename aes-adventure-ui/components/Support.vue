<script setup lang="ts">
const { t } = useI18n();

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <v-toolbar color="transparent" :title="t('home.support.title')">
    <v-btn variant="plain" icon @click="emit('close')">
      <v-icon icon="mdi-close" size="20" />
    </v-btn>
  </v-toolbar>
  <p></p>
</template>

<style scoped lang="scss">

</style>