export const useEncryptState = defineStore(getKey`encrypt-state`, () => {
  const plaintext = ref('')
  const key = ref('')
  const keySize = ref<128 | 192 | 256>(128)

  const setKeySize = (newKeySize: 128 | 192 | 256) => {
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