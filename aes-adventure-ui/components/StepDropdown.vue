<script setup lang="ts">
import { TutorialKey } from '~~/composables/useTutorial';

const props = defineProps<{
  modelValue: boolean;
  title: string;
  lineThroughTitle?: boolean;
  tutorialKey?: TutorialKey;
  backgroundColor?: string;
}>();

// TODO: disabled prop 
// TODO: disabled text prop
// TODO: use with configurations (disabled step if walkThroughConfig === step)

const expansionPanelValue = `step-dropdown--${props.title}`
</script>

<template>
  <v-expansion-panels
    :model-value="props.modelValue ? expansionPanelValue : null"
    :readonly="props.modelValue"
    variant="popout"
    class="stepDropdown"
  >
    <v-expansion-panel
      :value="expansionPanelValue"
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
        <div class="footerSlot">
          <slot name="footer" />
        </div>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped lang="scss">
.stepDropdown {
  content-visibility: auto;

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

  .footerSlot {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-right: 28px;
    margin-top: -8px;
    margin-bottom: 4px;
  }

  :deep(.v-expansion-panel-title__overlay) {
    opacity: 0;
  }
}
</style>