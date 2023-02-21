import { AesiKeySize } from "~~/utils/aesi/aesi.types"

export const useEncryptState = defineStore(getKey`encryptState`, () => {
  const plaintext = ref('')
  const key = ref('')
  const keySize = ref<AesiKeySize>(128)

  const setKeySize = (newKeySize: AesiKeySize) => {
    const mustClipKey = newKeySize < keySize.value
    if (mustClipKey) {
      key.value = key.value.substring(0, newKeySize)
    }

    keySize.value = newKeySize
  }

  return {
    plaintext,
    key,
    keySize,
    setKeySize
  }
}, {
  persist: true
})