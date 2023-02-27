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
const { targetDivs, targetAllClass, targetCoordsClass } = addAnimationClasses(byteDivs)

onMounted(() => {
  // Mount the divs we created:
  byteDivs.forEach(byteDiv => inputGridRoot.value?.appendChild(byteDiv))
  targetDivs.forEach(targetDiv => animationRoot.value?.appendChild(targetDiv))

  // Create the animation:
  const rowSize = DIV_HEIGHT + ROW_GAP + 1
  const columnSize = DIV_WIDTH + COL_GAP - 1
  for (let row = 0; row < 4; row++) {
    for (let colunm = 0; colunm < 4; colunm++) {
      props.timeline.add({
        targets: targetCoordsClass(row, colunm),
        translateX: (row * rowSize + 250) - colunm * rowSize,
        translateY: colunm * columnSize - row * columnSize
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
    <div class="animationSubheaders">
      <h4>{{ t('simulator.input') }}</h4>
      <h4>{{ t('simulator.output') }}</h4>
    </div>
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
</template>

<style lang="scss">
.plaintextToStateRoot {
  position: relative;

  .animationSubheaders {
    display: flex;
    gap: 214px;
    margin-bottom: 4px;
  }
}

.absolute {
  position: absolute;
}
</style>