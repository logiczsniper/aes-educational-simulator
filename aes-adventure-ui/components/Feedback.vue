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

  <i18n-t class="feedbackBody" keypath="home.feedback.body" tag="p">
    <template v-slot:googleFormLink>
      <a target="_blank" href="https://forms.gle/YffqgHzLDcPaZum99">
        <v-btn size="small" variant="plain">{{
          t("home.feedback.button")
        }}
          <template #prepend>
            <v-icon icon="mdi-open-in-new" size="12" />
          </template>
        </v-btn>
      </a>
    </template>
  </i18n-t>
  <p class="contact">{{ t('home.feedback.contact') }}</p>
  <div class="contributors">
    <Profile avatar-src="/logan-avatar.jpg" avatar-alt="Logan Czernel headshot" name="Logan Czernel" role="Developer"
      email="logan.czernel@ucdconnect.ie" linkedin="https://www.linkedin.com/in/loganczernel/" />
    <Profile avatar-src="/felix-avatar.jpg" avatar-alt="Félix Balado headshot" name="Félix Balado" role="Advisor"
      email="felix@ucd.ie" />
  </div>
</template>

<style scoped lang="scss">
.feedbackBody {
  margin-top: 2px;

  .v-btn {
    font-size: 14px;
    height: 20px;
    padding-left: 10px;
    padding-right: 8px;
  }
}

.contributors {
  display: flex;
  // flex-direction: column;
  gap: 28px;
  margin-top: 22px;
}
</style>