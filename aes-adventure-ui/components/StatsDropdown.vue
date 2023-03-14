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
      name: "Confusion",
      data: [100, ...props.stats.confusion.slice(0, props.roundIndex)]
    },
    {
      name: "Diffusion",
      data: [0, ...props.stats.diffusion.slice(0, props.roundIndex)]
    }
  ]
})
const chartOptions: ApexOptions = {
  chart: {
    id: "vuechart-example",
    fontFamily: 'Inter',
    toolbar: {
      show: false,
    },

  },
  grid: {
    show: false,
  },
  xaxis: {
    // tickAmount: props.roundCount,
    max: props.roundCount,
    labels: {
      // show: false
    },
    axisTicks: {
      // show: false,

    },
    tooltip: {
      enabled: false,
    }
  },
  yaxis: {
    // tickAmount: 2,
    min: 0,
    max: 100,
    labels: {
      show: false,
      offsetX: -30
    }
  },
  tooltip: {
    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
      const thisSeries = series.at(seriesIndex)
      const thisPoint = thisSeries ? thisSeries.at(dataPointIndex) : null
      return `
        <div class="arrow_box">
          <span>${thisPoint}</span>
        </div>
      `
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
        <figure class="statsChart">
          <ApexChart
            height="200"
            width="102%"
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

  .statsChart {
    margin-left: -20px;

    :deep(svg.apexcharts-svg) {
      overflow: visible;

    }
  }


}
</style>