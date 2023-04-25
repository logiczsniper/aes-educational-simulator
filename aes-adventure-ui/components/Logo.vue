<script setup lang="ts">
import anime from "animejs";

const { t } = useI18n();

const props = defineProps<{
  big?: boolean;
}>()

const imageClass = `logo__${props.big ? 'big' : 'small'}`
const imageTarget = `.${imageClass}`

const onClick = () => {
  anime({
    targets: imageTarget,
    rotate: 360,
    duration: 400,
    easing: 'easeInOutQuad',
  })
}

onMounted(() => {
  if (!props.big) return

  anime({
    targets: imageTarget,
    keyframes: [{
      translateY: () => anime.random(2, 3),
      rotate: () => anime.random(1, 2) * 0.5
    }, {
      translateY: () => -anime.random(2, 3),
      rotate: () => -anime.random(1, 2) * 0.5
    }],
    duration: 3000,
    loop: true,
    direction: 'alternate',
    easing: 'easeInOutSine',
  })
})
</script>

<template>
  <header
    class="logo"
    :class="{ 'big': props.big }"
  >
    <img
      src="/logo.svg"
      alt="AES Adventure logo"
      :class="imageClass"
      @click="onClick"
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