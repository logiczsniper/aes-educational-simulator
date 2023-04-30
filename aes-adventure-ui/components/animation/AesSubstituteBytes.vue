<script setup lang="ts">
import type { AnimeTimelineInstance } from 'animejs';
import { useTheme } from 'vuetify';
import { addAnimationClasses } from '~~/utils/animation/addAnimationClasses';
import { COL_GAP, DIV_HEIGHT, DIV_WIDTH, ROW_GAP } from '~~/utils/animation/constants';
import { hexToDivs } from '~~/utils/animation/hexToDivs';
import { updateDivs } from '~~/utils/animation/updateDivs';

const props = defineProps<{
  timeline: AnimeTimelineInstance,
  sbox: number[],
  input?: Uint8Array,
  output?: Uint8Array,
}>();

const { t } = useI18n();
const theme = useTheme()

const animationRoot = ref<HTMLElement>()
const inputGridRoot = ref<HTMLElement>()
const sboxAnimationRoot = ref<HTMLElement>()
const outputAnimationRoot = ref<HTMLElement>()

const input = computed(() => props.input || [] as Array<number>)
const output = computed(() => props.output || [] as Array<number>)

const byteDivs = hexToDivs(input.value)
const { targetDivs, targetChildClass } = addAnimationClasses(byteDivs, 'substitute-bytes-i')

const sboxByteDivs = hexToDivs(props.sbox)
const { targetDivs: sboxTargetDivs, targetColumnClass: sboxTargetColumnClass, targetRowClass: sboxTargetRowClass, targetCoordsClass: sboxTargetCoordsClass } = addAnimationClasses(sboxByteDivs, 'substitute-bytes-sbox', 16)

const outputDivs = hexToDivs(output.value)
const { targetDivs: outputTargetDivs, targetCoordsClass: outputTargetCoordsClass, targetAllClass: outputTargetAllClass } = addAnimationClasses(outputDivs, 'substitute-bytes-o')

const createAnimation = () => {
  const columnSize = DIV_WIDTH + COL_GAP
  const rowSize = DIV_HEIGHT + ROW_GAP
  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      const firstChildContent = document.getElementsByClassName(targetChildClass(row, column, 1).substring(1)).item(0)?.textContent ?? '0'
      const secondChildContent = document.getElementsByClassName(targetChildClass(row, column, 2).substring(1)).item(0)?.textContent ?? '0'

      const firstChildHex = parseInt(firstChildContent, 16)
      const secondChildHex = parseInt(secondChildContent, 16)

      props.timeline.add({
        targets: targetChildClass(row, column, 1),
        translateX: 140 - column * columnSize,
        translateY: 22 + rowSize * (firstChildHex - row)
      }).add({
        targets: targetChildClass(row, column, 1),
        opacity: 0,
      }, '-=320').add({
        targets: sboxTargetRowClass(firstChildHex),
        color: '#D755B9'
      }, '-=300').add({
        targets: targetChildClass(row, column, 2),
        translateX: 155 + columnSize * (secondChildHex - column),
        translateY: -1 * rowSize * row
      }).add({
        targets: targetChildClass(row, column, 2),
        opacity: 0,
      }, '-=320').add({
        targets: sboxTargetColumnClass(secondChildHex),
        color: '#D755B9'
      }, '-=300').add({
        targets: sboxTargetCoordsClass(firstChildHex, secondChildHex),
        color: '#745CD0'
      }, '-=200').add({
        targets: outputTargetCoordsClass(row, column),
        opacity: 1,
      }).add({
        targets: [sboxTargetRowClass(firstChildHex), sboxTargetColumnClass(secondChildHex)],
        color: theme.current.value.dark ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)' // this is the color set by vuetify, we cannot simply 'unset' in this animation
      }, '+=1100')
    }
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
  sboxTargetDivs.forEach((div, index) => {
    if (index % 16 === 0) {
      const counterDiv = document.createElement('div')
      counterDiv.classList.add('code', 'leftDiv')
      counterDiv.textContent = (index / 16).toString(16)

      sboxAnimationRoot.value?.appendChild(counterDiv)
    }
    sboxAnimationRoot.value?.appendChild(div)
  })
  outputTargetDivs.forEach(div => outputAnimationRoot.value?.appendChild(div))

  createAnimation()
})
</script>

<template>
  <div class="substituteBytesRoot">
    <h4>{{ t('simulator.input') }}</h4>
    <h4>{{ t('simulator.sbox') }}</h4>
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
      <figure
        ref="outputAnimationRoot"
        class="animationGrid startNoOpacity"
      >
      </figure>
    </div>
  </div>
</template>

<style lang="scss">
.substituteBytesRoot {
  display: grid;
  grid-template-columns: repeat(3, min-content);
  grid-template-rows: repeat(2, min-content);
  column-gap: 40px;
  row-gap: 8px;

  .startNoOpacity {
    &>div {
      opacity: 0;
    }
  }
}
</style>