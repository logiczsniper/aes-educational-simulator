<script setup lang="ts">

const { t } = useI18n();

const copyInput = (input: Uint8Array) => Uint8Array.from(input)
</script>

<template>
  <div class="tutorialBody">
  <p v-html="t('simulator.tutorial.add-key.body')" />
  <!-- <TutorialsCommonSandboxButton>
      <template #animation="{ input }">
        <AnimationAesAnimationFrame>
          <template #animation="{ timeline }">
            <AnimationAesAddKey
              id="sandbox"
              :timeline="timeline"
              :input="input"
              :key-value="input"
                :output="addRoundKey(copyInput(input), input, 0).outputState"
              >
              </AnimationAesAddKey>
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