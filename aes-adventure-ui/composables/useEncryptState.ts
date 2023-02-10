export const useEncryptState = defineStore(getKey`encrypt-state`, () => {
  const plaintext = ref('')
  const key = ref('')

  return {
    plaintext,
    key
  }
}, {
  persist: true
})