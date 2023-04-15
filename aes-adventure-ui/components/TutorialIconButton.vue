<script setup lang="ts">
import { TutorialKey } from '~~/composables/useTutorial';

const props = defineProps<{
  tutorialKey?: TutorialKey;
}>()

const tutorial = useTutorial()

// expand width on open, saving the previous width? 
// return to previous width on close

const isSelected = computed(() => props.tutorialKey === tutorial.currentTutorialKey)

const onClick = (e: Event) => {
  if (props.tutorialKey === undefined) return;

  isSelected.value
    ? tutorial.setCurrentTutorialKey(TutorialKey.Default)
    : tutorial.setCurrentTutorialKey(props.tutorialKey)
  e.preventDefault()
  e.stopPropagation()
}
</script>

<template>
  <v-btn
    :icon="isSelected ? 'mdi-close' : 'mdi-information-variant'"
    :color="isSelected ? 'primary' : 'secondary'"
    size="xx-small"
    variant="flat"
    class="tutorialIconButton"
    @click="onClick"
  />
</template>

<style lang="scss">
.tutorialIconButton {
  padding: 2px;

  .v-icon {
    font-size: 10px;
  }
}
</style>