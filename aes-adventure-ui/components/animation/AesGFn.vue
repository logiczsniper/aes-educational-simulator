<script setup lang="ts">
import type { AnimeTimelineInstance } from 'animejs';
import { COL_GAP, DIV_HEIGHT, DIV_WIDTH, ROW_GAP } from '~~/utils/animation/constants';
import { addAnimationClasses } from '~~/utils/animation/addAnimationClasses';
import { AesiExpandKeyRoundStepRoundGFn } from '~~/utils/aesi/aesi.types';
import { hexToDivs } from '~~/utils/animation/hexToDivs';

const props = defineProps<{
  timeline: AnimeTimelineInstance,
  input?: Uint8Array[],
  step?: AesiExpandKeyRoundStepRoundGFn,
}>();

const { t } = useI18n();

const animationRoot = ref<HTMLElement>()
const inputGridRoot = ref<HTMLElement>()
const shiftAnimationRoot = ref<HTMLElement>()

const input = computed(() => props.input?.at(-1) || [])
const shiftOutput = computed(() => props.step?.rotateWordOutput || [])

const byteDivs = hexToDivs(input.value)
const { targetDivs, targetAllClass, targetColumnClass, targetChildClass } = addAnimationClasses(byteDivs, "g-fn")

const shiftOutputDivs = hexToDivs(shiftOutput.value)
const { targetDivs: shiftOutputTargetDivs, targetAllClass: shiftTargetAllClass, targetColumnClass: shiftTargetColumnClass } = addAnimationClasses(shiftOutputDivs, 'g-fn-shift-o')

onMounted(() => {
  byteDivs.forEach(byteDiv => inputGridRoot.value?.appendChild(byteDiv))
  targetDivs.forEach(targetDiv => animationRoot.value?.appendChild(targetDiv))
  shiftOutputTargetDivs.forEach(byteDiv => shiftAnimationRoot.value?.appendChild(byteDiv))

  const rowSize = DIV_HEIGHT + ROW_GAP + 1
  const columnSize = DIV_WIDTH + COL_GAP

  const initialTranslateX = 122

  props.timeline.add({
    targets: targetAllClass,
    translateX: initialTranslateX,
  }).add({
    targets: targetColumnClass(0),
    keyframes: [
      { translateY: rowSize },
      { translateX: initialTranslateX + columnSize * 4 },
      { translateY: 0 },
    ]
  }).add({
    targets: shiftTargetAllClass,
    opacity: 1,
  })

  for (let column = 0; column < 4; column++) {
    props.timeline.add({
      targets: shiftTargetColumnClass(column),
      translateX: 158 - (column * columnSize)
    })
  }


  // const inputWordIndex = byteDivs.length - 1
  // const inputWordTarget = targetColumnClass(inputWordIndex)
  // const otherWordTargets = byteDivs.flatMap((_, i) => {
  //   if (i === byteDivs.length - 1) return '';

  //   return [targetChildClass(0, i, 1), targetChildClass(0, i, 2), targetChildClass(0, i, 3), targetChildClass(0, i, 4)]
  // })
  // props.timeline.add({
  //   targets: inputWordTarget,
  //   color: '#D755B9'
  // }).add({
  //   targets: otherWordTargets,
  //   opacity: 0,
  //   delay: anime.stagger(20, { direction: 'reverse' }),
  //   duration: 800,
  // }, '+=1000').add({
  //   targets: inputWordTarget,
  //   translateX: -594,
  // }, '-=900').add({
  //   targets: targetChildClass(0, inputWordIndex, 2),
  //   translateX: COL_GAP,
  // }).add({
  //   targets: targetChildClass(0, inputWordIndex, 3),
  //   translateX: COL_GAP * 2,
  // }, '-=1000').add({
  //   targets: targetChildClass(0, inputWordIndex, 4),
  //   translateX: COL_GAP * 3,
  // }, '-=1100').add({
  //   targets: inputWordTarget,
  //   color: 'rgba(0, 0, 0, 0.87)'
  // }, '-=1000')

  // props.timeline.add({
  //   targets: targetAllClass,
  //   color: '#745CD0'
  // })
})
</script>

<template>
  <div class="gFnRoot">
    <h4>{{ t('simulator.input') }}</h4>
    <h4>Shifted Input</h4>
    <!-- <h4>{{ t('simulator.shift-step') }}</h4> -->
    <h4>{{ t('simulator.sbox') }}</h4>
    <h4>Round Constant</h4>
    <!-- <h4>{{ t('simulator.add-rcon-step') }}</h4> -->
    <h4>{{ t('simulator.output') }}</h4>

    <div class="relative">
      <div
        ref="inputGridRoot"
        class="animationGrid absolute"
      ></div>
      <figure
        ref="animationRoot"
        class="animationGrid"
      >
      </figure>
    </div>

    <div class="relative">
      <figure
        ref="shiftAnimationRoot"
        class="animationGrid startNoOpacity"
      >
      </figure>
    </div>

    <div class="relative">
      <div class="subBox" />
      <div class="subArrow" />
      <figure
        ref="subAnimationRoot"
        class="tinyAnimationGrid"
      >
      </figure>
    </div>

    <div class="relative">
      <div class="code">{{ Number(step?.addRoundConstantOutput.roundConstant).toString(16).padStart(2, '0') }}</div>
      <div
        ref="addGridRoot"
        class="animationGrid absolute"
      ></div>
      <figure
        ref="addAnimationRoot"
        class="animationGrid"
      >
      </figure>
    </div>

    <div class="relative">
      <figure
        ref="outputAnimationRoot"
        class="animationGrid startNoOpacity"
      >
      </figure>
    </div>
  </div>
</template>

<style lang="scss">
.gFnRoot {

  display: grid;
  grid-template-columns: repeat(5, min-content);
  grid-template-rows: repeat(2, min-content);
  column-gap: 40px;
  row-gap: 8px;

  h4 {
    white-space: nowrap;
  }

  &>*:nth-child(5n + 2) {
    margin-left: 8px;
  }

  &>*:nth-child(5n + 3) {
    margin-left: 4px;
  }

  .startNoOpacity {
    &>div {
      opacity: 0;
    }
  }

  .subBox {
    position: absolute;
    top: -34px;
    left: -10px;
    width: 136px;
    height: 68px;
    border: 1px solid black;
    border-radius: 2px;
  }

  .subArrow::after {
    content: "->";
    position: absolute;
    top: -2px;
    left: 50px;
  }
}
</style>