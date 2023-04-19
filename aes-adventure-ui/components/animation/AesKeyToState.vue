<script setup lang="ts">
import type { AnimeTimelineInstance } from 'animejs';
import { AesiKeySize } from '~~/utils/aesi/aesi.types';
import { addAnimationClasses } from '~~/utils/animation/addAnimationClasses';
import { COL_GAP, DIV_HEIGHT, DIV_WIDTH, ROW_GAP } from '~~/utils/animation/constants';
import { hexToDivs } from '~~/utils/animation/hexToDivs';

const props = defineProps<{
  id?: string,
  timeline: AnimeTimelineInstance,
  keySize: AesiKeySize,
  input?: Uint8Array,
}>();

const { t } = useI18n();

const animationRoot = ref<HTMLElement>()
const inputGridRoot = ref<HTMLElement>()

const input = computed(() => props.input || [] as Array<number>)
const columnCount = computed(() => props.keySize / 32)

const byteDivs = hexToDivs(input.value)
const { targetDivs, targetAllClass, targetCoordsClass } = addAnimationClasses(byteDivs, `key-to-state-${props.id}`, columnCount.value)


onMounted(() => {
  byteDivs.forEach(div => inputGridRoot.value?.appendChild(div))
  targetDivs.forEach(div => animationRoot.value?.appendChild(div))

  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < columnCount.value; column++) {
      const duration = 700
      const index = row * columnCount.value + column
      const offset = index % 4 !== 0
        ? `-=${duration}`
        : '+=800'
      const xOffset = (() => {
        switch (columnCount.value) {
          case 4: return 133
          case 6: return 187
          case 8: return 241
          default: return 0
        }
      })()

      props.timeline.add({
        targets: targetCoordsClass(row, column),
        translateX: (row * columnCount.value * DIV_WIDTH + COL_GAP) + xOffset - (8.2 * column) + (Math.floor(index / 4) * COL_GAP),
        translateY: -row * (DIV_HEIGHT + ROW_GAP),
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
  <div class="keyToStateRoot">
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
.keyToStateRoot {
  display: grid;
  grid-template-columns: repeat(2, min-content);
  grid-template-rows: repeat(2, min-content);
  column-gap: 40px;
  row-gap: 8px;
}
</style>