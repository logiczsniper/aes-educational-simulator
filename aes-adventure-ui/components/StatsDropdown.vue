<script setup lang="ts">
import { ApexOptions } from "apexcharts";
import ApexChart from "vue3-apexcharts";
import { AesiStatistics } from "~~/utils/statistics/generateStatistics";

const props = defineProps<{
  modelValue: boolean;
  stats: AesiStatistics;
  roundIndex: number;
  roundCount: number;
}>();

const expansionPanelValue = `stat-dropdown`

const { t } = useI18n();

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
  colors: ['#0084DB', '#67BAA6'],
  grid: {
    show: false,
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    offsetY: 20,
    itemMargin: {
      // horizontal: 100
    }
  },
  xaxis: {
    // tickAmount: props.roundCount,
    max: props.roundCount + 1,
    labels: {
      show: false
    },
    axisTicks: {
      // show: false,
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
    // floating: true,
    labels: {
      // show: false,
      // offsetX: 28,
      // offsetY: 16,
      // minWidth: 10,
      // rotate: 270,
      // formatter(val, opts) {
      //   return Math.round(val).toString()
      // }
    }
  },
  tooltip: {
    // custom: ({ series, seriesIndex, dataPointIndex, w }) => {
    //   const thisSeries = series.at(seriesIndex)
    //   const thisPoint = thisSeries ? thisSeries.at(dataPointIndex) : null
    //   return `
    //     <div class="arrow_box">
    //       <span>${thisPoint}</span>
    //     </div>
    //   `
    // }
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
    variant="accordion"
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
          <h2 class="roundIndex">{{ Math.min(props.roundCount, roundNumber) }}</h2>
          <div class="roundCount">
            <h4>/ {{ props.roundCount }}</h4>
            <TutorialIconButton :tutorial-key="TutorialKey.Test" />
          </div>
        </div>

      </template>
      <template #text>
        <figure class="statsChart">
          <TutorialIconButton
            :tutorial-key="TutorialKey.Test"
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
  // position: relative;

  .titleContainer {
    display: grid;

    $toggle-icon-width: 22.5px;
    align-items: center;
    width: 100%;

    grid-template-columns: $toggle-icon-width 1fr 56px 1fr;

    &.singleDigit {
      grid-template-columns: $toggle-icon-width 1fr 38px 1fr;
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
    // position: relative;

    .statsTutorial {
      position: absolute;
      // right: 29px;
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