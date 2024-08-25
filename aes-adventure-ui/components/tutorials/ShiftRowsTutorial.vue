<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="tutorialBody">
  <p v-html="t('simulator.tutorial.shift-rows.body')" />
  <!-- <TutorialsCommonSandboxButton>
      <template #animation="{ input }">
        <AnimationAesAnimationFrame>
          <template #animation="{ timeline }">
            <AnimationAesShiftRows
              id="sandbox"
              :timeline="timeline"
              :input="input"
            >
            </AnimationAesShiftRows>
            </template>
          </AnimationAesAnimationFrame>
        </template>
      </TutorialsCommonSandboxButton> -->
  </div>
</template>

<style lang="scss">
.tutorialBody {
  display: grid;
  gap: 14px;
}
</style>