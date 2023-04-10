<script setup lang="ts">
import type { AnimeTimelineInstance } from 'animejs';
import { AesiExpandKeyRoundStepAddWords, AesiKeySize } from '~~/utils/aesi/aesi.types';
import { addAnimationClasses } from '~~/utils/animation/addAnimationClasses';
import { updateWordDivs } from '~~/utils/animation/updateWordDivs';
import { wordsToDivs } from '~~/utils/animation/wordsToDivs';

const props = defineProps<{
  timeline: AnimeTimelineInstance,
  keySize: AesiKeySize,
  hasHFn: boolean,
  step?: AesiExpandKeyRoundStepAddWords,
}>();

const { t } = useI18n();

const animationRoot = ref<HTMLElement>()
const inputGridRoot = ref<HTMLElement>()
const outputAnimationRoot = ref<HTMLElement>()

const input = computed(() => props.step?.inputWords || [])
const output = computed(() => props.step?.outputWords || [])
const columnCount = computed(() => props.keySize / 32)

const hasHFn = computed(() => props.hasHFn)

const inputWordDivs = wordsToDivs(input.value)
const { targetDivs, targetColumnClass } = addAnimationClasses(inputWordDivs, `add-words-i`, columnCount.value)

const outputWordDivs = wordsToDivs(output.value)
const { targetDivs: outputTargetDivs, targetAllClass: outputTargetAllClass, targetColumnClass: targetOutputColumnClass } = addAnimationClasses(outputWordDivs, `add-words-o`, columnCount.value)

const gFnInput = computed(() => input.value.at(-1))
const gFnInputString = computed(() => Array.from(gFnInput.value || [])?.map(hexToString).join(""))

const hFnInput = computed(() => output.value.at(3))
const hFnInputString = computed(() => Array.from(hFnInput.value || [])?.map(hexToString).join(""))

const xorSymbolClass = 'addWordsXor'
const xorSymbolTarget = `.${xorSymbolClass}`

const gFnClass = 'gFnBox'
const gFnTarget = `.${gFnClass}`

const hFnClass = 'hFnBox'
const hFnTarget = `.${hFnClass}`

const hFnInputClass = 'hFnInput'
const hFnInputTarget = `.${hFnInputClass}`

const gFnInputClass = 'gFnInput'
const gFnInputTarget = `.${gFnInputClass}`

const createAnimation = () => {
  const gFnInputTranslateX = (() => {
    switch (columnCount.value) {
      case 4: return -240.0
      case 6: return -409.2
      case 8: return -578.8
      default: return 0
    }
  })()
  const translateY = 71.34
  const lastColumnTarget = targetColumnClass(columnCount.value - 1)

  props.timeline.add({
    targets: lastColumnTarget,
    translateX: gFnInputTranslateX,
    translateY
  }).add({
    targets: gFnTarget,
    opacity: 1,
  }, '-=150').add({
    targets: lastColumnTarget,
    opacity: 0,
    duration: 100,
  }).add({
    targets: gFnInputTarget,
    opacity: 1,
    duration: 100,
  }, '-=100').add({
    targets: lastColumnTarget,
    translateX: 0,
    translateY: 0,
    duration: 1,
  }).add({
    targets: lastColumnTarget,
    opacity: 1,
  })

  const halfWayPoint = 3
  let inSecondHalf = false
  let targetsToDisappear = [lastColumnTarget, gFnTarget, gFnInputTarget]
  const highestColumnIndex = Math.min(columnCount.value, output.value.length)

  for (let column = 0; column < highestColumnIndex; column++) {
    const _column = inSecondHalf ? column + halfWayPoint : column
    const _xorColumn = inSecondHalf ? column - 1 : column
    const _secondHalfTranslateXCorrection = inSecondHalf ? -356 : 0
    targetsToDisappear.push(targetColumnClass(_column), `${xorSymbolTarget}-${_xorColumn}`)

    props.timeline.add({
      targets: `${xorSymbolTarget}-${_xorColumn}`,
      translateX: 102.2 * _xorColumn,
      duration: 1,
    }).add({
      targets: `${xorSymbolTarget}-${_xorColumn}`,
      opacity: 1,
    }, '+=1000').add({
      targets: targetColumnClass(_column),
      translateX: 123 + 17.5 * column + _secondHalfTranslateXCorrection,
      translateY
    }, '-=500').add({
      targets: targetOutputColumnClass(_column),
      opacity: 1,
    })

    const shouldPrepareForHFn = _column === halfWayPoint && hasHFn.value
    if (shouldPrepareForHFn) {
      props.timeline.add({
        targets: targetsToDisappear,
        opacity: 0,
      }, '+=1200').add({
        targets: hFnInputTarget,
        opacity: 1
      }, '-=700').add({
        targets: lastColumnTarget,
        translateX: 0,
        translateY: 0
      }).add({
        targets: lastColumnTarget,
        opacity: 1,
      }).add({
        targets: hFnTarget,
        opacity: 1
      }, '-=1200')

      column -= halfWayPoint
      inSecondHalf = true
      targetsToDisappear = [hFnTarget, hFnInputTarget]
    }

    const shouldBreak = _column >= columnCount.value - 1
    if (shouldBreak) break;
  }

  props.timeline.add({
    targets: targetsToDisappear,
    opacity: 0,
  }, '+=900')

  // TODO: double check numbers

  props.timeline.add({
    targets: outputTargetAllClass,
    color: '#745CD0'
  })
}

watch([input, output], ([newInput, newOutput]) => {
  updateWordDivs(inputWordDivs, newInput)
  updateWordDivs(targetDivs, newInput)
  updateWordDivs(outputTargetDivs, newOutput)
})

watch(() => props.timeline, () => {
  createAnimation()
})

onMounted(() => {
  inputWordDivs.forEach(div => inputGridRoot.value?.appendChild(div))
  outputTargetDivs.forEach(div => outputAnimationRoot.value?.appendChild(div))
  targetDivs.forEach(div => animationRoot.value?.appendChild(div))

  createAnimation()
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
        class="code"
        :class="hFnInputClass"
      >{{ hFnInputString }}</span>
      <span
        class="code"
        :class="gFnInputClass"
      >{{ gFnInputString }}</span>
      <span
        class='math'
        :class="hFnClass"
      >ℎ</span>
      <span
        class='math'
        :class="gFnClass"
      >𝑔</span>
      <span
        v-for="i in 8"
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

    .hFnInput {
      margin-left: 15px;
      top: 2px;
      position: absolute;
      opacity: 0;
    }

    .gFnInput {
      margin-left: 14.5px; // Cannot be touched! gFnInputTranslateX above relies on this.
      top: 3.5px;
      position: absolute;
      opacity: 0;
    }

    .addKeyXorSymbol {
      left: 103px;
      opacity: 0;
    }

    .gFnBox,
    .hFnBox {
      position: absolute;
      opacity: 0;

      &::after {
        content: "(\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0)";
        position: absolute;
        font-size: 16px;
      }
    }

    .gFnBox::after {
      left: 8px;
    }

    .hFnBox::after {
      top: -2px;
    }

    .hFnBox {
      font-size: 15px;
      top: 2px;
    }
  }

  .startNoOpacity {
    &>div {
      opacity: 0;
    }
  }
}
</style>