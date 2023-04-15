<script setup lang="ts">
import type { AnimeTimelineInstance } from 'animejs';
import { addAnimationClasses } from '~~/utils/animation/addAnimationClasses';
import { COL_GAP, DIV_WIDTH } from '~~/utils/animation/constants';
import { hexToDivs } from '~~/utils/animation/hexToDivs';
import { updateDivs } from '~~/utils/animation/updateDivs';

const props = defineProps<{
  timeline: AnimeTimelineInstance,
  matrix: number[],
  input?: Uint8Array,
  output?: Uint8Array,
}>();

const { t } = useI18n();

const animationRoot = ref<HTMLElement>()
const inputGridRoot = ref<HTMLElement>()
const matrixGridRoot = ref<HTMLElement>()
const matrixAnimationRoot = ref<HTMLElement>()
const outputAnimationRoot = ref<HTMLElement>()

const input = computed(() => props.input || [] as Array<number>)
const output = computed(() => props.output || [] as Array<number>)

const byteDivs = hexToDivs(input.value)
const { targetDivs, targetColumnClass } = addAnimationClasses(byteDivs, 'mix-columns-i')

const matrixByteDivs = hexToDivs(props.matrix)

const outputDivs = hexToDivs(output.value)
const { targetDivs: outputTargetDivs, targetColumnClass: outputTargetColumnClass, targetAllClass: outputTargetAllClass } = addAnimationClasses(outputDivs, 'mix-columns-o')

const createAnimation = () => {
  const columnSize = DIV_WIDTH + COL_GAP
  for (let column = 0; column < 4; column++) {
    props.timeline.add({
      targets: targetColumnClass(column),
      translateX: 286 - column * columnSize,
    }).add({
      targets: '.columnVectorPlaceholder',
      opacity: 1,
    }, '-=300').add({
      targets: '.multiplySymbol',
      opacity: 1,
    }, '-=300').add({
      targets: outputTargetColumnClass(column),
      opacity: 1,
    }).add({
      targets: [targetColumnClass(column), '.columnVectorPlaceholder', '.multiplySymbol'],
      opacity: 0,
    }, '+=1000')
  }

  props.timeline.add({
    targets: outputTargetAllClass,
    color: '#745CD0'
  })
}

watch([input, output], ([newInput, newOutput]) => {
  updateDivs(byteDivs, newInput)
  updateDivs(targetDivs, newInput)
  updateDivs(outputTargetDivs, newOutput)
})

watch(() => props.timeline, () => {
  createAnimation()
})

onMounted(() => {
  byteDivs.forEach(div => inputGridRoot.value?.appendChild(div))
  targetDivs.forEach(div => animationRoot.value?.appendChild(div))
  matrixByteDivs.forEach(div => matrixGridRoot.value?.appendChild(div))
  outputTargetDivs.forEach(div => outputAnimationRoot.value?.appendChild(div))

  createAnimation()
})
</script>

<template>
  <div class="mixColumnsRoot">
    <h4>{{ t('simulator.input') }}</h4>
    <h4 class="constantHeader">{{ t('simulator.constant-matrix') }}</h4>
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

    <div class="relative matrixRoot">
      <div
        ref="matrixGridRoot"
        class="animationGrid absolute matrixBrackets"
      ></div>
      <figure
        ref="matrixAnimationRoot"
        class="animationGrid"
      >
      </figure>
      <div class="multiplySymbol">•</div>
      <div class="columnVectorPlaceholder matrixBrackets" />
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
.mixColumnsRoot {
  display: grid;
  grid-template-columns: repeat(3, min-content);
  grid-template-rows: repeat(2, min-content);
  column-gap: 40px;
  row-gap: 8px;

  &>*:nth-child(3n) {
    margin-left: 80px;
  }

  .matrixRoot {
    margin-left: 6px;
  }

  .startNoOpacity {
    &>div {
      opacity: 0;
    }
  }

  .constantHeader {
    white-space: nowrap;
  }

  .multiplySymbol {
    position: absolute;
    top: 36.5%;
    right: -3px;
    opacity: 0;
  }

  .columnVectorPlaceholder {
    position: absolute;
    top: 0;
    right: -40px;
    width: 23px;
    height: 100%;
    opacity: 0;
  }
}
</style>