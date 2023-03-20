import { AesiDefaultConfig } from "~~/utils/aesi/aesi.types"

export const useConfig = defineStore(getKey`config`, () => {
  const selectedDefaultConfigs = ref([AesiDefaultConfig.Standard])
  const walkThroughConfig = computed(() => selectedDefaultConfigs.value.at(-1))

  const noSubBytes = computed(() => walkThroughConfig.value === AesiDefaultConfig.StaticBytes)
  const noMixColumns = computed(() => walkThroughConfig.value === AesiDefaultConfig.StaticColumns)
  const noShiftRows = computed(() => walkThroughConfig.value === AesiDefaultConfig.StaticRows)

  return {
    selectedDefaultConfigs,
    walkThroughConfig,
    noSubBytes,
    noMixColumns,
    noShiftRows,
  }
}, {
  persist: true
})