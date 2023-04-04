import { aesi } from "~~/utils/aesi"
import { AesiKeySize, AesiOutput, AesiRoundStepType } from "~~/utils/aesi/aesi.types"
import { hexToUint8Array } from "~~/utils/hexToUint8Array"
import '~~/utils/parsingPatches'
import { AesiStatistics, generateDecryptStatistics } from "~~/utils/statistics/generateStatistics"

export enum DecryptStage {
  Input,
  ToState,
  Rounds,
  SymmetryKeyAddition,
  FromState,
  Output,
}

export const useDecryptState = defineStore(getKey`decryptState`, () => {
  const rawCiphertext = ref('')
  const rawKey = ref('')
  const keySize = ref<AesiKeySize>(128)
  const stage = ref(DecryptStage.Input)
  const output = ref<AesiOutput>()
  const roundIndex = ref(0)
  const stepIndex = ref(0)
  const showStats = ref(false)
  const stats = ref<AesiStatistics>()

  const ciphertext = computed(() => hexToUint8Array(rawCiphertext.value))
  const key = computed(() => hexToUint8Array(rawKey.value))
  const round = computed(() => output.value?.rounds.at(roundIndex.value))
  const step = computed(() => round.value?.steps.at(stepIndex.value))
  const isLastStep = computed(() =>
    (roundIndex.value === (output.value?.rounds.length ?? 0) - 1) &&
    (stepIndex.value === (output.value?.rounds.at(-1)?.steps.length ?? 0) - 1)
  )
  const isFirstRound = computed(() => roundIndex.value === 0)
  const isLastRound = computed(() => (roundIndex.value === (output.value?.rounds.length ?? 0) - 1))
  const isSecondToLastRound = computed(() => (roundIndex.value === (output.value?.rounds.length ?? 0) - 2))
  const outputString = computed(() => Array.from(output.value?.block ?? []).map(hexToString).join('') ?? '')
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

  const canComputeDecryptOutput = computed(() => rawCiphertext.value.length === 32 && rawKey.value.length * 4 === keySize.value)
  const computeDecryptOutput = () => {
    const { decrypt } = aesi({
      key: key.value, config: {
        defaultConfig: config.walkThroughConfig
      }
    })

    output.value = decrypt(ciphertext.value)
    stats.value = generateDecryptStatistics(output.value, key.value, decrypt)
    stage.value = DecryptStage.ToState
    roundIndex.value = 0
    stepIndex.value = 0
  }

  const startRounds = () => {
    roundIndex.value = 0
    stepIndex.value = 0
    stage.value = DecryptStage.Rounds
  }

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
    stage.value = DecryptStage.Input
    roundIndex.value = 0
    stepIndex.value = 0
    showStats.value = false
  }

  return {
    output,
    stats,
    stage,
    roundIndex,
    round,
    stepIndex,
    step,
    ciphertext,
    rawCiphertext,
    key,
    rawKey,
    keySize,
    isLastStep,
    isFirstRound,
    isLastRound,
    isSecondToLastRound,
    outputString,
    showStats,
    roundCount,
    setKeySize,
    getStep,
    canComputeDecryptOutput,
    computeDecryptOutput,
    startRounds,
    nextStep,
    nextRound,
    skipToLastRound,
    reset
  }
}, {
  persist: true
})