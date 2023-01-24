<script setup lang="ts">
const { t } = useI18n();

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <v-toolbar color="transparent" :title="t('home.feedback.title')">
    <v-btn variant="plain" icon @click="emit('close')">
      <v-icon icon="mdi-close" size="20" />
    </v-btn>
  </v-toolbar>
  <p class="feedbackBody">{{ t('home.feedback.body') }}</p>
  <a target="_blank" href="https://forms.gle/YffqgHzLDcPaZum99">
    <v-btn prepend-icon="mdi-open-in-new" variant="plain">{{
      t("home.feedback.button")
    }}
    </v-btn>
  </a>
</template>

<style scoped lang="scss">
.feedbackBody {
  margin-top: 2px;
  margin-bottom: 28px;
}
</style>