<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: 'landing-page',
  pageTransition: {
    name: 'slide'
  }
})
</script>

<template>
  <div class="feedbackPage">
    <header class="feedbackHeader">
      <h4>{{ t('home.feedback.title') }}</h4>
      <NuxtLink to="/">
        <v-btn
          variant="plain"
          icon
        >
          <v-icon
            icon="mdi-close"
            size="20"
          />
        </v-btn>
      </NuxtLink>
    </header>
    <i18n-t
      class="feedbackBody"
      keypath="home.feedback.body"
      tag="p"
    >
      <template v-slot:googleFormLink>
        <a
          target="_blank"
          href="https://forms.gle/YffqgHzLDcPaZum99"
        >
          <v-btn
            size="small"
            variant="plain"
          >
            {{ t("home.feedback.button") }}
            <template #prepend>
              <v-icon
                icon="mdi-open-in-new"
                size="12"
              />
            </template>
          </v-btn>
        </a>
      </template>
    </i18n-t>
    <div class="contributors">
      <Profile
        avatar-src="/logan-avatar.jpg"
        avatar-alt="Logan Czernel headshot"
        name="Logan Czernel"
        role="Developer"
        email="logan.czernel@ucdconnect.ie"
        linkedin="https://www.linkedin.com/in/loganczernel/"
      />
      <Profile
        avatar-src="/felix-avatar.jpg"
        avatar-alt="Félix Balado headshot"
        name="Félix Balado"
        role="Advisor"
        email="felix@ucd.ie"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.feedbackPage {
  width: 100%;
  padding: 36px 60px;
  height: 100vh;

  .feedbackHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;

    a {
      color: #2C1D66;
    }
  }

  .feedbackBody {
    margin-top: 2px;

    .v-btn {
      font-size: 14px;
      height: 20px;
      padding-left: 10px;
      padding-right: 8px;
      margin-top: -2px;
    }
  }

  .contributors {
    display: flex;
    gap: 28px;
    margin-top: 22px;
  }
}
</style>