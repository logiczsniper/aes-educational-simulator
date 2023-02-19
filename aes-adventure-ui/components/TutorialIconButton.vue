<script setup lang="ts">
import { TutorialKey } from '~~/composables/useTutorial';

const props = defineProps<{
  tutorialKey?: TutorialKey;
}>()

const tutorial = useTutorial()

const onClick = (e: Event) => {
  if (props.tutorialKey === undefined) return;

  tutorial.setCurrentTutorialKey(props.tutorialKey)
  e.preventDefault()
  e.stopPropagation()
}
</script>

<template>
  <v-btn
    icon="mdi-information-variant"
    color="secondary"
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