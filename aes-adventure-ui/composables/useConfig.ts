import { AesiDefaultConfig } from "~~/utils/aesi/aesi.types";

export const useConfig = defineStore(getKey`config`, () => {
  const { t } = useI18n();

  const selection = ref(AesiDefaultConfig.Standard)

  const isStandard = computed(() => selection.value === AesiDefaultConfig.Standard)
  const noSubBytes = computed(() => selection.value === AesiDefaultConfig.StaticBytes)
  const noMixColumns = computed(() => selection.value === AesiDefaultConfig.StaticColumns)
  const noShiftRows = computed(() => selection.value === AesiDefaultConfig.StaticRows)

  const offMessage = computed(() => `${t('simulator.no-step-configuration')}: ${t(`configure.modal.defaults.${selection.value}.name`)} AES`)

  return {
    selection,
    isStandard,
    noSubBytes,
    noMixColumns,
    noShiftRows,
    offMessage
  }
}, {
  persist: true
})