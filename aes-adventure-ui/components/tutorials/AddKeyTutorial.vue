<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="tutorialBody">
    <p v-html="t('simulator.tutorial.encryption.add-key.body')" />
    <TutorialsCommonSandboxButton>
      <template #animation="{ input }">
        <AnimationAesAnimationFrame>
          <template #animation="{ timeline }">
            <AnimationAesAddKey
              id="sandbox"
              :timeline="timeline"
              :input="input"
            >
            </AnimationAesAddKey>
          </template>
        </AnimationAesAnimationFrame>
      </template>
    </TutorialsCommonSandboxButton>
    <TutorialsCommonLearnMore :links="[{ label: t('simulator.tutorial.encryption.add-key.learn-more'), href: '' }]" />
  </div>
</template>

<style lang="scss">
.tutorialBody {
  display: grid;
  gap: 14px;
}
</style>