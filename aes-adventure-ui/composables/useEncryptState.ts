import { aesi } from "~~/utils/aesi"
import { AesiKeySize, AesiOutput } from "~~/utils/aesi/aesi.types"
import '~~/utils/parsingPatches'

export enum EncryptStage {
  Input,
  ToState,
  SymmetryKeyAddition,
  Rounds,
  FromState,
}

const parseInputValue = (hex: string) => Uint8Array.from(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) ?? [])

export const useEncryptState = defineStore(getKey`encryptState`, () => {
  const rawPlaintext = ref('')
  const rawKey = ref('')
  const keySize = ref<AesiKeySize>(128)
  const stage = ref(EncryptStage.Input)
  const output = ref<AesiOutput>()
  const roundIndex = ref(0)
  const stepIndex = ref(0)

  const plaintext = computed(() => parseInputValue(rawPlaintext.value))
  const key = computed(() => parseInputValue(rawKey.value))
  const round = computed(() => output.value?.rounds.at(roundIndex.value))
  const step = computed(() => round.value?.steps.at(stepIndex.value))

  const setKeySize = (newKeySize: AesiKeySize) => {
    const mustClipKey = newKeySize < keySize.value
    if (mustClipKey) {
      rawKey.value = rawKey.value.substring(0, newKeySize)
    }

    keySize.value = newKeySize
  }

  const calculateEncryptOutput = () => {
    const { encrypt } = aesi({ key: key.value, config: {} })

    output.value = encrypt(plaintext.value)
    stage.value = EncryptStage.ToState
  }

  const startRounds = () => {
    roundIndex.value = 0
    stepIndex.value = 0
  }

  const nextStep = () => stepIndex.value += 1
  const nextRound = () => {
    roundIndex.value += 1
    stepIndex.value = 0
  }

  const skipToLastRound = () => {
    roundIndex.value = (output.value?.rounds.length ?? 0) - 1
  }

  return {
    output,
    stage,
    roundIndex,
    round,
    stepIndex,
    step,
    plaintext,
    rawPlaintext,
    key,
    rawKey,
    keySize,
    setKeySize,
    calculateEncryptOutput,
    startRounds,
    nextStep,
    nextRound,
    skipToLastRound,
  }
}, {
  persist: true
})