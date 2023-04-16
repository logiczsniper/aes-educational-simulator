<script setup lang="ts">
import { TutorialKey } from '~~/composables/useTutorial';

const props = defineProps<{
  tutorialKey?: TutorialKey;
}>()

const tutorial = useTutorial()

const sidebar = useSidebar()

const isSelected = computed(() => props.tutorialKey === tutorial.currentTutorialKey)

const onClick = (e: Event) => {
  if (props.tutorialKey === undefined) return;

  if (isSelected.value) {
    tutorial.setCurrentTutorialKey(TutorialKey.Default)
    sidebar.shrink()
  } else {
    tutorial.setCurrentTutorialKey(props.tutorialKey)
    sidebar.expand()
  }

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