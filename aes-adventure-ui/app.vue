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
@import url('~/assets/global-font.scss');
@import url('~/assets/emoji-font.scss');
@import url('~/assets/vuetify-overrides.scss');
@import url('~/assets/html-overrides.scss');
@import url('~/assets/utility-classes.scss');
@import url('~/assets/vue-transitions.scss');

body {
  margin: 0;
}
</style>