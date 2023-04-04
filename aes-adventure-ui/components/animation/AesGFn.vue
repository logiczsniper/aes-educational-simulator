<script setup lang="ts">
import anime from 'animejs';
import type { AnimeTimelineInstance } from 'animejs';
import { COL_GAP, DIV_HEIGHT, DIV_WIDTH, ROW_GAP } from '~~/utils/animation/constants';
import { addAnimationClasses } from '~~/utils/animation/addAnimationClasses';
import { AesiExpandKeyRoundStepRoundGFn } from '~~/utils/aesi/aesi.types';
import { hexToDivs } from '~~/utils/animation/hexToDivs';
import { S_BOX } from '~~/utils/aesi/core/constants';
import { updateDivs } from '~~/utils/animation/updateDivs';

const props = defineProps<{
  timeline: AnimeTimelineInstance,
  input?: Uint8Array[],
  step?: AesiExpandKeyRoundStepRoundGFn,
}>();

const { t } = useI18n();

const animationRoot = ref<HTMLElement>()
const inputGridRoot = ref<HTMLElement>()
const shiftAnimationRoot = ref<HTMLElement>()
const sboxAnimationRoot = ref<HTMLElement>()
const outputAnimationRoot = ref<HTMLElement>()

const input = computed(() => props.input?.at(-1) || [])
const shiftOutput = computed(() => props.step?.rotateWordOutput || [])
const subOutput = computed(() => props.step?.subWordOutput || [])

const byteDivs = hexToDivs(input.value)
const { targetDivs, targetColumnClass, targetChildClass } = addAnimationClasses(byteDivs, "g-fn")

const sboxByteDivs = hexToDivs(S_BOX)
const { targetDivs: sboxTargetDivs, targetColumnClass: sboxTargetColumnClass, targetRowClass: sboxTargetRowClass, targetCoordsClass: sboxTargetCoordsClass } = addAnimationClasses(sboxByteDivs, 'g-fn-substitute-bytes-sbox', 16)

const subOutputDivs = hexToDivs(subOutput.value)
const { targetDivs: subOutputTargetDivs, targetCoordsClass: subOutputTargetCoordsClass, targetColumnClass: subOutputTargetColumnClass } = addAnimationClasses(subOutputDivs, 'g-fn-substitute-bytes-o')

const shiftOutputDivs = hexToDivs(shiftOutput.value)
const { targetDivs: shiftOutputTargetDivs } = addAnimationClasses(shiftOutputDivs, 'g-fn-shift-o')

const xorSymbolClass = 'gFnXor'
const xorSymbolTarget = `.${xorSymbolClass}`

const rconNewByteClass = 'gFnRconNewByte'
const rconNewByteTarget = `.${rconNewByteClass}`

const inputGridRootClass = 'gFnInputGridRoot'
const inputGridRootTarget = `.${inputGridRootClass}`

const createAnimation = () => {
  for (let column = 0; column < 4; column++) {
    props.timeline.add({
      targets: targetColumnClass(column),
      translateX: 8 * column,
      delay: anime.stagger(20, { direction: 'reverse' }),
    }, '-=600')
  }

  props.timeline.add({
    targets: inputGridRootTarget,
    opacity: 1,
  })

  const columnSize = DIV_WIDTH + COL_GAP
  const rowSize = DIV_HEIGHT + ROW_GAP
  for (let column = 0; column < 4; column++) {
    const firstChildContent = document.getElementsByClassName(targetChildClass(0, column, 1).substring(1)).item(0)?.textContent ?? '0'
    const secondChildContent = document.getElementsByClassName(targetChildClass(0, column, 2).substring(1)).item(0)?.textContent ?? '0'

    const firstChildHex = parseInt(firstChildContent, 16)
    const secondChildHex = parseInt(secondChildContent, 16)
    props.timeline.add({
      targets: targetChildClass(0, column, 1),
      translateX: 140 - column * columnSize,
      translateY: 22 + rowSize * firstChildHex
    }).add({
      targets: targetChildClass(0, column, 1),
      opacity: 0,
    }, '-=320').add({
      targets: sboxTargetRowClass(firstChildHex),
      color: '#D755B9'
    }, '-=300').add({
      targets: targetChildClass(0, column, 2),
      translateX: 155 + columnSize * (secondChildHex - column)
    }).add({
      targets: targetChildClass(0, column, 2),
      opacity: 0,
    }, '-=320').add({
      targets: sboxTargetColumnClass(secondChildHex),
      color: '#D755B9'
    }, '-=300').add({
      targets: sboxTargetCoordsClass(firstChildHex, secondChildHex),
      color: '#745CD0'
    }, '-=200').add({
      targets: subOutputTargetCoordsClass(0, column),
      opacity: 1,
    }).add({
      targets: [sboxTargetRowClass(firstChildHex), sboxTargetColumnClass(secondChildHex)],
      color: 'rgba(0, 0, 0, 0.87)', // this is the color set by vuetify, we cannot simply 'unset' in this animation
    }, '+=1100')
  }

  const initialTranslateX = -28
  props.timeline.add({
    targets: subOutputTargetDivs,
    translateX: initialTranslateX,
  }).add({
    targets: subOutputTargetColumnClass(0),
    keyframes: [
      { translateY: rowSize },
      { translateX: initialTranslateX + columnSize * 4 },
      { translateY: 0 },
    ]
  }).add({
    targets: subOutputTargetColumnClass(1),
    translateX: -128,
  }, '+=200').add({
    targets: xorSymbolTarget,
    opacity: 1
  }).add({
    targets: rconNewByteTarget,
    opacity: 1,
  }).add({
    targets: [xorSymbolTarget, subOutputTargetColumnClass(1)],
    opacity: 0
  }, '+=400')

  // TODO: numbers are wrong in later stages; investigate after optimise

  props.timeline.add({
    targets: subOutputTargetColumnClass(2),
    translateX: -35,
  })

  props.timeline.add({
    targets: subOutputTargetColumnClass(3),
    translateX: -43,
  }, '-=600')

  props.timeline.add({
    targets: subOutputTargetColumnClass(0),
    translateX: 57,
  }, '-=600')

  props.timeline.add({
    targets: [rconNewByteTarget, subOutputTargetDivs],
    color: '#745CD0'
  })
}

watch([input, shiftOutput, subOutput], ([newInput, newShiftOutput, newSubOutput]) => {
  updateDivs(byteDivs, newInput)
  updateDivs(targetDivs, newInput)
  updateDivs(shiftOutputDivs, newShiftOutput)
  updateDivs(shiftOutputTargetDivs, newShiftOutput)
  updateDivs(subOutputDivs, newSubOutput)
  updateDivs(subOutputTargetDivs, newSubOutput)
})

watch(() => props.timeline, () => {
  createAnimation()
})

onMounted(() => {
  byteDivs.forEach(div => inputGridRoot.value?.appendChild(div))
  targetDivs.forEach(div => animationRoot.value?.appendChild(div))
  shiftOutputTargetDivs.forEach(div => shiftAnimationRoot.value?.appendChild(div))
  sboxTargetDivs.forEach((div, index) => {
    if (index % 16 === 0) {
      const counterDiv = document.createElement('div')
      counterDiv.classList.add('code', 'leftDiv')
      counterDiv.textContent = (index / 16).toString(16)

      sboxAnimationRoot.value?.appendChild(counterDiv)
    }
    sboxAnimationRoot.value?.appendChild(div)
  })
  subOutputTargetDivs.forEach(div => outputAnimationRoot.value?.appendChild(div))

  createAnimation()
})
</script>

<template>
  <div class="gFnRoot">
    <h4>{{ t('simulator.input') }}</h4>
    <h4>{{ t('simulator.sbox') }}</h4>
    <h4>{{ t('simulator.rcon') }}</h4>
    <h4>{{ t('simulator.output') }}</h4>

    <div class="relative">
      <div
        ref="inputGridRoot"
        class="animationGrid absolute"
        :class="inputGridRootClass"
      ></div>
      <figure
        ref="animationRoot"
        class="animationGrid compact"
      >
      </figure>
    </div>

    <div class="relative">
      <figure
        ref="sboxAnimationRoot"
        class="animationGridSbox"
      >
        <div />
        <div
          v-for="i in 16"
          class="upperDiv code"
        >{{ (i - 1).toString(16) }}</div>
      </figure>
    </div>

    <div class="relative">
      <div class="code">{{ formatHex(step?.addRoundConstantOutput.roundConstant || 0) }}</div>
      <span
        class="addKeyXorSymbol absolute"
        :class="xorSymbolClass"
      >⊕</span>
      <div
        class="code"
        :class="rconNewByteClass"
      >{{ formatHex(step?.addRoundConstantOutput.output?.at(0) || 0) }}</div>
      <div
        ref="addGridRoot"
        class="animationGrid absolute"
      ></div>
      <figure
        ref="addAnimationRoot"
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
.gFnRoot {
  display: grid;
  grid-template-columns: repeat(4, min-content);
  grid-template-rows: repeat(2, min-content);
  column-gap: 40px;
  row-gap: 8px;

  h4 {
    white-space: nowrap;
  }

  &>*:nth-child(4n + 2) {
    margin-left: 24px;
  }

  .addKeyXorSymbol {
    top: -3px;
    left: 28px;
    opacity: 0;
  }

  .gFnInputGridRoot {
    opacity: 0;
  }

  .gFnRconNewByte {
    position: absolute;
    top: 0;
    left: 152px;
    opacity: 0;
  }

  .startNoOpacity {
    &>div {
      opacity: 0;
    }
  }
}
</style>