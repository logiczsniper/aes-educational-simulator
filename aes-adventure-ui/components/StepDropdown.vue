<script setup lang="ts">
import { TutorialKey } from '~~/composables/useTutorial';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  title: string;
  eager: boolean;
  turnedOff?: boolean;
  layerIcon?: string;
  lineThroughTitle?: boolean;
  tutorialKey?: TutorialKey;
  backgroundColor?: string;
  noAutoScrollOnUpdate?: boolean;
  variant?: "popout" | "default";
}>();

const hoverEager = ref(false)
const makeHoverEager = () => hoverEager.value = true

const variant = computed(() => props.variant ?? "popout")

const expansionPanelValue = `step-dropdown--${props.title}`
const backgroundColor = computed(() => (props.turnedOff ? '#C34A36' : undefined) ?? props.backgroundColor)
const lineThroughTitle = computed(() => props.turnedOff ?? props.lineThroughTitle)
const eager = computed(() => props.eager || hoverEager.value)
const layerTooltip = computed(() => t(props.layerIcon === 'mdi-layers' ? 'simulator.layer-on' : 'simulator.layer-off'))

const scrollTarget = ref<HTMLElement>()
const tryScrollToBody = (animationDuration: number) => {
  setTimeout(() => {
    scrollTarget.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'center'
    })
  }, animationDuration)
}

watch(() => props.modelValue, newModelValue => {
  if (newModelValue && !props.noAutoScrollOnUpdate) tryScrollToBody(400)
})

onMounted(() => {
  if (props.modelValue) tryScrollToBody(900)
})
</script>

<template>
  <v-expansion-panels
    :model-value="props.modelValue ? expansionPanelValue : null"
    :readonly="props.modelValue"
    :variant="variant"
    class="stepDropdown"
    :class="{ 'readonly': props.modelValue }"
    @mouseenter="makeHoverEager"
  >
    <v-expansion-panel
      :value="expansionPanelValue"
      :eager="eager"
      elevation="0"
      :bg-color="backgroundColor"
      role="region"
      aria-label="AES step dropdown."
    >
      <template #title>
        <div
          ref="scrollTarget"
          style="position: absolute; top: 12px"
        />
        <div class="titleContainer">
          <h3
            class="title"
            :class="{ 'strikeThrough': lineThroughTitle, 'underline': props.modelValue }"
          >
            <div v-html="props.title" />
            <span v-if="props.tutorialKey !== undefined && !props.turnedOff">
              <TutorialIconButton :tutorial-key="props.tutorialKey" />
            </span>
          </h3>
          <v-tooltip
            location="top"
            aria-label="Layer status tooltip."
          >
            <p
              class="tooltip"
              v-html="layerTooltip"
            />
            <template v-slot:activator="{ props }">
              <v-icon
                v-if="layerIcon"
                v-bind="props"
                class="layerIcon"
                :icon="layerIcon"
                size="20"
              />
            </template>
          </v-tooltip>
        </div>

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

  .titleContainer {
    display: flex;

    .title {
      display: flex;
      padding: 2px 0;
      font-size: 1.26em;
      transition: text-decoration 2.4s;
      text-underline-offset: 6px;
      text-decoration-color: transparent;

      &.strikeThrough {
        text-decoration: line-through;
      }

      &.underline {
        text-decoration: underline;
        text-decoration-style: wavy;
        text-decoration-color: rgba(var(--v-theme-opposite), 0.25);
      }

      span {
        margin-top: -2px;
        margin-left: 14px;
      }
    }

    .layerIcon {
      position: absolute;
      right: 58px
    }
  }

  &.readonly {

    :deep(.v-expansion-panel-title__overlay),
    :deep(.v-expansion-panel-title__icon) {
      cursor: default;
    }
  }

  :deep(.v-expansion-panel-title__overlay) {
    opacity: 0;
  }
}

.tooltip {
  color: white;
}
</style>