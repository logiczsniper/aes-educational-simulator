<script setup lang="ts">
import type { AnimeTimelineInstance } from 'animejs';
import { COL_GAP, DIV_HEIGHT, DIV_WIDTH, ROW_GAP } from '~~/utils/animation/constants';
import { addAnimationClasses } from '~~/utils/animation/addAnimationClasses';
import { AesiExpandKeyRoundStepRoundGFn } from '~~/utils/aesi/aesi.types';
import { wordsToDivs } from '~~/utils/animation/wordsToDivs';

const props = defineProps<{
  timeline: AnimeTimelineInstance,
  input?: Uint8Array[],
  step?: AesiExpandKeyRoundStepRoundGFn,
}>();

const { t } = useI18n();

const animationRoot = ref<HTMLElement>()
const inputGridRoot = ref<HTMLElement>()

const input = computed(() => props.input || [])

const wordDivs = wordsToDivs(input.value)
const { targetDivs, targetAllClass, targetColumnClass, targetChildClass } = addAnimationClasses(wordDivs, "g-fn", 16)

onMounted(() => {
  wordDivs.forEach(wordDiv => inputGridRoot.value?.appendChild(wordDiv))
  targetDivs.forEach(targetDiv => animationRoot.value?.appendChild(targetDiv))

  const inputWordTarget = targetColumnClass(wordDivs.length - 1)
  const otherWordTargets = wordDivs.map((_, i) => {
    if (i === wordDivs.length - 1) return '';

    return targetColumnClass(i)
  })

  props.timeline.add({
    targets: inputWordTarget,
    color: '#D755B9'
  }).add({
    targets: otherWordTargets,
    opacity: 0,
    duration: 2000,
  }, '-=500').add({
    targets: inputWordTarget,
    translateX: -594,
  }, '+=300').add({
    // TODO: split target word back into bytes lmao
  })

  props.timeline.add({
    targets: targetAllClass,
    color: '#745CD0'
  })
})
</script>

<template>
  <div class="gFnRoot">
    <h4 class="header">{{ t('simulator.input') }}</h4>
    <figure
      ref="animationRoot"
      class="animationGridKeyRow"
    >
    </figure>
  </div>
</template>

<style lang="scss">
.gFnRoot {
  .header {
    margin-bottom: 8px;
  }
}
</style>