<script setup lang="ts">
import { TutorialKey } from '~~/composables/useTutorial';

const props = defineProps<{
  modelValue: boolean;
  roundIndex: number;
  roundCount: number;
}>();

const expansionPanelValue = `stat-dropdown`

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const roundNumber = computed(() => props.roundIndex + 1)
</script>

<template>
  <v-expansion-panels
    :model-value="props.modelValue ? expansionPanelValue : null"
    @update:model-value="newValue => emit('update:modelValue', newValue === expansionPanelValue)"
    variant="popout"
    class="statsDropdown"
  >
    <v-expansion-panel
      :value="expansionPanelValue"
      eager
      elevation="0"
      bg-color="#f9f9f9"
    >
      <template #title>
        <div
          class="titleContainer"
          :class="{ 'singleDigit': roundNumber < 10 }"
        >
          <div />
          <h4 class="roundLabel">{{ t('simulator.round') }}</h4>
          <h2 class="roundIndex">{{ roundNumber }}</h2>
          <h4 class="roundCount">/ {{ props.roundCount }}</h4>
        </div>
      </template>
      <template #text>
        Graphs yooooo
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped lang="scss">
.statsDropdown {
  content-visibility: auto;

  .titleContainer {
    display: grid;

    $icon-width: 22.5px;
    align-items: center;
    width: 100%;

    grid-template-columns: $icon-width 1fr 56px 1fr;

    &.singleDigit {
      grid-template-columns: $icon-width 1fr 38px 1fr;
    }

    .roundIndex {
      background-color: white;
      border-radius: 4px;
      place-self: center;
      padding: 14px;
      font-weight: bold;
    }

    .roundLabel {
      justify-self: flex-end;
      margin-right: 10px;
    }

    .roundIndex {}

    .roundCount {
      margin-left: 9px;
    }
  }

  :deep(.v-expansion-panel-title__overlay) {
    opacity: 0;
  }
}
</style>