import { aesi } from "~~/utils/aesi"
import { AesiExpandKeyOutput, AesiExpandKeyRoundStepType, AesiKeySize } from "~~/utils/aesi/aesi.types"
import { hexToUint8Array } from "~~/utils/hexToUint8Array"
import '~~/utils/parsingPatches'

export enum KeyExpansionStage {
  Input,
  ToWords,
  Rounds,
  FromWords,
  Output,
}

export const useKeyExpansionState = defineStore(getKey`keyExpansionState`, () => {
  const rawKey = ref('')
  const keySize = ref<AesiKeySize>(128)
  const stage = ref(KeyExpansionStage.Input)
  const output = ref<AesiExpandKeyOutput>()
  const roundIndex = ref(0)
  const stepIndex = ref(0)

  const key = computed(() => hexToUint8Array(rawKey.value))
  const round = computed(() => output.value?.rounds.at(roundIndex.value))
  const step = computed(() => round.value?.steps.at(stepIndex.value))
  const getStep = (stepType: AesiExpandKeyRoundStepType) => round.value?.steps.find(({ type }) => type === stepType)
  const isLastStep = computed(() =>
    (roundIndex.value === (output.value?.rounds.length ?? 0) - 1) &&
    (stepIndex.value === (output.value?.rounds.at(-1)?.steps.length ?? 0) - 1)
  )
  const isLastRound = computed(() => (roundIndex.value === (output.value?.rounds.length ?? 0) - 1))
  const isSecondToLastRound = computed(() => (roundIndex.value === (output.value?.rounds.length ?? 0) - 2))
  const roundCount = computed(() => output.value?.rounds.length ?? 0)

  const outputRoundKeysStrings = computed(() => {
    if (!output.value?.expandedKey) return []

    return groupHex(output.value.expandedKey, 16).map(key => Array.from(key).map(hexToString).join(''))
  })

  const keysGeneratedSoFar = computed(() => {
    const finalKey = (isLastRound.value && stage.value > KeyExpansionStage.Rounds) ? 1 : 0
    switch (keySize.value) {
      case 128: return roundIndex.value + 1 + finalKey
      case 192: return Math.floor((roundIndex.value + 1) * 6 / 4) + finalKey
      case 256: return Math.floor((roundIndex.value + 1) * 8 / 4) + finalKey
      default: return 1
    }
  })

  const keysTotal = computed(() => {
    switch (keySize.value) {
      case 128: return 11
      case 192: return 13
      case 256: return 15
      default: return 1
    }
  })

  const setKeySize = (newKeySize: AesiKeySize) => {
    const mustClipKey = newKeySize < keySize.value
    if (mustClipKey) {
      rawKey.value = rawKey.value.substring(0, newKeySize / 4)
    }

    keySize.value = newKeySize
  }

  const config = useConfig()

  const canComputeKeyExpansionOutput = computed(() => rawKey.value.length * 4 === keySize.value)
  const computeKeyExpansionOutput = () => {
    const { expandedKeyOutput } = aesi({
      key: key.value, config: {
        defaultConfig: config.selection
      }
    })

    output.value = expandedKeyOutput
    stage.value = KeyExpansionStage.ToWords
    roundIndex.value = 0
    stepIndex.value = 0
  }

  const startRounds = () => {
    roundIndex.value = 0
    stepIndex.value = 0
    stage.value = KeyExpansionStage.Rounds
  }

  const nextStep = () => stepIndex.value += 1
  const nextRound = () => {
    roundIndex.value += 1
    stepIndex.value = 0
  }

  const setRound = (newRoundIndex: number) => {
    roundIndex.value = newRoundIndex
    stepIndex.value = 0
  }

  const skipToLastRound = () => {
    roundIndex.value = (output.value?.rounds.length ?? 0) - 1
    stepIndex.value = 0
  }

  const reset = () => {
    output.value = undefined
    stage.value = KeyExpansionStage.Input
    roundIndex.value = 0
    stepIndex.value = 0
  }

  return {
    output,
    stage,
    roundIndex,
    round,
    stepIndex,
    step,
    key,
    rawKey,
    keySize,
    isLastStep,
    isLastRound,
    isSecondToLastRound,
    outputRoundKeysStrings,
    roundCount,
    setKeySize,
    getStep,
    keysTotal,
    keysGeneratedSoFar,
    canComputeKeyExpansionOutput,
    computeKeyExpansionOutput,
    startRounds,
    nextStep,
    nextRound,
    setRound,
    skipToLastRound,
    reset
  }
}, {
  persist: true
})