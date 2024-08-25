<script setup lang="ts">
import anime from "animejs";

const { t } = useI18n();
const localePath = useLocalePath()

const props = defineProps<{
  big?: boolean;
}>()

const imageClass = `logo__${props.big ? 'big' : 'small'}`
const imageSize = computed(() => props.big ? 100 : 30)
const imageTarget = `.${imageClass}`

const clickCount = ref(0)

const onClick = () => {
  if (!props.big) return

  clickCount.value += 1
  const celebrate = clickCount.value % 10 === 0
  const easterEggModifier = celebrate ? 2 : 1

  anime({
    targets: imageTarget,
    rotate: 360 * easterEggModifier,
    scale: 1.01 * easterEggModifier,
    duration: 400,
    easing: 'easeInOutQuad',
  }).finished.then(() => {
    const messages = [
      "Think this is a fun easter egg?",
      "Wow you really enjoy clicking this, don't you?",
      "Still going, huh?",
      "Wondering when these messages will stop?",
      "A long time, is the answer.",
      "I can write these all day long.",
      "The force is strong with this one.",
      "You are a person of focus, commitment, sheer will... something I know very little about.",
      "You're a wizard, Harry!",
      "Perfectly balanced...",
      "You know, I'm something of a scientist myself.",
      "Alright that's enough, this is the last message.",
      "Now that the weak-willed AES Adventure users are gone...",
      "Congrats, you made it! You clicked this logo 140 times. It is late. I must rest. Thank you."
    ]
    const message = messages.at(Math.round(clickCount.value / 10) - 1)
    if (celebrate && message) alert(message)
  })
}

onMounted(() => {
  if (!props.big) return

  anime({
    targets: imageTarget,
    keyframes: [{
      translateY: () => anime.random(2, 3) * 0.8,
      rotateZ: () => anime.random(1, 2) * 0.5,
      rotateX: () => anime.random(5, 10),
      rotateY: () => anime.random(5, 10)
    }, {
      translateY: () => -anime.random(2, 3) * 0.8,
      rotateZ: () => -anime.random(1, 2) * 0.5,
      rotateX: () => -anime.random(5, 10),
      rotateY: () => -anime.random(5, 10)
    }],
    duration: 3000,
    loop: true,
    direction: 'alternate',
    easing: 'easeInOutSine',
  })
})
</script>

<template>
  <NuxtLink :to="localePath('/')">
    <header
      class="logo"
      :class="{ 'big': props.big }"
    >
      <div
        style="display: inherit;"
        :class="imageClass"
        @click="onClick"
      >
        <img
          src="/logo.svg"
          :width="imageSize"
          :height="imageSize"
          alt="AES Adventure logo"
        />
      </div>
      <h1
        class="title"
        :class="{ 'big': props.big }"
      >
        AES<br />{{ t('title') }}
      </h1>
    </header>
  </NuxtLink>
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

    background: -webkit-linear-gradient(#2C1D66, rgb(var(--v-theme-opposite)));
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