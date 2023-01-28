<script setup lang="ts">
const { t } = useI18n();

</script>

<template>
  <div class="landingPage">
    <header class="leftColumn">
      <Logo big />
      <p class="description">{{ t('home.description') }}</p>
      <nav class="navMenu">

        <div class="primaryButtons">
          <NuxtLink to="/simulator">
            <v-btn class="goButton" variant="flat" color="primary">{{
              t('home.go')
            }}</v-btn>
          </NuxtLink>
          <ConfigSelect />
        </div>
        <NuxtLink to="/settings">
          <v-btn prependIcon="mdi-cog" variant="plain" color="primary-darken-1">{{
            t('home.settings.title')
          }}</v-btn>
        </NuxtLink>
        <NuxtLink to="/guide">
          <v-btn prependIcon="mdi-map" variant="plain" color="primary-darken-1">{{
            t('home.guide.title')
          }}</v-btn>
        </NuxtLink>
        <NuxtLink to="/feedback">
          <v-btn prependIcon="mdi-comment-quote" variant="plain" color="primary-darken-1">{{
            t('home.feedback.title')
          }}</v-btn>
        </NuxtLink>
        <v-btn prependIcon="mdi-code-tags" variant="plain" color="primary-darken-1" disabled>{{
          t('home.gitlab')
        }}</v-btn>
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
    background-color: #f9f9f9;
    position: relative;
    overflow: hidden;
  }
}
</style>