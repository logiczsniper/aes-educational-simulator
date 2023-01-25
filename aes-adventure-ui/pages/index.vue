<script setup lang="ts">
const { t } = useI18n();

enum Tab {
  None, Settings, Guide, Feedback
}
const currentTab = ref(Tab.None);
const goToTab = (tab: Tab) => currentTab.value = tab;
const closeTab = () => currentTab.value = Tab.None;
</script>

<template>
  <div class="homePage">
    <header class="leftColumn">
      <Logo big />
      <p class="description">{{ t('home.description') }}</p>
      <nav class="navMenu">
        <NuxtLink to="/simulator">
          <v-btn class="goButton" variant="flat" color="primary">{{
            t('home.go')
          }}</v-btn>
          <v-btn class="configureButton" variant="outlined" color="primary-lighten-1">{{
            t('home.configure')
          }}</v-btn>
        </NuxtLink>
        <v-btn prependIcon="mdi-cog" variant="plain" color="primary-darken-1" @click="goToTab(Tab.Settings)">{{
          t('home.settings.title')
        }}</v-btn>
        <v-btn prependIcon="mdi-map" variant="plain" color="primary-darken-1" @click="goToTab(Tab.Guide)">{{
          t('home.guide.title')
        }}</v-btn>
        <v-btn prependIcon="mdi-comment-quote" variant="plain" color="primary-darken-1"
          @click="goToTab(Tab.Feedback)">{{
            t('home.feedback.title')
          }}</v-btn>
        <v-btn prependIcon="mdi-code-tags" variant="plain" color="primary-darken-1" disabled>{{
          t('home.gitlab')
        }}</v-btn>
      </nav>
    </header>

    <section class="rightColumn">
      <transition name="slide">
        <div v-if="currentTab === Tab.None">
          <Infographic />
        </div>
        <div v-else-if="currentTab === Tab.Settings" class="subPage">
          <Settings @close="closeTab" />
        </div>
        <div v-else-if="currentTab === Tab.Guide" class="subPage">
          <Guide @close="closeTab" />
        </div>
        <div v-else-if="currentTab === Tab.Feedback" class="subPage">
          <Feedback @close="closeTab" />
        </div>
      </transition>
    </section>
  </div>
</template>

<style scoped lang="scss">
.homePage {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .leftColumn {
    padding: 48px 62px 36px 62px;

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

    $primaryButtonMarginBottom: 18px;

    .goButton {
      margin-bottom: $primaryButtonMarginBottom;
    }

    .configureButton {
      margin-bottom: $primaryButtonMarginBottom;
      margin-left: 8px;
    }
  }

  .rightColumn {
    display: grid;
    place-items: center;
    background-color: #f9f9f9;
    position: relative;
    overflow: hidden;

    &>div {
      padding: 36px 60px;
      height: 100vh;
    }

    .subPage {
      width: 100%;
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease-out;
}

.slide-enter-to {
  position: absolute;
  top: 0;
}

.slide-enter-from {
  position: absolute;
  top: -100%;
}

.slide-leave-to {
  position: absolute;
  top: -100%;
}

.slide-leave-from {
  position: absolute;
  top: 0;
}
</style>