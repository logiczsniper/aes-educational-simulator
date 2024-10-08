<script setup lang="ts">
import type { AnimeTimelineInstance } from 'animejs';
import { addAnimationClasses } from '~~/utils/animation/addAnimationClasses';
import { COL_GAP, DIV_HEIGHT, DIV_WIDTH, ROW_GAP } from '~~/utils/animation/constants';
import { hexToDivs } from '~~/utils/animation/hexToDivs';
import { updateDivs } from '~~/utils/animation/updateDivs';

const props = defineProps<{
  timeline: AnimeTimelineInstance,
  input?: Uint8Array
}>();

const { t } = useI18n();

const animationRoot = ref<HTMLElement>()
const inputGridRoot = ref<HTMLElement>()

const input = computed(() => props.input || [] as Array<number>)

const byteDivs = hexToDivs(input.value)
const { targetDivs, targetAllClass, targetCoordsClass, targetRowClass } = addAnimationClasses(byteDivs, 'shift-rows-inverse')

const createAnimation = () => {
  const rowSize = DIV_HEIGHT + ROW_GAP + 1
  const columnSize = DIV_WIDTH + COL_GAP
  for (let row = 0; row < 4; row++) {
    const initialTranslateX = 140 + row * columnSize

    props.timeline.add({
      targets: targetRowClass(row),
      translateX: initialTranslateX,
    })

    for (let column = 3; column >= 0; column--) {
      const isCycle = column > (3 - row)
      const duration = row === 0 ? 250 : 1200
      const timeOffset = column === 3 ? undefined : '-=800'

      props.timeline.add({
        targets: targetCoordsClass(row, column),
        keyframes: isCycle
          ? [
            { translateY: rowSize },
            { translateX: initialTranslateX - columnSize * 4 },
            { translateY: 0 },
          ]
          : [],
        duration,
      }, timeOffset)
    }
  }

  props.timeline.add({
    targets: targetAllClass,
    color: '#745CD0'
  })
}

watch(input, newInput => {
  updateDivs(byteDivs, newInput)
  updateDivs(targetDivs, newInput)
})

watch(() => props.timeline, () => {
  createAnimation()
})

onMounted(() => {
  byteDivs.forEach(div => inputGridRoot.value?.appendChild(div))
  targetDivs.forEach(div => animationRoot.value?.appendChild(div))

  createAnimation()
})
</script>

<template>
  <div class="shiftRowsInverseRoot">
    <h4>{{ t('simulator.input') }}</h4>
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
    <div />
  </div>
</template>

<style lang="scss">
.shiftRowsInverseRoot {
  display: grid;
  grid-template-columns: repeat(2, min-content);
  grid-template-rows: repeat(2, min-content);
  column-gap: 40px;
  row-gap: 8px;
}
</style>