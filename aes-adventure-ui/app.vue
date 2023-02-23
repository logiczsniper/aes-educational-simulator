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
@use '~/assets/global-font.scss';
@use '~/assets/code-font.scss';
@use '~/assets/emoji-font.scss';
@use '~/assets/vuetify-overrides.scss';
@use '~/assets/html-overrides.scss';
@use '~/assets/utility-classes.scss';
@use '~/assets/vue-transitions.scss';
@use '~/assets/custom-scrollbar.scss';

body {
  margin: 0;
}
</style>