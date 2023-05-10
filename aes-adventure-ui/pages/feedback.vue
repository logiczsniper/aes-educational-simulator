<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath()

definePageMeta({
  layout: 'landing-page',
  pageTransition: {
    name: 'slide'
  }
})

useHead({
  titleTemplate: `%s: ${t('seo.feedback')}`,
  meta: [
    {
      name: 'description',
      content: t('seo.feedback-description')
    }
  ]
})
</script>

<template>
  <div class="feedbackPage">
    <header class="feedbackHeader">
      <h2>{{ t('home.feedback.title') }}</h2>
      <NuxtLink
        :to="localePath('/')"
        aria-label="Close feedback link."
      >
        <v-btn
          variant="plain"
          icon
          aria-label="Close feedback button."
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
          rel="external"
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
    margin-bottom: 12px;

    a {
      color: rgb(var(--v-theme-opposite));
    }
  }

  .feedbackBody {
    .v-btn {
      font-size: 14px;
      height: 18px;
      padding-left: 10px;
      padding-right: 6px;
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