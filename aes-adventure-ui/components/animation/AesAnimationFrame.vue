<script setup lang="ts">

</script>

<template>
  <section class="aesAnimationFrame">
    <ClientOnly>
      <slot />
      <template #fallback>
        Loading animation
      </template>
    </ClientOnly>
  </section>
</template>

<style lang="scss">
.aesAnimationFrame {
  position: relative;
  padding: 20px;
}
</style>