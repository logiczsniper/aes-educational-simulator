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
  <NuxtPage />
</template>

<style lang="scss">
// Setting global font:
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

* {
  font-family: 'Inter', sans-serif;
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
  margin: 0 !important;
}

// HTML defaults corrections:
a:-webkit-any-link {
  text-decoration: unset;
}

a:-webkit-any-link:active {
  color: #2C1D66;
}

// TODO: temporary until source code can be made available.
.v-btn--disabled:disabled {
  cursor: not-allowed !important;
  pointer-events: all !important;
}

address {
  display: unset;
}
</style>