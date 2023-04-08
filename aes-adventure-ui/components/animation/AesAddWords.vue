<script setup lang="ts">
import type { AnimeTimelineInstance } from 'animejs';
import { AesiExpandKeyRoundStepAddWords, AesiKeySize } from '~~/utils/aesi/aesi.types';
import { addAnimationClasses } from '~~/utils/animation/addAnimationClasses';
import { COL_GAP } from '~~/utils/animation/constants';
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
const hasHFn = computed(() => columnCount.value === 8)

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

onMounted(() => {
  inputWordDivs.forEach(div => inputGridRoot.value?.appendChild(div))
  outputTargetDivs.forEach(div => outputAnimationRoot.value?.appendChild(div))
  targetDivs.forEach(div => animationRoot.value?.appendChild(div))

  const translateY = 71
  const firstHalfTargets = [targetColumnClass(columnCount.value - 1), gFnTarget, `${xorSymbolTarget}-0`, targetColumnClass(0)]
  const offset = COL_GAP * (8 - columnCount.value)

  if (columnCount.value === 6) {
    props.timeline.add({
      targets: gFnInputTarget,
      translateX: -1.5,
      duration: 1
    })
  }

  props.timeline.add({
    targets: targetColumnClass(columnCount.value - 1),
    translateX: -(76.5 * (columnCount.value) - 32.5) + offset + (columnCount.value === 4 ? 2 : 0),
    translateY
  }).add({
    targets: gFnTarget,
    opacity: 1,
  }, '-=150').add({
    targets: `${xorSymbolTarget}-0`,
    opacity: 1,
  }, '+=1000').add({
    targets: targetColumnClass(0),
    translateX: 123,
    translateY
  }, '-=500').add({
    targets: targetOutputColumnClass(0),
    opacity: 1,
  }, '+=1000')

  if (!hasHFn.value) {
    props.timeline.add({
      targets: targetColumnClass(columnCount.value - 1),
      opacity: 0,
      duration: 100,
    }).add({
      targets: gFnInputTarget,
      opacity: 1,
      duration: 100,
    }, '-=100').add({
      targets: targetColumnClass(columnCount.value - 1),
      translateX: 0,
      translateY: 0,
      duration: 1,
    }).add({
      targets: targetColumnClass(columnCount.value - 1),
      opacity: 1,
    })
  }

  const maxFirstHalfColumns = hasHFn.value ? 4 : columnCount.value
  for (let column = 1; column < maxFirstHalfColumns; column++) {
    firstHalfTargets.push(targetColumnClass(column), `${xorSymbolTarget}-${column}`)

    props.timeline.add({
      targets: `${xorSymbolTarget}-${column}`,
      translateX: 102.2 * column,
      duration: 1,
    }).add({
      targets: `${xorSymbolTarget}-${column}`,
      opacity: 1,
    }, '+=1000').add({
      targets: targetColumnClass(column),
      translateX: 123 + 17.5 * column,
      translateY
    }, '-=500').add({
      targets: targetOutputColumnClass(column),
      opacity: 1,
    })
  }

  if (hasHFn.value) {
    props.timeline.add({
      targets: firstHalfTargets,
      opacity: 0,
    }, '+=1200').add({
      targets: hFnInputTarget,
      opacity: 1
    }, '-=700')

    // Reset last word for usage in its own computation in second half
    props.timeline.add({
      targets: targetColumnClass(columnCount.value - 1),
      translateX: 0,
      translateY: 0
    }).add({
      targets: targetColumnClass(columnCount.value - 1),
      opacity: 1,
    }).add({
      targets: hFnTarget,
      opacity: 1
    }, '-=1200')

    const secondHalfTargets = [hFnTarget, hFnInputTarget]
    for (let column = maxFirstHalfColumns; column < columnCount.value; column++) {
      secondHalfTargets.push(targetColumnClass(column), `${xorSymbolTarget}-${column}`)

      const columnFactor = column - maxFirstHalfColumns
      props.timeline.add({
        targets: `${xorSymbolTarget}-${column}`,
        translateX: 101.4 * columnFactor,
        duration: 1,
      }).add({
        targets: `${xorSymbolTarget}-${column}`,
        opacity: 1,
      }, '+=1000').add({
        targets: targetColumnClass(column),
        translateX: -216 + 16.5 * columnFactor,
        translateY
      }, '-=500').add({
        targets: targetOutputColumnClass(column),
        opacity: 1,
      })
    }

    props.timeline.add({
      targets: secondHalfTargets,
      opacity: 0,
    }, '+=900')
  } else {
    props.timeline.add({
      targets: [...firstHalfTargets, gFnInputTarget],
      opacity: 0,
    }, '+=900')
  }

  // TODO: optimize
  // TODO: double check numbers

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
      // margin-left: 13px;
      margin-left: 14.5px;
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