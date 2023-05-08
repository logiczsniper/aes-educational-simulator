<script setup lang="ts">
import Logo from './Logo.vue';

const { t } = useI18n();
</script>

<template>
  <figure class="thumbnail">
    <img
      src="/infographicNoLogo.png"
      alt="AES infographic"
      class="infographic"
    />
    <div class="logo">
      <Logo />
    </div>
  </figure>

  <a
    class="downloadLink"
    href="/infographic.png"
    download="aes-adventure-infographic.png"
  >
    <v-btn variant="plain">
      {{ t("infographic") }}
    </v-btn>
  </a>
</template>

<style scoped lang="scss">
.thumbnail {
  position: relative;

  .logo {
    position: absolute;
    bottom: 30px;
    right: 14px;
  }

  .infographic {
    width: 34vw;
    max-width: 700px;
  }
}

.downloadLink {
  display: block;
  text-align: right;
  margin-top: 32px;
}
</style>