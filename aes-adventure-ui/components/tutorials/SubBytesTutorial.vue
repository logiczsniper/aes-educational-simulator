<script setup lang="ts">
import { S_BOX, S_BOX_INVERSE } from '~~/utils/aesi/core/constants';

const { t } = useI18n();

const inverse = ref(false)
const sbox = computed(() => inverse.value ? S_BOX_INVERSE : S_BOX)
</script>

<template>
  <div class="tutorialBody">
    <p v-html="t('simulator.tutorial.sub-bytes.body')" />
    <!-- <TutorialsCommonSandboxButton>
      <template #animation="{ input }">
        <v-checkbox v-model="inverse">{{ t('simulator.decrypt') }}</v-checkbox>
        <AnimationAesAnimationFrame :key="String(inverse)">
          <template #animation="{ timeline }">
            <AnimationAesSubstituteBytes
              id="sandbox"
              :timeline="timeline"
              :input="input"
              :sbox="sbox"
            >
            </AnimationAesSubstituteBytes>
          </template>
        </AnimationAesAnimationFrame>
      </template>
    </TutorialsCommonSandboxButton> -->
    <TutorialsCommonLearnMore :links="[
        { label: t('simulator.tutorial.sub-bytes.learn-more.bijective'), href: 'https://www.mathsisfun.com/sets/injective-surjective-bijective.html' },
        { label: t('simulator.tutorial.sub-bytes.learn-more.sbox'), href: 'https://www.johndcook.com/blog/2019/05/25/aes-s-box/' }
      ]" />
  </div>
</template>

<style lang="scss">
.tutorialBody {
  display: grid;
  gap: 14px;
}
</style>