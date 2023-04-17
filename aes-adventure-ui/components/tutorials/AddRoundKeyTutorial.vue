<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="tutorialBody">
    <p v-html="t('simulator.tutorial.add-round-key.body')" />
    <TutorialsCommonSandboxButton>
      <template #animation="{ input }">
        <AnimationAesAnimationFrame>
          <template #animation="{ timeline }">
            <AnimationAesAddKey
              id="sandbox"
              :timeline="timeline"
              :input="input"
              :key-value="input"
            >
            </AnimationAesAddKey>
          </template>
        </AnimationAesAnimationFrame>
      </template>
    </TutorialsCommonSandboxButton>
  </div>
</template>

<style lang="scss">
.tutorialBody {
  display: grid;
  gap: 14px;
}
</style>