import { AesiDefaultConfig } from "~~/utils/aesi/aesi.types"

export const useConfig = defineStore(getKey`config`, () => {
  const { t } = useI18n();

  const selectedDefaultConfigs = ref([AesiDefaultConfig.Standard])
  const walkThroughConfig = computed(() => selectedDefaultConfigs.value.at(-1))

  const noSubBytes = computed(() => walkThroughConfig.value === AesiDefaultConfig.StaticBytes)
  const noMixColumns = computed(() => walkThroughConfig.value === AesiDefaultConfig.StaticColumns)
  const noShiftRows = computed(() => walkThroughConfig.value === AesiDefaultConfig.StaticRows)

  const offMessage = computed(() => `${t('simulator.no-step-configuration')}: ${t(`configure.modal.defaults.${walkThroughConfig.value}.name`)} AES`)

  return {
    selectedDefaultConfigs,
    walkThroughConfig,
    noSubBytes,
    noMixColumns,
    noShiftRows,
    offMessage
  }
}, {
  persist: true
})