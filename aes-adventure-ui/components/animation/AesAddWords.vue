<script setup lang="ts">
import type { AnimeTimelineInstance } from 'animejs';
import { AesiExpandKeyRoundStepAddWords, AesiKeySize } from '~~/utils/aesi/aesi.types';
import { addAnimationClasses } from '~~/utils/animation/addAnimationClasses';
import { wordsToDivs } from '~~/utils/animation/wordsToDivs';

const props = defineProps<{
  timeline: AnimeTimelineInstance,
  keySize: AesiKeySize,
  input?: Uint8Array,
  step?: AesiExpandKeyRoundStepAddWords,
}>();

const { t } = useI18n();

const animationRoot = ref<HTMLElement>()
const inputGridRoot = ref<HTMLElement>()
const outputAnimationRoot = ref<HTMLElement>()

const input = computed(() => props.step?.inputWords || [])
const output = computed(() => props.step?.outputWords || [])
const columnCount = computed(() => props.keySize / 32)

const inputWordDivs = wordsToDivs(input.value)
const { targetDivs, targetAllClass, targetColumnClass } = addAnimationClasses(inputWordDivs, `add-words-i`, columnCount.value)

const outputWordDivs = wordsToDivs(output.value)
const { targetDivs: outputTargetDivs, targetAllClass: outputTargetAllClass, targetColumnClass: targetOutputColumnClass } = addAnimationClasses(outputWordDivs, `add-words-o`, columnCount.value)

const xorSymbolClass = 'addWordsXor'
const xorSymbolTarget = `.${xorSymbolClass}`

const gFnClass = 'gFnBox'
const gFnTarget = `.${gFnClass}`

const hFnClass = 'hFnBox'
const hFnTarget = `.${hFnClass}`

onMounted(() => {
  inputWordDivs.forEach(div => inputGridRoot.value?.appendChild(div))
  outputTargetDivs.forEach(div => outputAnimationRoot.value?.appendChild(div))
  targetDivs.forEach(div => animationRoot.value?.appendChild(div))

  const translateY = 71
  const firstHalfTargets = [targetColumnClass(columnCount.value - 1), gFnTarget, `${xorSymbolTarget}-0`, targetColumnClass(0)]

  props.timeline.add({
    targets: targetColumnClass(columnCount.value - 1),
    translateX: -(76.5 * (columnCount.value) - 32.5),
    translateY
  }).add({
    targets: [gFnTarget, `${xorSymbolTarget}-0`],
    opacity: 1,
  }).add({
    targets: targetColumnClass(0),
    translateX: 123,
    translateY
  }, '-=800').add({
    targets: targetOutputColumnClass(0),
    opacity: 1,
  })

  const maxFirstHalfColumns = columnCount.value === 8 ? 4 : columnCount.value
  for (let column = 1; column < maxFirstHalfColumns; column++) {
    firstHalfTargets.push(targetColumnClass(column), `${xorSymbolTarget}-${column}`)

    props.timeline.add({
      targets: targetColumnClass(column),
      translateX: 123 + 17.5 * column,
      translateY
    }).add({
      targets: `${xorSymbolTarget}-${column}`,
      translateX: 102.8 * column,
      duration: 100,
    }, '-=50').add({
      targets: `${xorSymbolTarget}-${column}`,
      opacity: 1,
    }).add({
      targets: targetOutputColumnClass(column),
      opacity: 1,
    })
  }


  props.timeline.add({
    targets: firstHalfTargets,
    opacity: 0,
  })

  // Reset last word for usage in its own computation in second half
  props.timeline.add({
    targets: targetColumnClass(columnCount.value - 1),
    translateX: 0,
    translateY: 0
  })
  props.timeline.add({
    targets: targetColumnClass(columnCount.value - 1),
    opacity: 1,
  })

  props.timeline.add({
    targets: hFnTarget,
    opacity: 1
  })

  // TODO: make h-fn input appear in between brackets
  // TODO: continue addition with the rest of the input words
  // TODO: make work for other key sizes
  // TODO: optimize
  // TODO: double check numbers

  // for (let column = 0; column < columnCount.value; column++) {
  //   props.timeline.add({
  //     targets: targetColumnClass(column),
  //     translateY: 40,
  //     translateX: 86,
  //     delay: anime.stagger(18, { direction: 'reverse' }),
  //   }, column === 0 ? undefined : '-=500')
  // }

  // for (let row = 0; row < 4; row++) {
  //   for (let column = 0; column < columnCount.value; column++) {

  //   }
  // }

  props.timeline.add({
    targets: outputTargetAllClass,
    color: '#745CD0'
  })
})
</script>

<template>
  <div class="addWordsRoot">
    <div class="input relative">
      <h4>{{ t('simulator.input') }}</h4>
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

    <div class="intermediate">
      <span
        class='math'
        :class="hFnClass"
      >ℎ</span>
      <span
        class='math'
        :class="gFnClass"
      >𝑔</span>
      <span
        v-for="i in 4"
        class="addKeyXorSymbol absolute"
        :class="{
          [xorSymbolClass]: true,
          [`${xorSymbolClass}-${i - 1}`]: true,
        }"
      >⊕</span>
    </div>

    <div class="output">
      <h4>{{ t('simulator.output') }}</h4>
      <figure
        ref="outputAnimationRoot"
        class="animationGridKey startNoOpacity"
        :class="{
          'small': columnCount === 4,
          'medium': columnCount === 6,
          'large': columnCount === 8,
        }"
      >
      </figure>
    </div>
  </div>
</template>

<style lang="scss">
.addWordsRoot {
  display: grid;
  row-gap: 38px;

  h4 {
    margin-bottom: 8px;
  }

  .intermediate {
    position: relative;
    height: 24px;

    .addKeyXorSymbol {
      left: 102px;
      opacity: 0;
    }

    // .hFnBox {
    //   position: relative;
    //   margin-left: 1px;

    //   &::after {
    //     content: "(\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0)";
    //     position: absolute;
    //     // top: -3px;
    //     left: 12px;
    //   }
    // }

    .gFnBox,
    .hFnBox {
      position: absolute;
      opacity: 0;

      &::after {
        content: "(\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0)";
        position: absolute;
      }
    }

    .gFnBox::after {
      left: 8px;
    }

    .hFnBox {
      margin-left: -2px;
    }
  }

  .startNoOpacity {
    &>div {
      opacity: 0;
    }
  }
}
</style>