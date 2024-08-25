<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="tutorialBody">
    <p v-html="t('simulator.tutorial.ciphertext-to-state.body')" />
    <TutorialsCommonSandboxButton>
      <template #animation="{ input }">
        <AnimationAesAnimationFrame>
          <template #animation="{ timeline }">
            <AnimationAesTranspose
              id="sandbox"
              :timeline="timeline"
              :input="input"
            >
            </AnimationAesTranspose>
          </template>
        </AnimationAesAnimationFrame>
      </template>
    </TutorialsCommonSandboxButton>
    <TutorialsCommonLearnMore
      :links="[{ label: t('simulator.tutorial.ciphertext-to-state.learn-more.matrices'), href: 'https://mathinsight.org/matrix_transpose' }]"
    />
  </div>
</template>

<style lang="scss">
.tutorialBody {
  display: grid;
  gap: 14px;
}
</style>