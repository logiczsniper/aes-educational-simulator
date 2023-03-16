<script setup lang="ts">

const props = defineProps<{
  roundIndex: number;
  roundCount: number
}>()

const emit = defineEmits<{
  (event: 'click', roundIndex: number): void
}>()

</script>

<template>
  <div
    class="roundProgressBar"
    :style="`grid-template-columns: repeat(${props.roundCount}, 1fr)`"
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
    </span>

  </div>
</template>

<style lang="scss">
.roundProgressBar {
  height: 18px;
  width: 100%;
  margin: 0 16px;

  display: grid;
  transition: border-radius 0.25s,
    column-gap 0.6s ease,
    margin 0.3s;

  border-radius: 0px;
  column-gap: 0px;

  &:hover {
    border-radius: 4px;
    column-gap: 2px;
  }

  .roundProgressBarPiece {
    background-color: white;
    transition: inherit;
    border-radius: inherit;

    &.filled {
      background-color: #745CD0;
    }

    &.current {
      background-color: #8C75E4;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }

}
</style>