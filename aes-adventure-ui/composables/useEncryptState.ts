import { AesiKeySize } from "~~/utils/aesi/aesi.types"

const parseInputValue = (hex: string) => Uint8Array.from(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) ?? [])

export const useEncryptState = defineStore(getKey`encryptState`, () => {
  const rawPlaintext = ref('')
  const rawKey = ref('')
  const keySize = ref<AesiKeySize>(128)

  const plaintext = computed(() => parseInputValue(rawPlaintext.value))
  const key = computed(() => parseInputValue(rawKey.value))

  const setKeySize = (newKeySize: AesiKeySize) => {
    const mustClipKey = newKeySize < keySize.value
    if (mustClipKey) {
      rawKey.value = rawKey.value.substring(0, newKeySize)
    }

    keySize.value = newKeySize
  }

  return {
    plaintext,
    rawPlaintext,
    key,
    rawKey,
    keySize,
    setKeySize
  }
}, {
  persist: true
})