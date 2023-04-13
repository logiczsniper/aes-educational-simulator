<script setup lang="ts">
import { TutorialKey } from '~~/composables/useTutorial';

const props = defineProps<{
  modelValue: boolean;
  title: string;
  eager: boolean;
  turnedOff?: boolean;
  lineThroughTitle?: boolean;
  tutorialKey?: TutorialKey;
  backgroundColor?: string;
  noAutoScrollOnUpdate?: boolean;
}>();

const hoverEager = ref(false)
const makeHoverEager = () => hoverEager.value = true

const expansionPanelValue = `step-dropdown--${props.title}`
const backgroundColor = computed(() => (props.turnedOff ? '#CC3933' : undefined) ?? props.backgroundColor)
const lineThroughTitle = computed(() => props.turnedOff ?? props.lineThroughTitle)
const eager = computed(() => props.eager || hoverEager.value)

const scrollTarget = ref<HTMLElement>()
const tryScrollToBody = () => {
  const animationDuration = 350
  setTimeout(() => {
    scrollTarget.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'center'
    })
  }, animationDuration)
}

watch(() => props.modelValue, newModelValue => {
  if (newModelValue && !props.noAutoScrollOnUpdate) tryScrollToBody()
})

onMounted(() => {
  if (props.modelValue) tryScrollToBody()
})

</script>

<template>
  <v-expansion-panels
    :model-value="props.modelValue ? expansionPanelValue : null"
    :readonly="props.modelValue"
    variant="popout"
    class="stepDropdown"
    @mouseenter="makeHoverEager"
  >
    <v-expansion-panel
      :value="expansionPanelValue"
      :eager="eager"
      elevation="0"
      :bg-color="backgroundColor"
    >
      <template #title>
        <div
          ref="scrollTarget"
          style="position: absolute; top: 12px"
        />
        <h3
          class="title"
          :class="{ 'strikeThrough': lineThroughTitle }"
        >
          <div v-html="props.title" />
          <span v-if="props.tutorialKey !== undefined && !props.turnedOff">
            <TutorialIconButton :tutorial-key="props.tutorialKey" />
          </span>
        </h3>
      </template>
      <template #text>
        <slot />
        <div
          v-if="props.turnedOff"
          style="height: 8px"
        />
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