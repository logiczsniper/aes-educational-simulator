<script setup lang="ts">

useHead({
  title: 'AES Adventure',
  meta: [
    { name: 'description', content: 'The Advanced Encryption Standard is the most popular symmetric-key cipher. If you want to learn the basics, dig deep into the details, or experiment with AES: you\'re in the right place!' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
// Setting global font:
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

// Adding an emoji font for flag support:
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');

.emoji {
  font-family: 'Noto Color Emoji', sans-serif;
}

.highlight {
  background-color: #8b75e49b;
  border-radius: 2px;
  padding: 1px 3px;
  margin: 0px 2px;

  @media (min-width: 1200px) {
    white-space: nowrap;
  }
}

// Nuxt corrections:
body {
  margin: 0;
}

// Vuetify corrections:
html {
  overflow: auto;
}

p {
  font-size: 14px;
  line-height: 20px;
}

.v-btn {
  text-transform: unset;
  letter-spacing: unset;
}

.v-toolbar-title {
  font-weight: 500;
  font-size: 1.1rem;
}

.v-field {
  box-shadow: none;
}

.v-dialog-fixed {
  border-radius: 8px;
  overflow: clip;

  * {
    letter-spacing: 0;
  }
}

// HTML defaults corrections:
a:-webkit-any-link {
  text-decoration: unset;
}

a:-webkit-any-link:active {
  color: #2C1D66;
}

::-webkit-resizer {
  background-color: transparent;
}

address {
  display: unset;
}

// TODO: temporary until source code can be made available.
.v-btn--disabled:disabled {
  cursor: not-allowed !important;
  pointer-events: all !important;
}

// Skeleton shimmer
.skeleton {
  display: inline-block;
  height: 1em;
  position: relative;
  overflow: hidden;
  background-color: #f0f0f0;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg,
        rgba(#fff, 0) 0,
        rgba(#fff, 0.2) 20%,
        rgba(#fff, 0.5) 60%,
        rgba(#fff, 0));
    animation: shimmer 2s infinite;
    content: '';
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}

.flipped {
  transform: scaleX(-1);
  -moz-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  -ms-transform: scaleX(-1);
}

// Vue 3 'slide' transition
.slide-enter-active,
.slide-leave-active {
  transition: all .5s ease-out;
}

.slide-enter-to,
.slide-leave-from {
  position: absolute;
  top: 0;
}

.slide-enter-from,
.slide-leave-to {
  position: absolute;
  top: -100%;
}

// Vue 3 'fade' transition
.fade-leave-active {
  transition: all .5s ease-out;
}

.fade-enter-active {
  transition: all .5s ease-out .5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

// .test-enter-active,
// .test-leave-active {
//   transition: all 2s ease-out !important;
// }

.test-enter-active.simulatorPage,
.test-leave-active.landingPage {
  transition: grid-template-columns 1.5s ease-in-out 0.5s;

  .description,
  .navMenu,
  .rightColumn>* {
    transition: opacity .5s ease-in-out;
  }
}

.test-enter-active.landingPage,
.test-leave-active.simulatorPage {
  transition: grid-template-columns .5s ease-in-out 0s, top .5s ease-in-out .5s;
}

.test-enter-from.simulatorPage {
  grid-template-columns: 1fr 1fr !important;
  opacity: 0 !important;
}

.test-enter-from.landingPage {
  grid-template-columns: .4fr 2fr !important;
}

.test-enter-to,
.test-leave-from {
  opacity: 1;
}

.test-enter-from {
  opacity: 0 !important;
}

.test-leave-to.landingPage {
  grid-template-columns: .2fr 4fr !important;

  .description,
  .navMenu,
  .rightColumn>* {
    opacity: 0;
  }

  .logo {
    grid-template-columns: 30px auto !important;
    gap: 8px;
    position: fixed !important;

    .title {
      font-size: 14px !important;
    }
  }
}

.test-leave-to.simulatorPage {}
</style>