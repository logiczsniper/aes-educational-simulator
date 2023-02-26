<script setup lang="ts">
import { AnimeTimelineInstance } from 'animejs';
import { COL_GAP, DIV_HEIGHT, DIV_WIDTH, ROW_GAP } from '~~/utils/animation/constants';
import { hexToDivs } from '~~/utils/animation/hexToDivs';

const props = defineProps<{
  timeline: AnimeTimelineInstance
}>();

const animationRoot = ref<HTMLElement>()
const encryptState = useEncryptState()

const plaintext = computed(() => encryptState.plaintext)
const state = computed(() => encryptState.output?.initialState ?? [])

const { mountDivs, getDivRowClass, getDivColumnClass, idClass } = hexToDivs(plaintext.value)

onMounted(() => {
  // Mount the divs we created:
  if (animationRoot.value)
    mountDivs(animationRoot.value)

  // Create the animation:
  const rowSize = DIV_HEIGHT + ROW_GAP + 1
  const columnSize = DIV_WIDTH + COL_GAP - 1
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      props.timeline.add({
        targets: `${getDivRowClass(row)}${getDivColumnClass(col)}`,
        translateX: (row * rowSize + 250) - col * rowSize,
        translateY: col * columnSize - row * columnSize
      })
    }
  }

  props.timeline.add({
    targets: idClass,
    color: '#745CD0'
  })
})
</script>

<template>
  <figure
    ref="animationRoot"
    class="plaintextToStateRoot animationGrid"
  >
  </figure>
</template>

<style lang="scss">
.plaintextToStateRoot {}
</style>