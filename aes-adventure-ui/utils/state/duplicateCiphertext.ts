export const duplicateCiphertext = () => {
  const encryptState = useEncryptState()
  const decryptState = useDecryptState()

  const ciphertext = encryptState.outputString

  if (decryptState.rawCiphertext !== ciphertext) {
    decryptState.reset()
    decryptState.rawCiphertext = ciphertext
  }
}