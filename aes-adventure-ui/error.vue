<script setup lang="ts">
const { t } = useI18n();

const props = defineProps({
  error: Object
})

const statusCode = computed(() => props.error?.statusCode ?? 418)
const statusMessage = computed(() => props.error?.statusMessage ?? "An unknown error occured")

const handleError = () => clearError({ redirect: '/' })

const title = computed(() => `${statusCode.value} - ${t('error.mistake')}`)
</script>

<template>
  <main class="errorPage">
    <Logo />
    <h1>{{ title }}</h1>
    <p>{{ statusMessage }}</p>
    <v-btn
      variant="flat"
      color="primary"
      @click="handleError"
    >{{ t('error.back') }}</v-btn>
  </main>
</template>

<style lang="scss">
.errorPage {
  display: flex;
  flex-direction: column;
  place-items: center;
  margin: 34px 3%;
  border-radius: 12px;
  padding: 40px;
  gap: 18px;
  background-color: #f9f9f9;
}
</style>