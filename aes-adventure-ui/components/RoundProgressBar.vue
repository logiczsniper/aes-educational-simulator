<script setup lang="ts">

const props = defineProps<{
  roundIndex: number;
  roundCount: number;
  smallLastRound?: boolean;
}>()

// TODO: props.smallRounds: number[]
// 192 bit has small rounds sprinkled around (key expansion only)

const emit = defineEmits<{
  (event: 'click', roundIndex: number): void
}>()
</script>

<template>
  <div
    class="roundProgressBar"
    :style="`grid-template-columns: repeat(${props.roundCount - 1}, 1fr) ${props.smallLastRound ? '0.5fr' : '1fr'}`"
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
    padding .3s;

  border-radius: 0px;
  column-gap: 0px;

  .roundProgressBarValue {
    transition: opacity 1s, margin-left 0.7s;
    opacity: 0;
    font-size: 11px;
    cursor: default;
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

    &:hover {
      opacity: 0.95;
    }
  }

}
</style>