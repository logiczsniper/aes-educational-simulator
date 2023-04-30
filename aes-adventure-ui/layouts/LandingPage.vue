<script setup lang="ts">
const { t } = useI18n();
const themeName = useThemeName();
const localePath = useLocalePath()

const plainButtonColor = computed(() => themeName.name === ThemeName.Dark ? 'primary' : 'primary-darken-1')

const simulatorTabs = useSimulatorTabs()
</script>

<template>
  <div class="landingPage">
    <header class="leftColumn">
      <Logo big />
      <p class="description">{{ t('home.description') }}</p>
      <nav class="navMenu">
        <div class="primaryButtons">
          <NuxtLink :to="localePath(simulatorTabs.getTabLink())">
            <v-btn
              variant="flat"
              color="primary"
            >
              {{ t('home.go') }}
            </v-btn>
          </NuxtLink>
          <ConfigButton />
        </div>
        <NuxtLink :to="localePath('/guide')">
          <v-btn
            prependIcon="mdi-map"
            variant="plain"
            :color="plainButtonColor"
          >
            {{ t('home.guide.title') }}
          </v-btn>
        </NuxtLink>
        <NuxtLink :to="localePath('/settings')">
          <v-btn
            prependIcon="mdi-cog"
            variant="plain"
            :color="plainButtonColor"
          >
            {{ t('home.settings.title') }}
          </v-btn>
        </NuxtLink>
        <NuxtLink :to="localePath('/feedback')">
          <v-btn
            prependIcon="mdi-comment-quote"
            variant="plain"
            :color="plainButtonColor"
          >
            {{ t('home.feedback.title') }}
          </v-btn>
        </NuxtLink>
        <v-btn
          prependIcon="mdi-code-tags"
          variant="plain"
          :color="plainButtonColor"
          disabled
        >
          {{ t('home.gitlab') }}
        </v-btn>
      </nav>
    </header>
    <section class="rightColumn">
      <slot />
    </section>
  </div>
</template>

<style scoped lang="scss">
.landingPage {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .leftColumn {
    padding: 48px 62px 36px 62px;
    background-color: rgb(var(--v-theme-surface));

    .description {
      margin-top: 36px;
      margin-bottom: 6vh;
    }

    .navMenu {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
    }

    .primaryButtons {
      display: flex;
      gap: 8px;
      margin-bottom: 18px;
    }
  }

  .rightColumn {
    display: grid;
    place-items: center;
    background-color: rgb(var(--v-theme-background));
    position: relative;
  }
}
</style>