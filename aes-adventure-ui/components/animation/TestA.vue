<script setup lang="ts">
import { AnimeTimelineInstance } from 'animejs';
import { hexToDivs } from '~~/utils/animation/hexToDivs';

const props = defineProps<{
  timeline: AnimeTimelineInstance
}>();

// const animationRoot = ref<HTMLElement>()
// const encryptState = useEncryptState()
// const { mountDivs, getDivIndexClass, getDivRowClass, getDivColumnClass } = hexToDivs(encryptState.plaintext)

// onMounted(() => {
//   // Mount the divs we created:
//   if (animationRoot.value)
//     mountDivs(animationRoot.value)

//   // Create the animation:
//   props.timeline.add({
//     targets: getDivColumnClass(3),
//     translateX: 250,
//     duration: 4000,
//   })
//     .add({
//       targets: getDivIndexClass(3),
//       rotate: '1turn',
//       backgroundColor: '#292',
//     })
// })
</script>

<template>
  <figure
    ref="animationRoot"
    class="testAnimationRoot"
  >
  </figure>
</template>

<style lang="scss">
.testAnimationRoot {
  display: grid;
  grid-template-columns: repeat(4, min-content);
  grid-template-rows: repeat(4, min-content);
  gap: 10px;
}
</style>