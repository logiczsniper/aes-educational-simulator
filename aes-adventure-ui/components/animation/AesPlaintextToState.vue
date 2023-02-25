<script setup lang="ts">
import { AnimeTimelineInstance } from 'animejs';
import { hexToDivs } from '~~/utils/animation/hexToDivs';

const props = defineProps<{
  timeline: AnimeTimelineInstance
}>();

const animationRoot = ref<HTMLElement>()
const encryptState = useEncryptState()

const plaintext = computed(() => encryptState.plaintext)
const state = computed(() => encryptState.output?.initialState ?? [])

const { mountDivs, getDivRowClass, getDivColumnClass } = hexToDivs(plaintext.value)

onMounted(() => {
  // Mount the divs we created:
  if (animationRoot.value)
    mountDivs(animationRoot.value)

  // Create the animation:
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (row === col) props.timeline.add({
        targets: `${getDivRowClass(row)}${getDivColumnClass(col)}`,
        translateX: 250
      })
    }
  }

  // diagonal: move x only (no y)
  // above diag: move x: normal translate x - (width of col) * col
  // below
})
</script>

<template>
  <figure
    ref="animationRoot"
    class="plaintextToStateRoot"
  >
  </figure>
</template>

<style lang="scss">
.plaintextToStateRoot {
  display: grid;
  grid-template-columns: repeat(4, min-content);
  grid-template-rows: repeat(4, min-content);
  gap: 10px;
}
</style>