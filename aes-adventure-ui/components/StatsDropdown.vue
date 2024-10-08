<script setup lang="ts">
import { ApexOptions } from "apexcharts";
import ApexChart from "vue3-apexcharts";
import { useTheme } from 'vuetify';
import { AesiStatistics } from "~~/utils/statistics/generateStatistics";

const props = defineProps<{
  modelValue: boolean;
  stats: AesiStatistics;
  roundIndex: number;
  roundCount: number;
}>();

const expansionPanelValue = `stat-dropdown`

const { t } = useI18n();
const theme = useTheme()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const roundNumber = computed(() => props.roundIndex + 1)

const series = computed(() => {
  return [
    {
      name: ' ' + t('simulator.diffusion') + ' %',
      data: [...props.stats.diffusion.slice(0, props.roundIndex + 1)]
    },
    {
      name: ' ' + t('simulator.confusion') + ' %',
      data: [...props.stats.confusion.slice(0, props.roundIndex + 1)]
    },
  ]
})
const chartOptions: ApexOptions = {
  chart: {
    id: "vuechart-example",
    fontFamily: 'Inter',
    toolbar: {
      show: false,
      tools: {
        selection: false,
        pan: false,
        zoom: false,
      }
    },
  },
  // colors: ['#0084DB', '#67BAA6'],
  // colors: ['#B8D05C', '#5CD0AE'],
  colors: ['#0089BA', '#008F7A'],
  grid: {
    show: false,
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    offsetY: 20,
    labels: {
      colors: [theme.current.value.colors.opposite]
    }
  },
  xaxis: {
    max: props.roundCount + 1,
    labels: {
      show: false
    },
    axisTicks: {
    },
    tooltip: {
      enabled: false,
    }
  },
  yaxis: {
    tickAmount: 2,
    min: 0,
    max: 100,
    decimalsInFloat: 0,
    labels: {
      style: {
        colors: [theme.current.value.colors.opposite]
      }
    }
  },
  tooltip: {
    x: {
      formatter: (val, opts) => {
        const isOver = val === 11
        return isOver
          ? t('simulator.output')
          : `${t('simulator.round')} #${val}`
      }
    },
    y: {
      title: {
        formatter: (name) => {
          return name.replace(' %', ':')
        }
      },
      formatter: (val, opts) => {
        return `${val}%`
      }
    }
  },
  stroke: {
    curve: 'smooth'
  }
}
</script>

<template>
  <v-expansion-panels
    :model-value="props.modelValue ? expansionPanelValue : null"
    @update:model-value="newValue => emit('update:modelValue', newValue === expansionPanelValue)"
    variant="default"
    class="statsDropdown"
  >
    <v-expansion-panel
      :value="expansionPanelValue"
      eager
      elevation="0"
      :bg-color="theme.current.value.colors.background"
    >
      <template #title>
        <div
          class="titleContainer"
          :class="{ 'singleDigit': roundNumber < 10 }"
        >
          <div />
          <h4 class="roundLabel">{{ t('simulator.round') }}</h4>
          <h2 class="roundIndex">{{ Math.min(props.roundCount, roundNumber) }}</h2>
          <div class="roundCount">
            <h4>/ {{ props.roundCount }}</h4>
            <TutorialIconButton :tutorial-key="TutorialKey.RoundHeader" />
          </div>
          <p class="viewStats">
            <transition
              appear
              name="opacity"
            >
              <b v-if="!props.modelValue">{{ t('simulator.view-stats') }}</b>
            </transition>
          </p>
        </div>
      </template>
      <template #text>
        <figure class="statsChart">
          <TutorialIconButton
            :tutorial-key="TutorialKey.RoundStats"
            class="statsTutorial"
          />
          <ApexChart
            height="200"
            width="100%"
            type="line"
            :options="chartOptions"
            :series="series"
          ></ApexChart>
        </figure>
      </template>

    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped lang="scss">
.statsDropdown {
  content-visibility: auto;

  .titleContainer {
    display: grid;

    $toggle-icon-width: 22.5px;
    $view-stats-width: 86px;
    align-items: center;
    width: 100%;

    grid-template-columns: calc($toggle-icon-width + $view-stats-width) 1fr 56px 1fr $view-stats-width;

    &.singleDigit {
      grid-template-columns: calc($toggle-icon-width + $view-stats-width) 1fr 38px 1fr $view-stats-width;
    }

    .viewStats {
      justify-self: end;
      margin-right: 12px;
    }

    .roundIndex {
      background-color: rgb(var(--v-theme-surface));
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
      display: flex;
      gap: 16px;
    }
  }

  :deep(.v-expansion-panel-title__overlay) {
    opacity: 0;
  }

  :deep(.v-expansion-panel-text__wrapper) {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }

  .statsChart {
    margin-left: -16px;
    margin-right: 16px;
    margin-bottom: -36px;

    .statsTutorial {
      position: absolute;
      right: 6px;
      top: 104px;
      z-index: 1;
    }

    :deep(svg.apexcharts-svg) {
      overflow: visible;
    }

    :deep(div.apexcharts-legend-series) {
      display: flex;
      gap: 2px;
    }

    :deep(.apexcharts-tooltip) {
      &>* {
        border: none;
        background-color: #2C1D66;
        color: white;
      }
    }

    :deep(.apexcharts-tooltip-title) {
      margin-bottom: 0;
      padding-bottom: 10px;
    }
  }


}
</style>