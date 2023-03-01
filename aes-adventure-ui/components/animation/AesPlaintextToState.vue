<script setup lang="ts">
import type { AnimeTimelineInstance } from 'animejs';
import { COL_GAP, DIV_HEIGHT, DIV_WIDTH, ROW_GAP } from '~~/utils/animation/constants';
import { hexToDivs } from '~~/utils/animation/hexToDivs';
import { addAnimationClasses } from '~~/utils/animation/addAnimationClasses';

const props = defineProps<{
  timeline: AnimeTimelineInstance
}>();

const { t } = useI18n();

const animationRoot = ref<HTMLElement>()
const inputGridRoot = ref<HTMLElement>()
const encryptState = useEncryptState()

const plaintext = computed(() => encryptState.plaintext)
const state = computed(() => encryptState.output?.initialState ?? [])

const byteDivs = hexToDivs(plaintext.value)
const { targetDivs, targetAllClass, targetCoordsClass } = addAnimationClasses(byteDivs, 'plaintext-to-state')

onMounted(() => {
  byteDivs.forEach(byteDiv => inputGridRoot.value?.appendChild(byteDiv))
  targetDivs.forEach(targetDiv => animationRoot.value?.appendChild(targetDiv))

  const rowSize = DIV_HEIGHT + ROW_GAP + 1
  const columnSize = DIV_WIDTH + COL_GAP - 1
  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      props.timeline.add({
        targets: targetCoordsClass(row, column),
        translateX: (row * rowSize + 140) - column * rowSize,
        translateY: column * columnSize - row * (rowSize + 1)
      })
    }
  }

  props.timeline.add({
    targets: targetAllClass,
    color: '#745CD0'
  })
})
</script>

<template>
  <div class="plaintextToStateRoot">
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
.plaintextToStateRoot {
  display: grid;
  grid-template-columns: repeat(2, min-content);
  grid-template-rows: repeat(2, min-content);
  column-gap: 40px;
  row-gap: 8px;
}
</style>