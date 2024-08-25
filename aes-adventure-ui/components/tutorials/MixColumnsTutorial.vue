<script setup lang="ts">
import { A, A_INVERSE } from '~~/utils/aesi/core/constants';

const { t } = useI18n();

const inverse = ref(false)
const matrix = computed(() => inverse.value ? A_INVERSE : A)
</script>

<template>
  <div class="tutorialBody">
  <p v-html="t('simulator.tutorial.mix-columns.body')" />
  <!-- <TutorialsCommonSandboxButton>
      <template #animation="{ input }">
        <v-checkbox v-model="inverse">{{ t('simulator.decrypt') }}</v-checkbox>
        <AnimationAesAnimationFrame :key="String(inverse)">
          <template #animation="{ timeline }">
            <AnimationAesMixColumns
              id="sandbox"
                :timeline="timeline"
                :input="input"
                :matrix="matrix"
              >
              </AnimationAesMixColumns>
            </template>
          </AnimationAesAnimationFrame>
        </template>
      </TutorialsCommonSandboxButton> -->
    <TutorialsCommonLearnMore :links="[
      { label: t('simulator.tutorial.mix-columns.learn-more.matrix-multiplication'), href: 'https://www.mathsisfun.com/algebra/matrix-multiplying.html' },
      { label: t('simulator.tutorial.mix-columns.learn-more.matrix-inversion'), href: 'https://www.mathsisfun.com/algebra/matrix-inverse.html' },
      { label: t('simulator.tutorial.mix-columns.learn-more.gf'), href: 'https://www.johndcook.com/blog/finite-fields/' },
      { label: t('simulator.tutorial.mix-columns.learn-more.gf-arithmetic'), href: 'https://www.cs.uaf.edu/2015/spring/cs463/lecture/03_23_AES.html' }
    ]" />
  </div>
</template>

<style lang="scss">
.tutorialBody {
  display: grid;
  gap: 14px;
}
</style>