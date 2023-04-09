<script setup lang="ts">
import type { AnimeTimelineInstance } from 'animejs';
import { AesiExpandKeyRoundStepRoundHFn } from '~~/utils/aesi/aesi.types';
import { S_BOX } from '~~/utils/aesi/core/constants';
import { addAnimationClasses } from '~~/utils/animation/addAnimationClasses';
import { COL_GAP, DIV_HEIGHT, DIV_WIDTH, ROW_GAP } from '~~/utils/animation/constants';
import { hexToDivs } from '~~/utils/animation/hexToDivs';
import { updateDivs } from '~~/utils/animation/updateDivs';

const props = defineProps<{
  timeline: AnimeTimelineInstance,
  step?: AesiExpandKeyRoundStepRoundHFn,
}>();

const { t } = useI18n();

const animationRoot = ref<HTMLElement>()
const inputGridRoot = ref<HTMLElement>()
const sboxAnimationRoot = ref<HTMLElement>()
const outputAnimationRoot = ref<HTMLElement>()

const input = computed(() => props.step?.inputWord || [])
const subOutput = computed(() => props.step?.subWordOutput || [])

const byteDivs = hexToDivs(input.value)
const { targetDivs, targetColumnClass, targetChildClass } = addAnimationClasses(byteDivs, "h-fn")

const sboxByteDivs = hexToDivs(S_BOX)
const { targetDivs: sboxTargetDivs, targetColumnClass: sboxTargetColumnClass, targetRowClass: sboxTargetRowClass, targetCoordsClass: sboxTargetCoordsClass } = addAnimationClasses(sboxByteDivs, 'h-fn-substitute-bytes-sbox', 16)

const subOutputDivs = hexToDivs(subOutput.value)
const { targetDivs: subOutputTargetDivs, targetCoordsClass: subOutputTargetCoordsClass, targetColumnClass: subOutputTargetColumnClass } = addAnimationClasses(subOutputDivs, 'h-fn-substitute-bytes-o')

const inputGridRootClass = 'hFnInputGridRoot'
const inputGridRootTarget = `.${inputGridRootClass}`

const createAnimation = () => {
  for (let column = 0; column < 4; column++) {
    props.timeline.add({
      targets: targetColumnClass(column),
      translateX: 8 * column,
    }, '-=600')
  }

  props.timeline.add({
    targets: inputGridRootTarget,
    opacity: 1,
  })

  const columnSize = DIV_WIDTH + COL_GAP
  const rowSize = DIV_HEIGHT + ROW_GAP
  for (let column = 0; column < 4; column++) {
    const firstChildContent = document.getElementsByClassName(targetChildClass(0, column, 1).substring(1)).item(0)?.textContent ?? '0'
    const secondChildContent = document.getElementsByClassName(targetChildClass(0, column, 2).substring(1)).item(0)?.textContent ?? '0'

    const firstChildHex = parseInt(firstChildContent, 16)
    const secondChildHex = parseInt(secondChildContent, 16)
    props.timeline.add({
      targets: targetChildClass(0, column, 1),
      translateX: 140 - column * columnSize,
      translateY: 22 + rowSize * firstChildHex
    }).add({
      targets: targetChildClass(0, column, 1),
      opacity: 0,
    }, '-=320').add({
      targets: sboxTargetRowClass(firstChildHex),
      color: '#D755B9'
    }, '-=300').add({
      targets: targetChildClass(0, column, 2),
      translateX: 155 + columnSize * (secondChildHex - column)
    }).add({
      targets: targetChildClass(0, column, 2),
      opacity: 0,
    }, '-=320').add({
      targets: sboxTargetColumnClass(secondChildHex),
      color: '#D755B9'
    }, '-=300').add({
      targets: sboxTargetCoordsClass(firstChildHex, secondChildHex),
      color: '#745CD0'
    }, '-=200').add({
      targets: subOutputTargetCoordsClass(0, column),
      opacity: 1,
    }).add({
      targets: [sboxTargetRowClass(firstChildHex), sboxTargetColumnClass(secondChildHex)],
      color: 'rgba(0, 0, 0, 0.87)', // this is the color set by vuetify, we cannot simply 'unset' in this animation
    }, '+=1100')
  }

  for (let column = 0; column < 4; column++) {
    props.timeline.add({
      targets: subOutputTargetColumnClass(column),
      translateX: -8 * column,
    }, '-=600')
  }

  props.timeline.add({
    targets: subOutputTargetDivs,
    color: '#745CD0'
  })
}

watch([input, subOutput], ([newInput, newSubOutput]) => {
  updateDivs(byteDivs, newInput)
  updateDivs(targetDivs, newInput)
  updateDivs(subOutputDivs, newSubOutput)
  updateDivs(subOutputTargetDivs, newSubOutput)
})

watch(() => props.timeline, () => {
  createAnimation()
})

onMounted(() => {
  byteDivs.forEach(div => inputGridRoot.value?.appendChild(div))
  targetDivs.forEach(div => animationRoot.value?.appendChild(div))
  sboxTargetDivs.forEach((div, index) => {
    if (index % 16 === 0) {
      const counterDiv = document.createElement('div')
      counterDiv.classList.add('code', 'leftDiv')
      counterDiv.textContent = (index / 16).toString(16)

      sboxAnimationRoot.value?.appendChild(counterDiv)
    }
    sboxAnimationRoot.value?.appendChild(div)
  })
  subOutputTargetDivs.forEach(div => outputAnimationRoot.value?.appendChild(div))

  createAnimation()
})
</script>

<template>
  <div class="hFnRoot">
    <h4>{{ t('simulator.input') }}</h4>
    <h4>{{ t('simulator.sbox') }}</h4>
    <h4>{{ t('simulator.output') }}</h4>

    <div class="relative">
      <div
        ref="inputGridRoot"
        class="animationGrid absolute"
        :class="inputGridRootClass"
      ></div>
      <figure
        ref="animationRoot"
        class="animationGrid compact"
      >
      </figure>
    </div>

    <div class="relative">
      <figure
        ref="sboxAnimationRoot"
        class="animationGridSbox"
      >
        <div />
        <div
          v-for="i in 16"
          class="upperDiv code"
        >{{ (i - 1).toString(16) }}</div>
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
.hFnRoot {
  display: grid;
  grid-template-columns: repeat(3, min-content);
  grid-template-rows: repeat(2, min-content);
  column-gap: 40px;
  row-gap: 8px;

  h4 {
    white-space: nowrap;
  }

  &>*:nth-child(3n + 2) {
    margin-left: 24px;
  }

  .hFnInputGridRoot {
    opacity: 0;
  }

  .startNoOpacity {
    &>div {
      opacity: 0;
    }
  }
}
</style>