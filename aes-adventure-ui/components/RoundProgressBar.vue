<script setup lang="ts">

const props = defineProps<{
  roundIndex: number;
  roundCount: number;
  smallRounds?: number[];
}>()

const emit = defineEmits<{
  (event: 'click', roundIndex: number): void
}>()

const gridTemplateColumns = computed(() => {
  let output = ''

  for (let round = 0; round < props.roundCount; round++) {
    output += props.smallRounds?.includes(round)
      ? '0.5fr '
      : '1fr '
  }

  return output
})
</script>

<template>
  <div
    class="roundProgressBar"
    :style="`grid-template-columns: ${gridTemplateColumns}`"
  >
    <span
      v-for="round in roundCount"
      :key="round"
      class="roundProgressBarPiece"
      :class="{
          'filled': (round - 1) < props.roundIndex,
          'current': (round - 1) === props.roundIndex
        }"
      @click="() => emit('click', round)"
    >
      <p class="roundProgressBarValue">{{ round }}</p>
    </span>
  </div>
</template>

<style lang="scss">
.roundProgressBar {
  height: 18px;
  width: 100%;
  margin: 0 16px;

  display: grid;
  transition: border-radius 0.20s,
    column-gap 0.3s ease,
    padding .3s,
    opacity .2s;

  border-radius: 0px;
  column-gap: 0px;

  .roundProgressBarValue {
    transition: opacity 1s, margin-left 0.7s;
    opacity: 0;
    font-size: 11px;
    user-select: none;
    -webkit-user-select: none;
  }

  .roundProgressBarPiece {
    background-color: white;
    transition: inherit;
    border-radius: inherit;

    &.filled {
      background-color: #745CD0;

      .roundProgressBarValue {
        color: white;
      }
    }

    &.current {
      background-color: #8C75E4;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;

      .roundProgressBarValue {
        color: white;
      }
    }

    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    &:hover:not(.current) {
      opacity: 0.9;
      cursor: pointer;
    }
  }

}
</style>