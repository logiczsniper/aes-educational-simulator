import { aesi } from "~~/utils/aesi"
import { AesiKeySize, AesiOutput, AesiRoundStepType } from "~~/utils/aesi/aesi.types"
import '~~/utils/parsingPatches'
import { AesiStatistics, generateStatistics } from "~~/utils/statistics/generateStatistics"

const parseInputValue = (hex: string) => Uint8Array.from(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) ?? [])

export const useAesiState = (key: string, mode: keyof ReturnType<typeof aesi>) => defineStore(key, () => {
  const rawInput = ref('')
  const rawKey = ref('')
  const keySize = ref<AesiKeySize>(128)
  const output = ref<AesiOutput>()
  const roundIndex = ref(0)
  const stepIndex = ref(0)
  const showStats = ref(false)
  const stats = ref<AesiStatistics>()

  const input = computed(() => parseInputValue(rawInput.value))
  const key = computed(() => parseInputValue(rawKey.value))
  const round = computed(() => output.value?.rounds.at(roundIndex.value))
  const step = computed(() => round.value?.steps.at(stepIndex.value))
  const isLastStep = computed(() =>
    (roundIndex.value === (output.value?.rounds.length ?? 0) - 1) &&
    (stepIndex.value === (output.value?.rounds.at(-1)?.steps.length ?? 0) - 1)
  )
  const isLastRound = computed(() => (roundIndex.value === (output.value?.rounds.length ?? 0) - 1))
  const isSecondToLastRound = computed(() => (roundIndex.value === (output.value?.rounds.length ?? 0) - 2))
  const outputString = computed(() => Array.from(output.value?.block ?? []).map(formatHex).join('') ?? '')
  const roundCount = computed(() => output.value?.rounds.length ?? 0)

  const getStep = (stepType: AesiRoundStepType) => round.value?.steps.find(({ type }) => type === stepType)

  const setKeySize = (newKeySize: AesiKeySize) => {
    const mustClipKey = newKeySize < keySize.value
    if (mustClipKey) {
      rawKey.value = rawKey.value.substring(0, newKeySize / 4)
    }

    keySize.value = newKeySize
  }

  const config = useConfig()
  const computeOutput = () => {
    const aes = aesi({
      key: key.value, config: {
        defaultConfig: config.walkThroughConfig
      }
    })

    const cryptoFn = aes[mode]

    output.value = cryptoFn(input.value)
    stats.value = generateStatistics(output.value, key.value, cryptoFn)
    // stage.value = EncryptStage.ToState
    roundIndex.value = 0
    stepIndex.value = 0
  }

  // const startRounds = () => {
  //   roundIndex.value = 0
  //   stepIndex.value = 0
  //   // stage.value = Rounds
  // }
  const nextStep = () => stepIndex.value += 1
  const nextRound = () => {
    roundIndex.value += 1
    stepIndex.value = 0
  }
  const skipToLastRound = () => {
    roundIndex.value = (output.value?.rounds.length ?? 0) - 1
    stepIndex.value = 0
  }

  const reset = () => {
    output.value = undefined
    roundIndex.value = 0
    stepIndex.value = 0
    // stage.value = Input
    showStats.value = false
  }

  return {
    output,
    stats,
    roundIndex,
    round,
    stepIndex,
    step,
    input,
    rawInput,
    key,
    rawKey,
    keySize,
    isLastStep,
    isLastRound,
    isSecondToLastRound,
    outputString,
    showStats,
    roundCount,
    setKeySize,
    getStep,
    computeOutput,
    // startRounds,
    nextStep,
    nextRound,
    skipToLastRound,
    reset
  }
}, {
  persist: true
})