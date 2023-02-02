<script setup lang="ts">
const { t } = useI18n();

const props = defineProps<{
  big?: boolean;
}>()
</script>

<template>
  <header
    class="logo"
    :class="{ 'big': props.big }"
  >
    <img
      src="/logo.svg"
      alt="AES Adventure logo"
    />
    <h1
      class="title"
      :class="{ 'big': props.big }"
    >
      AES<br />{{ t('title') }}
    </h1>
  </header>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&display=swap');

.logo {
  display: grid;
  align-items: center;
  grid-template-rows: min-content;
  transition: all 2s ease-in-out;

  grid-template-columns: 30px auto;
  gap: 8px;

  &.big {
    grid-template-columns: 100px auto;
    gap: 14px;
  }

  .title {
    font-family: 'Manrope';
    line-height: 1;
    font-weight: 800;
    transition: inherit;

    background: -webkit-linear-gradient(#2C1D66, #0f0a23);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;

    font-size: 14px;

    &.big {
      font-size: 48px;
    }
  }
}
</style>