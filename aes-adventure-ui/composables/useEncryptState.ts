import { aesi } from "~~/utils/aesi"
import { AesiKeySize, AesiOutput } from "~~/utils/aesi/aesi.types"
import '~~/utils/parsingPatches'

export enum EncryptStage {
  Input,
  ToState,
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

  const plaintext = computed(() => parseInputValue(rawPlaintext.value))
  const key = computed(() => parseInputValue(rawKey.value))

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

  return {
    output,
    stage,
    plaintext,
    rawPlaintext,
    key,
    rawKey,
    keySize,
    setKeySize,
    calculateEncryptOutput
  }
}, {
  persist: true
})