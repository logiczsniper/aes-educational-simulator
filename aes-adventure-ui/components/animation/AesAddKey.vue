<script setup lang="ts">
import type { AnimeTimelineInstance } from 'animejs';
import { hexToDivs } from '~~/utils/animation/hexToDivs';
import { addAnimationClasses } from '~~/utils/animation/addAnimationClasses';
import { COL_GAP, DIV_WIDTH } from '~~/utils/animation/constants';

const props = defineProps<{
  timeline: AnimeTimelineInstance
}>();

const { t } = useI18n();

const animationRoot = ref<HTMLElement>()
const inputGridRoot = ref<HTMLElement>()
const keyAnimationRoot = ref<HTMLElement>()
const keyGridRoot = ref<HTMLElement>()
const outputAnimationRoot = ref<HTMLElement>()

const encryptState = useEncryptState()

const key = computed(() => encryptState.key)
const input = computed(() => encryptState.output?.symmetryKeyAddition.inputState || [] as Array<number>)
const output = computed(() => encryptState.output?.symmetryKeyAddition.outputState || [] as Array<number>)

const byteDivs = hexToDivs(input.value)
const { targetDivs, targetCoordsClass } = addAnimationClasses(byteDivs, 'add-key-i')

const keyByteDivs = hexToDivs(key.value)
const { targetDivs: keyTargetDivs, targetCoordsClass: keyTargetCoordsClass } = addAnimationClasses(keyByteDivs, 'add-key-k')

const outputDivs = hexToDivs(output.value)
const { targetDivs: outputTargetDivs, targetCoordsClass: outputTargetCoordsClass, targetAllClass: outputTargetAllClass } = addAnimationClasses(outputDivs, 'add-key-o')

onMounted(() => {
  byteDivs.forEach(div => inputGridRoot.value?.appendChild(div))
  targetDivs.forEach(div => animationRoot.value?.appendChild(div))
  keyByteDivs.forEach(div => keyGridRoot.value?.appendChild(div))
  keyTargetDivs.forEach(div => keyAnimationRoot.value?.appendChild(div))
  outputTargetDivs.forEach(div => outputAnimationRoot.value?.appendChild(div))

  const columnSize = DIV_WIDTH + COL_GAP
  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      props.timeline.add({
        targets: keyTargetCoordsClass(row, column),
        translateX: 146 - column * columnSize
      }).add({
        targets: targetCoordsClass(row, column),
        translateX: 336 - column * columnSize
      }).add({
        targets: '.addKeyXorSymbol',
        translateY: -2 + row * (24 + row / 2),
        opacity: 1
      }).add({
        targets: outputTargetCoordsClass(row, column),
        opacity: 1,
      }).add({
        targets: [keyTargetCoordsClass(row, column), targetCoordsClass(row, column), '.addKeyXorSymbol'],
        opacity: 0,
      })
    }
  }

  props.timeline.add({
    targets: outputTargetAllClass,
    color: '#745CD0'
  })
})
</script>

<template>
  <div class="addKeyRoot">
    <h4>{{ t('simulator.input') }}</h4>
    <h4>{{ t('simulator.key') }}</h4>
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
      <span class="addKeyXorSymbol absolute">⊕</span>
      <div
        ref="keyGridRoot"
        class="animationGrid absolute keyGridRoot"
      ></div>
      <figure
        ref="keyAnimationRoot"
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
.addKeyRoot {
  display: grid;
  grid-template-columns: repeat(3, min-content);
  grid-template-rows: repeat(2, min-content);
  column-gap: 40px;
  row-gap: 8px;

  &>*:nth-child(3n) {
    margin-left: 120px;
  }

  .addKeyXorSymbol {
    right: -88px;
    opacity: 0;
  }

  .startNoOpacity {
    &>div {
      opacity: 0;
    }
  }
}
</style>