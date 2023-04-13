<script setup lang="ts">
import type { AnimeTimelineInstance } from 'animejs';
import { AesiKeySize } from '~~/utils/aesi/aesi.types';
import { addAnimationClasses } from '~~/utils/animation/addAnimationClasses';
import { DIV_HEIGHT, ROW_GAP } from '~~/utils/animation/constants';
import { wordsToDivs } from '~~/utils/animation/wordsToDivs';

const props = defineProps<{
  timeline: AnimeTimelineInstance,
  keySize: AesiKeySize,
  roundCount: number,
  expandedKey: Uint8Array,
}>();

const { t } = useI18n();

const animationRoot = ref<HTMLElement>()
const inputGridRoot = ref<HTMLElement>()

const input = computed(() => hexToWords(props.expandedKey))
const rowCount = computed(() => props.roundCount + 1)
const columnCount = computed(() => props.keySize / 32)

const wordDivs = wordsToDivs(input.value)
const { targetDivs, targetAllClass, targetCoordsClass } = addAnimationClasses(wordDivs, `state-to-round-keys`, columnCount.value)

onMounted(() => {
  wordDivs.forEach(div => inputGridRoot.value?.appendChild(div))
  targetDivs.forEach(div => animationRoot.value?.appendChild(div))

  for (let row = 0; row < rowCount.value; row++) {
    for (let column = 0; column < columnCount.value; column++) {
      const duration = 700
      const index = row * columnCount.value + column
      const keyIndex = Math.floor(index / 4)
      const offset = index % 4 !== 0
        ? `-=${duration}`
        : '+=800'
      const initialTranslateX = (() => {
        switch (columnCount.value) {
          case 4: return 374
          case 6: return 542
          case 8: return 710
          default: return 0
        }
      })()
      const sameRowCorrection = columnCount.value === 8
        ? (keyIndex % 2 !== 0 ? -306 : 0)
        : 0
      const multiRowCorrection = columnCount.value === 6
        ? [4, 5].includes(column) || (row % 2 !== 0 && [2, 3].includes(column)) ? -153.5 : 0
        : 0

      props.timeline.add({
        targets: targetCoordsClass(row, column),
        translateX: initialTranslateX - (8.2 * column) + sameRowCorrection + multiRowCorrection,
        translateY: (keyIndex - row) * (DIV_HEIGHT + ROW_GAP),
        duration
      }, row === 0 && column === 0 ? undefined : offset)
    }
  }

  props.timeline.add({
    targets: targetAllClass,
    color: '#745CD0'
  })
})
</script>

<template>
  <div
    class="stateToRoundKeysRoot"
    :class="{
      'small': columnCount === 4,
      'medium': columnCount === 6,
      'large': columnCount === 8,
    }"
  >
    <h4>{{ t('simulator.input') }}</h4>
    <h4>{{ t('simulator.output') }}</h4>

    <div class="relative">
      <div
        ref="inputGridRoot"
        class="animationGridKey absolute"
        :class="{
          'small': columnCount === 4,
          'medium': columnCount === 6,
          'large': columnCount === 8,
        }"
      ></div>
      <figure
        ref="animationRoot"
        class="animationGridKey"
        :class="{
          'small': columnCount === 4,
          'medium': columnCount === 6,
          'large': columnCount === 8,
        }"
      >
      </figure>
    </div>
    <div />
  </div>
</template>

<style lang="scss">
.stateToRoundKeysRoot {
  display: grid;
  grid-template-columns: repeat(2, min-content);
  grid-template-rows: repeat(2, min-content);
  column-gap: 40px;
  row-gap: 8px;

  &.small {
    margin-bottom: 0;
  }

  &.medium {
    margin-bottom: 98px;
  }

  &.large {
    margin-bottom: 180px;
  }
}
</style>