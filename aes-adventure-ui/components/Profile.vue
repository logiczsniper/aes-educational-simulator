<script setup lang="ts">

const props = defineProps<{
  avatarSrc: string,
  avatarAlt: string,
  name: string,
  role: string,
  email: string,
  linkedin?: string,
}>()

const emailHref = computed(() => `mailto:${props.email}`)
</script>

<template>
  <div class="profile">
    <v-avatar size="80" :image="props.avatarSrc" :alt="props.avatarAlt"></v-avatar>
    <p><b>{{ props.name }}</b></p>
    <small>{{ props.role }}</small>
    <address>
      <a :href="emailHref">
        <v-btn size="x-small" variant="plain" icon @click="">
          <v-icon icon="mdi-email" size="16" />
        </v-btn>
      </a>
      <a v-if="props.linkedin" target="_blank" :href="props.linkedin">
        <v-btn size="x-small" variant="plain" icon @click="">
          <v-icon icon="mdi-linkedin" size="18" />
        </v-btn>
      </a>
    </address>
  </div>
</template>

<style scoped lang="scss">
.profile {
  display: grid;
  place-items: center;

  .v-avatar {
    border-radius: 8px;
    margin-bottom: 8px;
  }

  address {
    a {
      color: unset;
    }
  }
}
</style>