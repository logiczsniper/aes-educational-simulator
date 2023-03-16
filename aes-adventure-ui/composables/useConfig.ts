import { AesiDefaultConfig } from "~~/utils/aesi/aesi.types"

export const useConfig = defineStore(getKey`config`, () => {
  const selectedDefaultConfigs = ref([AesiDefaultConfig.Standard])
  const walkThroughConfig = computed(() => selectedDefaultConfigs.value.at(-1))

  return {
    selectedDefaultConfigs,
    walkThroughConfig,
  }
}, {
  persist: true
})