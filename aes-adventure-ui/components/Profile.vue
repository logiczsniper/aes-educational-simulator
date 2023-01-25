<script setup lang="ts">

const props = defineProps<{
  avatarSrc: string,
  avatarAlt: string,
  name: string,
  role: string,
  email: string
}>()

const emailHref = computed(() => `mailto:${props.email}`)
</script>

<template>
  <div class="profile">
    <img :src="props.avatarSrc" :alt="props.avatarAlt" />
    <h4>{{ props.name }}</h4>
    <small>{{ props.role }}</small>
    <address>
      <small><a :href="emailHref">{{ props.email }}</a></small>
    </address>
  </div>
</template>

<style scoped lang="scss">
.profile {
  display: grid;
  place-items: center;
  gap: 1px;

  img {
    height: 8vw;
    border-radius: 10px;
    margin-bottom: 8px;
  }

  address {
    margin-top: -4px;
  }
}
</style>