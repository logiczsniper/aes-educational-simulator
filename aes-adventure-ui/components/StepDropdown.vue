<script setup lang="ts">
import { TutorialKey } from '~~/composables/useTutorial';

const props = defineProps<{
  title: string;
  lineThroughTitle?: boolean;
  tutorialKey?: TutorialKey;
  backgroundColor?: string;
}>();
</script>

<template>
  <v-expansion-panels
    variant="popout"
    class="stepDropdown"
  >
    <v-expansion-panel
      eager
      elevation="0"
      :bg-color="props.backgroundColor"
    >
      <template #title>
        <h3
          class="title"
          :class="{ 'strikeThrough': props.lineThroughTitle }"
        >
          {{ props.title }}
          <span v-if="props.tutorialKey !== undefined">
            <TutorialIconButton :tutorial-key="props.tutorialKey" />
          </span>
        </h3>
      </template>
      <template #text>
        <slot />
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped lang="scss">
.stepDropdown {

  .title {
    display: flex;
    padding: 2px 0;
    font-size: 1.26em;

    &.strikeThrough {
      text-decoration: line-through;
    }

    span {
      margin-top: -2px;
      margin-left: 14px;
    }
  }

  :deep(.v-expansion-panel-title__overlay) {
    opacity: 0;
  }
}
</style>