<script setup lang="ts">
const { t } = useI18n();

const props = defineProps<{
  gitlabHref: string;
}>()

// TODO: use in tutorials, the guide page, preferences (translations)
</script>

<template>
  <v-btn
    :href="props.gitlabHref"
    variant="plain"
    prepend-icon="mdi-code-tags"
    size="small"
  >
    {{ t('edit') }}
  </v-btn>
</template>

<style scoped lang="scss"></style>