<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="simulatorPage">
    <header class="leftColumn">
      <Logo />
      <p class="description">{{ t('home.description') }}</p>
    </header>
    <section class="rightColumn">
      <slot />
    </section>
  </div>
</template>

<style scoped lang="scss">
.simulatorPage {
  display: grid;
  grid-template-columns: .4fr 2fr;
  height: 100vh;

  .leftColumn {
    padding: 48px 62px 36px 62px;

    .description {
      margin-top: 36px;
      margin-bottom: 6vh;
    }
  }

  .rightColumn {
    display: grid;
    place-items: center;
    background-color: #f9f9f9;
    position: relative;
  }
}
</style>