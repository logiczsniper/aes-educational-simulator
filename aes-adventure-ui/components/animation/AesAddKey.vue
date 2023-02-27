<script setup lang="ts">
import type { AnimeTimelineInstance } from 'animejs';
import { hexToDivs } from '~~/utils/animation/hexToDivs';
import { addAnimationClasses } from '~~/utils/animation/addAnimationClasses';

const props = defineProps<{
  timeline: AnimeTimelineInstance
}>();

const { t } = useI18n();

const animationRoot = ref<HTMLElement>()
const inputGridRoot = ref<HTMLElement>()
const keyAnimationRoot = ref<HTMLElement>()
const keyGridRoot = ref<HTMLElement>()

const encryptState = useEncryptState()

const plaintext = computed(() => encryptState.plaintext)
const key = computed(() => encryptState.key)
const state = computed(() => encryptState.output?.initialState ?? [])

const byteDivs = hexToDivs(plaintext.value)
const { targetDivs, targetAllClass, targetCoordsClass } = addAnimationClasses(byteDivs, 'add-key-i')

const keyByteDivs = hexToDivs(key.value)
const { targetDivs: keyTargetDivs, targetCoordsClass: keyTargetCoordsClass } = addAnimationClasses(keyByteDivs, 'add-key-k')

onMounted(() => {
  byteDivs.forEach(byteDiv => inputGridRoot.value?.appendChild(byteDiv))
  targetDivs.forEach(targetDiv => animationRoot.value?.appendChild(targetDiv))
  keyByteDivs.forEach(byteDiv => keyGridRoot.value?.appendChild(byteDiv))
  keyTargetDivs.forEach(targetDiv => keyAnimationRoot.value?.appendChild(targetDiv))

  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      props.timeline.add({
        targets: keyTargetCoordsClass(row, column),
        translateX: 140
      }).add({
        targets: targetCoordsClass(row, column),
        translateX: 300,
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

    <div />
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
}
</style>